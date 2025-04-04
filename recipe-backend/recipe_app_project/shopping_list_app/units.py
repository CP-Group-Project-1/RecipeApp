# yourapp/units.py
from pint import UnitRegistry
from fractions import Fraction

ureg = UnitRegistry()
Q_ = ureg.Quantity

def parse_measure(measure_str):
    if not measure_str:
        return Q_("1 unit")
    try:
        parts = measure_str.strip().lower().split()
        if len(parts) >=2:
            if "/" in parts[1]:
                qty = float(parts[0]) + float(Fraction(parts[1]))
                unit = parts[2] if len(parts) > 2 else "unit"
            else:
                qty = float(Fraction(parts[0]))
                unit = parts[1]
        elif len(parts) == 1:
            qty = float(Fraction(parts[0]))
            unit = "unit"
        else:
            return Q_("1 unit")
        return Q_(qty, unit)
    except Exception:
        return Q_("1 unit")


def best_unit(qty):
    preferred_units = ["cup", "tbsp", "tsp", "ml", "l", "cloves"]
    
    for u in preferred_units:
        try:
            converted = qty.to(u)
            # If it's in a readable range, use it
            if 0.25 <= converted.magnitude <= 100:
                return converted
        except Exception:
            continue

    # Absolute fallback: manually force to "cup" or "ml" for uncommon units
    try:
        if qty.dimensionality == Q_("1 cup").dimensionality:
            return qty.to("cup")
        if qty.dimensionality == Q_("1 ml").dimensionality:
            return qty.to("ml")
    except Exception:
        pass

    # Last resort return the original quantity
    return qty

