from django.shortcuts import render
import re, math
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingListItem
from .serializers import ShoppingListItemSerializer
from .units import parse_measure, parse_custom_units, best_unit, skip_ingredient, Q_, UNIT_DISPLAY_NAMES, is_spice
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt




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

                # Do no include undesired ingredients
                if skip_ingredient(ingredient):
                    continue
                
                # Handle spices with default qty of 1
                if is_spice(ingredient):
                    if ShoppingListItem.objects.filter(user=user, item=ingredient).exists():
                        continue
                    new = ShoppingListItem(user=user, item=ingredient, qty=1, measure="")
                    new.save()
                    items.append(new)
                    continue


                qty = parse_measure(measure_str)

                # Fallback to custom unit parsing
                if qty is None:
                    custom_qty, custom_unit = parse_custom_units(measure_str)
                    if custom_qty is not None and custom_unit:
                        existing = ShoppingListItem.objects.filter(
                            user=user,
                            item=ingredient,
                            measure=custom_unit
                        ).first()

                        if existing:
                            existing.qty = float(existing.qty) + float(custom_qty)
                            existing.save()
                            items.append(existing)
                        else:
                            new = ShoppingListItem(user=user, item=ingredient, qty=custom_qty, measure=custom_unit)
                            new.save()
                            items.append(new)
                        continue
                    else:
                        continue  # Skip if no valid quantity could be parsed

                # Pint-compatible quantity
                unit = None if qty.dimensionless else f"{qty.units:~}"
                display_unit = UNIT_DISPLAY_NAMES.get(unit, unit) if unit else None

                # Attempt to combine with any matching item
                existing_items = ShoppingListItem.objects.filter(user=user, item=ingredient)

                matched = None
                for entry in existing_items:
                    try:
                        if not entry.measure and unit is None:
                            matched = entry
                            break
                        elif entry.measure and unit:
                            existing_qty = Q_(float(entry.qty), entry.measure)
                            if qty.check(existing_qty):
                                matched = entry
                                break
                    except Exception:
                        continue

                if matched:
                    try:
                        if matched.measure and unit:
                            base_qty = Q_(float(matched.qty), matched.measure)
                            if qty.check(base_qty):
                                total_qty = base_qty + qty.to(matched.measure)
                                normalized = best_unit(total_qty)

                                matched.qty = float(normalized.magnitude if hasattr(normalized, "magnitude") else normalized)
                                raw_unit = f"{normalized.units:~}" if hasattr(normalized, "units") else matched.measure
                                matched.measure = UNIT_DISPLAY_NAMES.get(raw_unit, raw_unit)
                            else:
                                # Units are incompatible – skip this merge attempt
                                continue
                        else:
                            matched.qty = float(matched.qty) + float(qty.magnitude if hasattr(qty, "magnitude") else qty)

                        matched.save()
                        items.append(matched)
                    except Exception:
                        continue    
                else:
                    new = ShoppingListItem(user=user, item=ingredient, qty=qty.magnitude if hasattr(qty, "magnitude") else qty, measure=unit)
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
        shopping_list_items = []
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
            
            shopping_list_items.append(f"-{qty_str} {item.item}".strip())

        subject = "Your Shopping List"
        message = f"Hello, \n\nHere is your shopping list:\n\n" + "\n".join(shopping_list_items) + "\n\nBest regards,\nYour Cook-N-Cart Team"

        send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return Response({"message": "Shopping list sent."})