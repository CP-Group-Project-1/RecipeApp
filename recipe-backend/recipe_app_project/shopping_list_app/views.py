from django.shortcuts import render
import re, math
from fractions import Fraction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingListItem
from .serializers import ShoppingListItemSerializer
from .units import parse_measure, best_unit, Q_
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt




def get_item(id):
    try:
        return ShoppingListItem.objects.get(id=id)
    except:
        return None

# determine if ingredient should be skipped
SKIP_INGREDIENTS = ["water"]
def skip_ingredient(ingredient):
    return ingredient.strip().lower() in SKIP_INGREDIENTS


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
                measure = meal.get(f"strMeasure{i}")

                if not ingredient or not ingredient.strip():
                    continue

                ingredient = ingredient.strip().lower()

                if skip_ingredient(ingredient):
                    continue

                qty = parse_measure(measure)
                if qty is None:
                    continue

                # Handle items without a measuring unit
                if str(qty.units) == "[dimensionless]":
                    existing = ShoppingListItem.objects.filter(
                        user=user,
                        item=ingredient,
                        measure__isnull=True
                    ).first()

                    if existing:
                        existing.qty += float(qty.magnitude)
                        existing.save()
                        items.append(existing)
                    else:
                        new = ShoppingListItem(user=user, item=ingredient, qty=float(qty.magnitude))
                        new.save()
                        items.append(new)
                    continue

                compact_qty = qty.to_compact()
                unit = f"{compact_qty.units:~}".strip().lower()

                # Search for existing ingredient
                existing_items = ShoppingListItem.objects.filter(user=user, item=ingredient)

                matched = None
                for entry in existing_items:
                    if entry.measure:
                        try:
                            existing_qty = Q_(float(entry.qty), entry.measure)
                            if qty.check(existing_qty):  # same dimensionality
                                matched = entry
                                break
                        except Exception as e:
                            print("Check failed:", e)
                            continue

                if matched:
                    try:
                        total_qty = Q_(float(matched.qty), matched.measure) + qty.to(matched.measure)
                        compact_total = best_unit(total_qty)
                        matched.qty = compact_total.magnitude
                        matched.measure = f"{compact_total.units:~}"
                        matched.save()
                        items.append(matched)
                    except Exception as e:
                        print("Unit conversion failed:", e)
                        new = ShoppingListItem(user=user, item=ingredient, qty=compact_qty.magnitude, measure=unit)
                        new.save()
                        items.append(new)
                else:
                    new = ShoppingListItem(user=user, item=ingredient, qty=compact_qty.magnitude, measure=unit)
                    new.save()
                    items.append(new)

        if items:
            return Response({"message": "Ingredients have been added to your shopping list."}, status=status.HTTP_201_CREATED)
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