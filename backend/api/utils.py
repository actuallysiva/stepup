"""Helpers for string primary keys (mirrors MySQL trigger logic)."""
import re
from django.db.models.functions import Length

#def generate_id(prefix, model):
#    count = model.objects.count() + 1
#    return f"{prefix}{str(count).zfill(3)}"

def generate_id(prefix, model, field_name=None):
    if field_name is None:
        field_name = model._meta.pk.name

    # Filter by prefix (case-insensitive) to ensure we only compare relevant IDs
    queryset = model.objects.filter(**{f"{field_name}__istartswith": prefix})

    # Sort by ID length descending first, then by ID descending to handle lexicographical sorting correctly
    last = queryset.annotate(pk_len=Length(field_name)).order_by("-pk_len", f"-{field_name}").first()

    if last:
        value = getattr(last, field_name)
        match = re.search(r"\d+", value)
        if match:
            next_number = int(match.group()) + 1
        else:
            next_number = 1
    else:
        next_number = 1

    return f"{prefix}{next_number:03d}"

def get_or_create_color(color_name):
    from .models import Color

    color = Color.objects.filter(color_name__iexact=color_name.strip()).first()
    if color:
        return color
    color_id = generate_id("color", Color)
    return Color.objects.create(color_id=color_id, color_name=color_name.strip())


def get_or_create_size(size_no):
    from .models import Size

    size = Size.objects.filter(size_no=size_no).first()
    if size:
        return size
    size_id = generate_id("size", Size)
    return Size.objects.create(size_id=size_id, size_no=size_no)


def get_or_create_brand(brand_name):
    from .models import Brand

    brand = Brand.objects.filter(brand_name__iexact=brand_name.strip()).first()
    if brand:
        return brand
    brand_id = generate_id("brand", Brand)
    return Brand.objects.create(brand_id=brand_id, brand_name=brand_name.strip())


def get_or_create_category(cat_name):
    from .models import Category

    category = Category.objects.filter(cat_name__iexact=cat_name.strip()).first()
    if category:
        return category
    cat_id = generate_id("Cat", Category)
    return Category.objects.create(cat_id=cat_id, cat_name=cat_name.strip())
