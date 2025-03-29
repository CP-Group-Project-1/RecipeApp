from django.urls import path
from .views import ShoppingListItems, ShoppingListItemDetail, SendShoppingListEmailView

urlpatterns = [
    path("", ShoppingListItems.as_view(),  name="shopping_list"),
    path("<int:id>", ShoppingListItemDetail.as_view(), name="item_detail"),
    path("send-email/", SendShoppingListEmailView.as_view(), name="send_email"),
]
