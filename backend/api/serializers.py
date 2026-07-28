from rest_framework import serializers

from .models import (
    Address,
    Brand,
    Cart,
    CartItem,
    Category,
    Color,
    Image,
    Order,
    OrderItem,
    Payment,
    Product,
    ProductVariant,
    Seller,
    SellerAddress,
    Size,
    Users,
    Wishlist,
)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["addrid", "home_no", "street", "city", "state", "pincode"]
        read_only_fields = ["addrid"]


class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = Users
        fields = ["userid", "name", "phone", "email", "addresses"]
        read_only_fields = ["userid"]


class UserRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=20)
    phone = serializers.IntegerField()
    email = serializers.EmailField(required=False, allow_blank=True)
    home_no = serializers.CharField(max_length=10, required=False, allow_blank=True)
    street = serializers.CharField(max_length=30, required=False, allow_blank=True)
    city = serializers.CharField(max_length=20, required=False, allow_blank=True)
    state = serializers.CharField(max_length=20, required=False, allow_blank=True)
    pincode = serializers.IntegerField(required=False, allow_null=True)


class SellerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerAddress
        fields = ["saddrid", "street", "city", "state", "pincode"]
        read_only_fields = ["saddrid"]


class SellerSerializer(serializers.ModelSerializer):
    addresses = SellerAddressSerializer(many=True, read_only=True)

    class Meta:
        model = Seller
        fields = ["sellerid", "name", "shopname", "shopno", "phone", "email", "addresses"]
        read_only_fields = ["sellerid"]


class SellerRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=20)
    shopname = serializers.CharField(max_length=50, required=False, allow_blank=True)
    shopno = serializers.CharField(max_length=10, required=False, allow_blank=True)
    phone = serializers.IntegerField()
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(max_length=50)
    confirm_password = serializers.CharField(max_length=50)
    street = serializers.CharField(max_length=20, required=False, allow_blank=True)
    city = serializers.CharField(max_length=20, required=False, allow_blank=True)
    state = serializers.CharField(max_length=20, required=False, allow_blank=True)
    pincode = serializers.IntegerField(required=False, allow_null=True)


class SellerLoginSerializer(serializers.Serializer):
    phone = serializers.IntegerField(required=False)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(max_length=50)


class ProductVariantSerializer(serializers.ModelSerializer):
    color = serializers.CharField(source="color_id.color_name", read_only=True)
    size = serializers.IntegerField(source="size_id.size_no", read_only=True)
    image_url = serializers.CharField(source="image_id.img_url", read_only=True, allow_null=True)
    variant_id = serializers.CharField(read_only=True)

    class Meta:
        model = ProductVariant
        fields = [
            "variant_id",
            "color",
            "size",
            "price",
            "stockquantity",
            "image_url",
            "sku",
        ]


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="cat_id.cat_name", read_only=True)
    brand = serializers.CharField(source="brand_id.brand_name", read_only=True)
    price = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["prod_id", "prod_name", "dscrptn", "category", "brand", "price", "color", "size", "image"]

    def _first_variant(self, obj):
        return obj.variants.select_related("color_id", "size_id", "image_id").first()

    def get_price(self, obj):
        variant = self._first_variant(obj)
        return str(variant.price) if variant else "0"

    def get_color(self, obj):
        variant = self._first_variant(obj)
        return variant.color_id.color_name if variant else ""

    def get_size(self, obj):
        sizes = (
            obj.variants.select_related("size_id")
            .values_list("size_id__size_no", flat=True)
            .distinct()
        )
        return " ".join(str(s) for s in sizes)

    def get_image(self, obj):
        image = obj.images.first()
        if image and image.img_url:
            return image.img_url
        variant = self._first_variant(obj)
        if variant and variant.image_id:
            return variant.image_id.img_url
        return ""


class ProductDetailSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="cat_id.cat_name", read_only=True)
    brand = serializers.CharField(source="brand_id.brand_name", read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "prod_id",
            "prod_name",
            "dscrptn",
            "category",
            "brand",
            "variants",
            "images",
            "available_sizes",
            "available_colors",
            "min_price",
        ]

    def get_images(self, obj):
        return [{"image_id": img.image_id, "url": img.img_url, "alt_text": img.alt_text} for img in obj.images.all()]

    def get_available_sizes(self, obj):
        return list(
            obj.variants.select_related("size_id")
            .values_list("size_id__size_no", flat=True)
            .distinct()
            .order_by("size_id__size_no")
        )

    def get_available_colors(self, obj):
        return list(
            obj.variants.select_related("color_id")
            .values_list("color_id__color_name", flat=True)
            .distinct()
        )

    def get_min_price(self, obj):
        variant = obj.variants.order_by("price").first()
        return str(variant.price) if variant else "0"


class UploadStockSerializer(serializers.Serializer):
    prod_name = serializers.CharField(max_length=30)
    category = serializers.CharField(max_length=20)
    brand = serializers.CharField(max_length=20)
    dscrptn = serializers.CharField(max_length=50, required=False, allow_blank=True)
    size = serializers.IntegerField()
    color = serializers.CharField(max_length=15)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(min_value=1)
    img_url = serializers.CharField(max_length=100, required=False, allow_blank=True)
    sku = serializers.CharField(max_length=15, required=False, allow_blank=True)


class CartItemSerializer(serializers.ModelSerializer):
    variant_id = serializers.CharField(source="variant_id.variant_id", read_only=True)
    prod_name = serializers.CharField(source="variant_id.prod_id.prod_name", read_only=True)
    size = serializers.IntegerField(source="variant_id.size_id.size_no", read_only=True)
    color = serializers.CharField(source="variant_id.color_id.color_name", read_only=True)
    price = serializers.DecimalField(source="variant_id.price", max_digits=10, decimal_places=2, read_only=True)
    image = serializers.CharField(source="variant_id.image_id.img_url", read_only=True, allow_null=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "cartitem_id",
            "variant_id",
            "prod_name",
            "size",
            "color",
            "price",
            "quantity",
            "image",
            "line_total",
        ]

    def get_line_total(self, obj):
        return str(obj.variant_id.price * obj.quantity)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["cart_id", "userid", "items", "subtotal"]

    def get_subtotal(self, obj):
        total = sum(item.variant_id.price * item.quantity for item in obj.items.select_related("variant_id"))
        return str(total)


class WishlistSerializer(serializers.ModelSerializer):
    prod_name = serializers.CharField(source="prod_id.prod_name", read_only=True)
    dscrptn = serializers.CharField(source="prod_id.dscrptn", read_only=True)
    price = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ["wishlist_id", "prod_id", "prod_name", "dscrptn", "price", "image", "added_date"]

    def get_price(self, obj):
        variant = obj.prod_id.variants.order_by("price").first()
        return str(variant.price) if variant else "0"

    def get_image(self, obj):
        image = obj.prod_id.images.first()
        if image:
            return image.img_url
        variant = obj.prod_id.variants.select_related("image_id").first()
        return variant.image_id.img_url if variant and variant.image_id else ""


class OrderItemSerializer(serializers.ModelSerializer):
    prod_name = serializers.CharField(source="variant_id.prod_id.prod_name", read_only=True)
    size = serializers.IntegerField(source="variant_id.size_id.size_no", read_only=True)
    color = serializers.CharField(source="variant_id.color_id.color_name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["orderitem_id", "variant_id", "prod_name", "size", "color", "quantity", "priceatpurchase"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["order_id", "userid", "orderdate", "totalamount", "order_status", "items", "payment"]

    def get_payment(self, obj):
        payment = obj.payments.first()
        if not payment:
            return None
        return {
            "payment_id": payment.payment_id,
            "amount": str(payment.amount),
            "payment_method": payment.payment_method,
            "payment_status": payment.payment_status,
            "payment_date": payment.payment_date,
        }


class PlaceOrderSerializer(serializers.Serializer):
    userid = serializers.CharField(max_length=15)
    payment_method = serializers.ChoiceField(choices=["COD", "UPI", "Razorpay"])
    use_cart = serializers.BooleanField(default=True)
    variant_id = serializers.CharField(max_length=15, required=False, allow_blank=True)
    quantity = serializers.IntegerField(min_value=1, required=False, default=1)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["payment_id", "order_id", "amount", "payment_method", "payment_status", "payment_date"]


class SellerOrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source="userid.name", read_only=True)
    buyer_phone = serializers.IntegerField(source="userid.phone", read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_id",
            "buyer_name",
            "buyer_phone",
            "orderdate",
            "totalamount",
            "order_status",
            "items",
        ]


class InventorySerializer(serializers.ModelSerializer):
    prod_name = serializers.CharField(source="prod_id.prod_name", read_only=True)
    category = serializers.CharField(source="prod_id.cat_id.cat_name", read_only=True)
    color = serializers.CharField(source="color_id.color_name", read_only=True)
    size = serializers.IntegerField(source="size_id.size_no", read_only=True)
    image = serializers.CharField(source="image_id.img_url", read_only=True, allow_null=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = [
            "variant_id",
            "prod_id",
            "prod_name",
            "category",
            "size",
            "color",
            "price",
            "stockquantity",
            "image",
            "sku",
            "status",
        ]

    def get_status(self, obj):
        if obj.stockquantity <= 0:
            return "Out of Stock"
        if obj.stockquantity <= 5:
            return "Low Stock"
        return "In Stock"
