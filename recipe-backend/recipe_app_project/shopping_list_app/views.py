from django.shortcuts import render
import re, math
from fractions import Fraction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingListItem
from .serializers import ShoppingListItemSerializer
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# get shopping list item by id
IGNORE_UNITS = ["g", "ml", "tsp", "tbsp", "cup", "cups", "pint", "pints", "Grams", "Topping", "Pot", "oz", "can", "cans" ]

KEEP_MEASURES = ["lb", "lbs", "kg", "kgs", "pound", "pounds", "oz", "cloves"]

SKIP_INGREDIENTS = ["water"]

def get_item(id):
    try:
        return ShoppingListItem.objects.get(id=id)
    except:
        return None

# determine if ingredient should be skipped
def skip_ingredient(ingredient):
    return ingredient.strip().lower() in SKIP_INGREDIENTS

#determine if measure needed for shopping list
def measure_needed(measure):
    if not measure:
        return False
    for unit in KEEP_MEASURES:
        if unit in measure.lower():
            return unit
    return None

# get quantity from Json and handle fractions
def parse_quantity(measure_str):
    if any(unit in measure_str.lower() for unit in IGNORE_UNITS):
        return 1
    try:
        #handle mixed fractions
        match = re.match(r"^\s*(\d+)\s+(\d+)\/(\d+)", measure_str)
        if match:
            whole = int(match.group(1))
            numerator = int(match.group(2))
            denominator = int(match.group(3))
            qty = whole + Fraction(numerator, denominator)
            return math.ceil(float(qty))
        
        # handle simple fraction
        match = re.match(r"^\s*(\d+)\/(\d+)", measure_str)
        if match:
            numerator = int(match.group(2))
            denominator = int(match.group(3))
            qty = Fraction(numerator, denominator)
            return math.ceil(float(qty))
        
        #handle whole numbers
        match = re.match(r"^\s*(\d+)", measure_str)
        if match:
            return int(match.group(1))
    
    except (ValueError, ZeroDivisionError):
            return 1
    return 1


class ShoppingListItems(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = ShoppingListItem.objects.filter(user=request.user)
        serializer = ShoppingListItemSerializer(items, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        meals_data = request.data.get("meals",[])
        user = request.user
        items = []

        # loop through ingredients
        for meal in meals_data:
            for i in range(1,21):
                ingredient = meal.get(f"strIngredient{i}")
                measure = meal.get(f"strMeasure{i}")

                if ingredient and ingredient.strip():
                    ingredient = ingredient.strip()

                    # don't include ingredients like water
                    if skip_ingredient(ingredient):
                        continue
                    
                    # get measure description for weight
                    unit = measure_needed(measure)

                    if unit:
                        qty_to_add = parse_quantity(measure)
                        stored_measure = unit
                    else:
                        qty_to_add = parse_quantity(measure)
                        stored_measure = None

                    #create item in shopping list    
                    shopping_item, created = ShoppingListItem.objects.get_or_create(user=user, item=ingredient)

                    if created:
                        shopping_item.qty = qty_to_add
                        if measure_needed(measure):
                            shopping_item.measure = stored_measure
                    else:
                        shopping_item.qty += qty_to_add
                    shopping_item.save()

                    items.append(shopping_item)
        
        if items:
            return Response({"message": "Ingredients added to shopping list."}, status=status.HTTP_201_CREATED)
        return Response({"message": "No ingredients to add."}, status=status.HTTP_400_BAD_REQUEST)
    
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
    
#
class SendShoppingListEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        items = ShoppingListItem.objects.filter(user=user)
        shopping_list = "\n".join(f"-{item.qty} {item.measure or ''} {item.item}".strip() for item in items)
        subject = "Your Shopping List"
        message = f"Hello, \n\nHere is your shopping list:\n\n{shopping_list}"

        send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return Response({"message": "Shopping list sent."})