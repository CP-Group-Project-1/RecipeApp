from django.shortcuts import render
import re, math
from fractions import Fraction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import ShoppingListItem
from .serializers import ShoppingListItemSerializer

# get shopping list item by id
def get_item(id):
    try:
        return ShoppingListItem.objects.get(id=id)
    except:
        return None

# get quantity from Json and handle fractions
def parse_quantity(measure_str):
    if not measure_str:
        return 1
    
    # match fractions and mixed fractions, or whole numbers
    match = re.match(r"^\s*(\d+\s*\d+\/\d+|\d+\/\d+|\d+)",measure_str)
    if match:
        qty_str = match.group(1).strip()
        try:
            if ' ' in qty_str:
                whole, fraction = qty_str.split()
                qty = Fraction(int(whole)) + Fraction(fraction)
            else:
                qty = Fraction(qty_str)
            
            return math.ceil(float(qty))
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

        for meal in meals_data:
            for i in range(1,21):
                ingredient = meal.get(f"strIngredient{i}")
                measure = meal.get(f"strMeasure{i}")
                if ingredient and ingredient.strip():
                    ingredient = ingredient.strip()
                    qty_to_add = parse_quantity(measure)
                    shopping_item, created = ShoppingListItem.objects.get_or_create(user=user, item=ingredient)

                    if created:
                        shopping_item.qty = qty_to_add
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
            return Response(f'Item does not exist.', status=status.HTTP_404_NOT_FOUNT)
        else:
            item.delete()
            return Response({"message": "Item removed from shopping list."}, status=status.HTTP_200_OK)
    

