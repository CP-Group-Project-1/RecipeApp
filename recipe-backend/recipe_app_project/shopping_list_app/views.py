from django.shortcuts import render
import re, math, json
from fractions import Fraction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingListItem
from .serializers import ShoppingListItemSerializer
from pint import Quantity
from .units import parse_measure, best_unit, Q_, skip_ingredient, is_spice,UNIT_DISPLAY_NAMES, clean_suffix, normalize_unit
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from google import genai
from os import getenv
from django.core.exceptions import ValidationError
import logging #TODO Comment out when done with development
logger = logging.getLogger(__name__)

gemini_api_key = getenv('GEMINI_API_KEY')



def get_item(id):
    try:
        return ShoppingListItem.objects.get(id=id)
    except:
        return None

class ShoppingListItems(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = ShoppingListItem.objects.filter(user=request.user)
        serializer = ShoppingListItemSerializer(items, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        meals_data = request.data.get("meals", [])
        user = request.user
        items = []

        for meal in meals_data:
            for i in range(1, 21):
                ingredient = meal.get(f"strIngredient{i}")
                measure_str = meal.get(f"strMeasure{i}")

                if not ingredient or not ingredient.strip():
                    continue

                ingredient = ingredient.strip().lower()

                # Do not include undesired ingredients
                if skip_ingredient(ingredient):
                    continue
                
                # Give spices a default qty of 1
                if is_spice(ingredient):
                    if ShoppingListItem.objects.filter(user=user, item=ingredient).exists():
                        continue
                    new = ShoppingListItem(user=user, item=ingredient, qty=1, measure="")
                    new.save()
                    items.append(new)
                    continue

                measure_str = measure_str.strip() if measure_str else ""
                qty, cleaned_unit, suffix = parse_measure(measure_str)

                if qty is None:
                    continue 

                # Handle descriptors
                if suffix and len(ingredient.split()) < 2:
                    suffix_cleaned = clean_suffix(suffix)
                    if suffix_cleaned:
                        ingredient = f"{suffix} {ingredient}".strip()

                # Try to use Pint to parse the quantity
                if isinstance(qty, Quantity):
                    unit = None if qty.dimensionless else f"{qty.units:~}"
                    cleaned_unit = normalize_unit(unit) if unit else ""

                    matched = None
                    existing_items = ShoppingListItem.objects.filter(user=user, item=ingredient)
                    
                    # check for existing items with the same ingredient
                    for entry in existing_items:
                        try:
                            if not entry.measure and not cleaned_unit:
                                matched = entry
                                break
                            elif entry.measure and cleaned_unit:
                                if normalize_unit(entry.measure) == cleaned_unit:
                                    matched = entry
                                    break
                                existing_qty = Q_(float(entry.qty), entry.measure)
                                if qty.check(existing_qty):
                                    matched = entry
                                    break
                        except Exception:
                            continue

                    if matched:
                        try:
                            if matched.measure and cleaned_unit:
                                base_qty = Q_(float(matched.qty), matched.measure)
                                if qty.check(base_qty):
                                    total_qty = base_qty + qty.to(matched.measure)
                                    normalized = best_unit(total_qty)

                                    matched.qty = float(getattr(normalized, "magnitude", normalized))
                                    raw_unit = f"{normalized.units:~}" if hasattr(normalized, "units") else matched.measure
                                    matched.measure = UNIT_DISPLAY_NAMES.get(raw_unit, raw_unit)
                                else:
                                    continue
                            else:
                                matched.qty = float(matched.qty) + float(getattr(qty, "magnitude", qty))

                            matched.save()
                            items.append(matched)
                        except Exception:
                            continue
                    else:
                        new = ShoppingListItem(
                            user=user,
                            item=ingredient,
                            qty=qty.magnitude if hasattr(qty, "magnitude") else qty,
                            measure=cleaned_unit,
                        )
                        new.save()
                        items.append(new)
                
                # if not a Pint object, handle as a plain number
                else:
                    
                    existing = ShoppingListItem.objects.filter(
                        user=user,
                        item=ingredient,
                    ).filter(measure__iexact=cleaned_unit).first()

                    if existing:
                        existing.qty = float(existing.qty) + qty
                        existing.save()
                        items.append(existing)
                    else:
                        new = ShoppingListItem(user=user, item=ingredient, qty=qty, measure=cleaned_unit)
                        new.save()
                        items.append(new)

        if items:
            return Response({"message": "Ingredients added to shopping list."}, status=status.HTTP_201_CREATED)
        return Response({"message": "No valid ingredients to add."}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        ShoppingListItem.objects.filter(user=request.user).delete()
        return Response({"message": "Shopping list cleared."}, status=status.HTTP_200_OK)

class ShoppingListItemDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        item = get_item(id)
        if item is None:
            return Response(f'Item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = ShoppingListItemSerializer(item)
            return Response(serializer.data)
    
    def patch(self, request, id):
        item = get_item(id)
        new_qty = request.data.get("qty")

        try:
            new_qty = float(new_qty)
        except:
            return Response({"error": "Quantity must be a number."}, status=status.HTTP_400_BAD_REQUEST)
        
        if new_qty <= 0:
            return Response({"error": "Quantity must be greater than 0."}, status=status.HTTP_400_BAD_REQUEST)
        if item is None:
            return Response(f'Item does not exist.', status=status.HTTP_404_NOT_FOUND)
        
        item.qty = new_qty
        item.save()
        return Response({"message": "Item updated."}, status=status.HTTP_200_OK)
            

    def delete(self, request, id):
        item = get_item(id)
        if item is None:
            return Response(f'Item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            item.delete()
            return Response({"message": "Item removed from shopping list."}, status=status.HTTP_200_OK)
    
@method_decorator(csrf_exempt, name='dispatch')
class SendShoppingListEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        items = ShoppingListItem.objects.filter(user=user)
        shopping_list_dict = {}  # Stores item as key, value is the quantiy string
        ingredient_categories = [
            'Produce', 'Meat & Seafood', 'Dairy', 'Canned Goods', 'Baking', 'Dry Goods & Pasta',
            'Condiments', 'Bread', 'Spices', 'Candies'
            ]
        prompt = f"Classify the ingredients provided into one of the following categories, {ingredient_categories}\n\nIngredients are:\n"
        ingredients_for_prompt = []  # Store in array to prevent to keep rebuilding the prompt string for each ingredient
        ingredient_ctr = 1

        for item in items:
            if item.measure:
                try:
                    qty = Q_(item.qty, item.measure)
                    display = best_unit(qty)
                    qty_str = f"{display.magnitude:.2f} {display.units:~}"
                except:
                    qty_str = f"{item.qty:.2f} {item.measure}"
            else:
                qty_str = str(item.qty)
            
            #shopping_list_items.append(f"\u2022{qty_str} {item.item}".strip() + '\n')
            shopping_list_dict[item.item] = qty_str.strip()
            ingredients_for_prompt.append(f'{ingredient_ctr}.) {item.item}\n')
            ingredient_ctr += 1

        ingredients_for_prompt.append('\nReturn Only valid JSON format without any explanantion, markdown formatting, or code blocks. Use double quotes on keys and values, example: {"Beef": "Meat & Seafood", "Basil": "Spices"}')

        prompt += ''.join(ingredients_for_prompt)
        logger.info('Prompt to send below')
        logger.info(prompt)
        logger.info('*' * 50)
        logger.info(shopping_list_dict)

        #API call to to google model
        client = genai.Client(api_key=gemini_api_key)
        try:
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )

            logger.info('response.text below')
            logger.info(response.text)
            logger.info('*' * 50)

            # Convert text to dict
            response_dict = json.loads(response.text)
        except json.JSONDecodeError as err:
            logger.info(f'Failure occured during gemini. Failure is {err}')
            raise ValidationError(f'Failure occured during gemini. Failure is {err} | {response.text}')


        # Stores Category as key and its respective value a list object with corrsponding ingredients
            # i.e {'Dry Goods & Pasta': ['rice'], 'Produce': ['onion', 'lime', 'garlic clove', 'cucumber', 'carrots']}
        tmp_dict = {} 

        # Iterate thru dict and create key value pairs
        for ingredient_key in response_dict:
            category = response_dict[ingredient_key]
            if category in tmp_dict:
                tmp_dict[category].append(ingredient_key)
            else:
                tmp_dict[category] = [ingredient_key]

        logger.info(response.text)
        logger.info(tmp_dict)

        # Will store the Category as key and its respective value the corresponging ingrediesnt and qty needed strings
        msg_dict = {}

        # Iterate thru dict. each key has an array object of ingredients that are keys in the shopping_list_dict
        for category in tmp_dict:

            if category not in msg_dict:
                #logger.info(f'Adding category [{category}]')
                msg_dict[category] = []

            #logger.info(category)
            # Iterate thru array
            for ingredient_key in tmp_dict[category]:
                #logger.info(ingredient_key)
                msg_dict[category].append(f'\u2022{shopping_list_dict[ingredient_key]} {ingredient_key}\n')

        message = 'Hello, \n\nHere is your shopping list:\n\n'
        for category in msg_dict:
            message += f"{category}:\n{''.join(msg_dict[category])}\n"


        logger.info(f'Customer messgage = {message}')
        subject = "Your Shopping List"
        html_template = 'email_shopping_list.html'
        
        #message = f"Hello, \n\nHere is your shopping list:\n\n" + "\n".join(shopping_list_items) + "\n\nBest regards,\nYour Cook-N-Cart Team"
        
        convert_to_html = render_to_string(
            template_name = html_template,
            context = {"message": message}
        )

        
        send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
            html_message=convert_to_html
        )
        return Response({"message": "Shopping list sent."})