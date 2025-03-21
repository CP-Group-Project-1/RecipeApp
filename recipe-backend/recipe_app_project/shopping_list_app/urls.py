from django.urls import path
from .views import ShoppingListItems, ShoppingListItemDetail

urlpatterns = [
    path("", ShoppingListItems.as_view(),  name="shopping_list"),
    path("<int:id>", ShoppingListItemDetail.as_view(), name="item_detail"),
]
