
from django.core.exceptions import ValidationError
import re

def match_regex(rcv_regex, rcv_str):
    """
    This method uses the re.match method
    Args:
        rcv_regex: Datatype, r_string with regex pattern
        rcv_str: Datatype, string to conduct regex with
    Returns Boolean True/False
    """
    if re.match(rcv_regex, rcv_str) == None:
        return False
    else:
        return True
    
def validate_id_meal(id_meal):
    """ 
    Only accepts string in the following format "00000" 
    (Ensures there are numbers) 
    """
    print(id_meal)
    regex = r"^[\d]{5}"
    err_msg = 'Combination must be in the format "00000"'
    
    if match_regex(regex, id_meal):
        return id_meal
    else:
        raise ValidationError(err_msg, params={'id_meal': id_meal})
    



