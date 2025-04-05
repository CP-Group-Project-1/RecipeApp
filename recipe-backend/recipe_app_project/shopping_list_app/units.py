from pint import UnitRegistry, Quantity
from fractions import Fraction
import re

ureg = UnitRegistry()
Q_ = ureg.Quantity

CUSTOM_UNITS = {"can", "cans", "clove", "cloves", "handful", "knob", "large", "chopped"}

SKIP_INGREDIENTS = {"water"}

def skip_ingredient(ingredient):
    return ingredient.strip().lower() in SKIP_INGREDIENTS

def parse_measure(measure_str):
    try:
        if not measure_str or measure_str.strip() == "":
            return None
        return Q_(measure_str.strip().lower())
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

def format_quantity(qty):
    if isinstance(qty, (int, float)):
        return str(Fraction(qty).limit_denominator(8))
    if hasattr(qty, "magnitude"):
        if qty.dimensionless:
            return str(Fraction(qty.magnitude).limit_denominator(8))
        return f"{Fraction(qty.magnitude).limit_denominator(8)} {qty.units:~}"
    return str(qty)



