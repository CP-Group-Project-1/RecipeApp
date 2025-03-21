
from rest_framework import serializers
from .models import Saved_Recipes

class SavedRecipesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saved_Recipes
        fields = '__all__'  # Return all fields
        depth = 1


    @staticmethod  # Is a standalone method, does not need self
    def serialize_clean(serialize_maint_addresses):
        """ THis method removes data so its not displayed """
        data_remove_dict = {
            "user_id": ["password", "last_login", "is_superuser", "is_staff", "is_active",
                                "groups", "user_permissions"]

        }

        #TODO: For now adding control here. NOt best solution because it itearetes over the entire nested dicts. 
        # THis should be handled by the serializer, using the SerilizaerMethod concept
        # Convert to list of nested dicts, since the object passed in is immutable
        serialized_data_list = list(serialize_maint_addresses.data)

        for nested_dict in serialized_data_list:
            for tmp_key in data_remove_dict:
                if tmp_key in nested_dict:
                    for rmv_key in data_remove_dict[tmp_key]:
                        del nested_dict[tmp_key][rmv_key]

            

        return serialized_data_list






