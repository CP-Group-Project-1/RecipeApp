from pint import UnitRegistry, Quantity
from fractions import Fraction
import re

ureg = UnitRegistry()
Q_ = ureg.Quantity

CUSTOM_UNITS = {"can", "cans", "handful", "knob", "large", "chopped"}

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

SPICES = {
    "nutmeg", "mustard powder", "salt", "pepper", "coriander", "garlic powder", 
    "onion powsder", "paprika", "cayenne", "chili powder", "cinnamon", 
    "turmeric", "ginger", "allspice", "fennel seeds", "cumin", 
    "black pepper", "white pepper", "sugar", "brown sugar"}

UNIT_ADJECTIVES = {
    "finely", "coarsely", "roughly", "thinly", "thickly", "grated",
    "chopped", "sliced", "minced", "peeled", "crushed", "shredded",
    "ground", "beaten", "mashed", "medium"
}

UNIT_ALIASES = {
    "tbs": "tbsp",
    "tbl": "tbsp",
    "tbls": "tbsp",
    "tablespoon": "tbsp",
    "tbspn": "tbsp",
    "tspn": "tsp",
    "gms": "g",
    "kg.": "kg",
    "ozs": "oz",
    "ltrs": "l",
    "litre": "l",
    "millilitres": "ml",
    "milliliter": "ml"
}

def skip_ingredient(ingredient):
    return ingredient.strip().lower() in SKIP_INGREDIENTS

def is_spice(ingredient):
    return ingredient.strip().lower() in SPICES

#remove adjectives from ingredient
def clean_unit(unit):
    words = unit.lower().strip().split()
    cleaned = [word for word in words if word not in UNIT_ADJECTIVES]
    return " ".join(cleaned)

def clean_suffix(suffix):
    words = suffix.lower().strip().split()
    return " ".join(w for w in words if w not in UNIT_ADJECTIVES)

def normalize_unit(unit):
    unit = clean_unit(unit.lower().strip().rstrip("."))
    return UNIT_ALIASES.get(unit, unit)


def extract_qty_and_unit(measure_str):
    measure_str = measure_str.strip()
    parts = measure_str.split()

    qty = None
    unit = ""
    suffix = ""

    # Handle '1 1/4 cup something'
    if len(parts) >= 3 and re.match(r"^\d+$", parts[0]) and re.match(r"^\d+\/\d+$", parts[1]):
        qty = float(Fraction(parts[0])) + float(Fraction(parts[1]))
        unit = normalize_unit(parts[2])
        suffix = " ".join(parts[3:])

    # Handle '3/4 cup something'
    elif len(parts) >= 2 and re.match(r"^\d+\/\d+$", parts[0]):
        qty = float(Fraction(parts[0]))
        unit = normalize_unit(parts[1])
        suffix = " ".join(parts[2:])

    # Handle '2 cup something'
    elif len(parts) >= 2 and re.match(r"^\d+(\.\d+)?$", parts[0]):
        qty = float(parts[0])
        unit = normalize_unit(parts[1])
        suffix = " ".join(parts[2:])

    # Handle just a single unit (e.g., "bunch")
    elif len(parts) == 1:
        if re.match(r"^\d+(\.\d+)?$", parts[0]):
            qty = float(parts[0])
            unit = ""
        else:
            qty = 1
            unit = normalize_unit(parts[0])
        suffix = ""

    return qty, unit, suffix



def parse_measure(measure_str):
    if not measure_str:
        return None, None, None

    measure_str = measure_str.strip()

    # Try converting "1 1/4" into "1.25" for Pint
    match = re.match(r"^(\d+)\s+(\d+/\d+)", measure_str)
    if match:
        whole = match.group(1)
        fraction = match.group(2)
        decimal = float(Fraction(whole)) + float(Fraction(fraction))
        rest = measure_str[match.end():]  # anything after the mixed fraction
        measure_str = f"{decimal} {rest.strip()}"

    try:
        qty_obj = ureg(measure_str)
        if qty_obj.dimensionless:
            return qty_obj.magnitude, "", ""
        unit = f"{qty_obj.units:~}"
        return qty_obj.magnitude, normalize_unit(unit), ""
    except Exception:
        pass

    # Try custom units
    match = re.match(r"([\d/.]+)\s+([a-zA-Z\s]+)", measure_str)
    if match:
        qty_str = match.group(1).strip()
        unit_str = match.group(2).strip().lower()

        if unit_str in CUSTOM_UNITS:
            normalized = unit_str.rstrip("es") if unit_str.endswith("es") else unit_str.rstrip("s")
            try:
                return float(eval(qty_str)), normalize_unit(normalized), ""
            except:
                pass

    # Fallback
    return extract_qty_and_unit(measure_str)

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


