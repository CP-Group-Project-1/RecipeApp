from pint import UnitRegistry, Quantity
from fractions import Fraction
import re

ureg = UnitRegistry()
Q_ = ureg.Quantity

CUSTOM_UNITS = {"can", "cans", "clove", "cloves", "handful", "knob", "large", "chopped"}

SKIP_INGREDIENTS = {"water"}

UNIT_DISPLAY_NAMES = {
    "cp": "cup",
    "pin": "pinch",
    "knob": "knob",
    "tbsp": "tbsp",
    "tsp": "tsp",
    "oz": "oz",
    "g": "g",
    "kg": "kg",
    "ml": "ml",
    "l": "l"
}

SPICES = {"nutmeg", "mustard powder", "salt", "pepper", "coriander", "garlic powder", "onion powsder", "paprika", "cayenne", "chili powder", "cinnamon", "cloves", "cardamom", "turmeric", "ginger", "allspice", "fennel seeds", "cumin", "black pepper", "white pepper"}

def skip_ingredient(ingredient):
    return ingredient.strip().lower() in SKIP_INGREDIENTS

def is_spice(ingredient):
    return ingredient.strip().lower() in SPICES

def parse_measure(measure_str):
    try:
        if not measure_str or not measure_str.strip():
            return None

        cleaned = measure_str.strip().lower()

        # Match: number (int/float/fraction) + single unit word
        match = re.match(r"([\d/.\s]+)\s*([a-zA-Z]+)", cleaned)
        if match:
            qty = match.group(1).strip()
            unit = match.group(2).strip()
            return Q_(f"{qty} {unit}")

        return None
    except Exception:
        return None


def parse_custom_units(measure_str: str):
    if not measure_str:
        return None, None

    measure_str = measure_str.strip().lower()
    match = re.match(r"([\d/.]+)\s+([a-zA-Z\s]+)", measure_str)
    if match:
        qty = match.group(1).strip()
        unit = match.group(2).strip()

        if unit in CUSTOM_UNITS:
            normalized = unit.rstrip("es") if unit.endswith("es") else unit.rstrip("s")
            try:
                return float(eval(qty)), normalized
            except:
                return None, None
    return None, None

def best_unit(qty: Quantity):
    if qty.dimensionless:
        return qty.magnitude

    preferred_units = ["cup", "tbsp", "tsp", "oz", "g", "kg", "ml", "l"]

    for u in preferred_units:
        try:
            converted = qty.to(u)
            if 0.25 <= converted.magnitude <= 100:
                return converted
        except Exception:
            continue

    try:
        if qty.dimensionality == Q_("1 cup").dimensionality:
            return qty.to("cup")
        elif qty.dimensionality == Q_("1 g").dimensionality:
            return qty.to("g")
        elif qty.dimensionality == Q_("1 ml").dimensionality:
            return qty.to("ml")
    except Exception:
        pass

    return qty.to_base_units()

# def format_quantity(qty):
#     def to_mixed_string(frac: Fraction):
#         if frac.denominator == 1:
#             return str(frac.numerator)
#         whole = frac.numerator // frac.denominator
#         remainder = frac - whole
#         if whole == 0:
#             return str(remainder)
#         return f"{whole} {abs(remainder)}"

#     if isinstance(qty, (int, float)):
#         return to_mixed_string(Fraction(qty).limit_denominator(8))

#     if hasattr(qty, "magnitude"):
#         if qty.dimensionless:
#             return to_mixed_string(Fraction(qty.magnitude).limit_denominator(8))
#         unit = f"{qty.units:~}"
#         display_unit = UNIT_DISPLAY_NAMES.get(unit, unit)
#         return f"{to_mixed_string(Fraction(qty.magnitude).limit_denominator(8))} {display_unit}"

    # return str(qty)




