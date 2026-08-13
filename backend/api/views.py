import random
from decimal import Decimal

import razorpay
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from django.db.models import Q, Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import cloudinary.uploader

from .models import (
    Address,
    Cart,
    CartItem,
    Image,
    Order,
    OrderItem,
    Payment,
    Product,
    ProductVariant,
    Seller,
    SellerAddress,
    Users,
    Wishlist,
)
from .serializers import (
    AddressSerializer,
    CartItemSerializer,
    CartSerializer,
    InventorySerializer,
    OrderSerializer,
    PlaceOrderSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    SellerLoginSerializer,
    SellerOrderSerializer,
    SellerRegisterSerializer,
    SellerSerializer,
    UploadStockSerializer,
    UserRegisterSerializer,
    UserSerializer,
    WishlistSerializer,
)
from .utils import (
    generate_id,
    get_or_create_brand,
    get_or_create_category,
    get_or_create_color,
    get_or_create_size,
)

otp_store = {}
DELIVERY_FEE = Decimal("99.00")

# Razorpay Configuration
RAZORPAY_KEY_ID = getattr(settings, 'RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = getattr(settings, 'RAZORPAY_KEY_SECRET')

try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception:
    razorpay_client = None


# ── OTP ──────────────────────────────────────────────────────────────────────


@api_view(["POST"])
def send_otp(request):
    phone = request.data.get("phone")
    if not phone:
        return Response({"error": "Phone required"}, status=status.HTTP_400_BAD_REQUEST)

    otp = random.randint(100000, 999999)
    otp_store[str(phone)] = otp

    return Response({"message": "OTP sent successfully", "otp": otp})


@api_view(["POST"])
def verify_otp(request):
    phone = str(request.data.get("phone"))
    otp = request.data.get("otp")

    if phone not in otp_store:
        return Response({"error": "OTP not sent"}, status=status.HTTP_400_BAD_REQUEST)

    if str(otp_store[phone]) != str(otp):
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    del otp_store[phone]
    return Response({"message": "OTP verified", "phone": phone})


# ── Users ───────────────────────────────────────────────────────────────────


@api_view(["POST"])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    if Users.objects.filter(phone=data["phone"]).exists():
        return Response({"error": "Phone already registered"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        user_id = generate_id("User", Users)
        user = Users.objects.create(
            userid=user_id,
            name=data["name"],
            phone=data["phone"],
            email=data.get("email") or None,
        )

        if any(data.get(f) for f in ("home_no", "street", "city", "state", "pincode")):
            addr_id = generate_id("Addr", Address)
            Address.objects.create(
                addrid=addr_id,
                userid=user,
                home_no=data.get("home_no") or None,
                street=data.get("street") or None,
                city=data.get("city") or None,
                state=data.get("state") or None,
                pincode=data.get("pincode"),
            )

        cart_id = generate_id("cart", Cart)
        Cart.objects.create(cart_id=cart_id, userid=user)

    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
def user_profile(request, userid):
    try:
        user = Users.objects.prefetch_related("addresses").get(userid=userid)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        order_count = Order.objects.filter(userid=user).count()
        wishlist_count = Wishlist.objects.filter(userid=user).count()
        data = UserSerializer(user).data
        data["order_count"] = order_count
        data["wishlist_count"] = wishlist_count
        return Response(data)

    user.name = request.data.get("name", user.name)
    if "email" in request.data:
        user.email = request.data["email"] or None
    user.save()

    address_data = request.data.get("address")
    if address_data:
        address = user.addresses.first()
        if address:
            for field in ("home_no", "street", "city", "state", "pincode"):
                if field in address_data:
                    setattr(address, field, address_data[field])
            address.save()
        else:
            addr_id = generate_id("Addr", Address)
            Address.objects.create(addrid=addr_id, userid=user, **address_data)

    return Response(UserSerializer(user).data)


@api_view(["GET"])
def user_by_phone(request, phone):
    try:
        user = Users.objects.prefetch_related("addresses").get(phone=phone)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(UserSerializer(user).data)


# ── Sellers ─────────────────────────────────────────────────────────────────


@api_view(["POST"])
def register_seller(request):
    serializer = SellerRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    if data["password"] != data["confirm_password"]:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    if Seller.objects.filter(phone=data["phone"]).exists():
        return Response({"error": "Phone already registered"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        seller_id = generate_id("slr", Seller)
        seller = Seller.objects.create(
            sellerid=seller_id,
            name=data["name"],
            shopname=data.get("shopname") or data["name"],
            shopno=data.get("shopno") or None,
            phone=data["phone"],
            email=data.get("email") or None,
            pswrd=make_password(data["password"]),
        )

        if any(data.get(f) for f in ("street", "city", "state", "pincode")):
            saddr_id = generate_id("saddr", SellerAddress)
            SellerAddress.objects.create(
                saddrid=saddr_id,
                sellerid=seller,
                street=data.get("street") or None,
                city=data.get("city") or None,
                state=data.get("state") or None,
                pincode=data.get("pincode"),
            )

    return Response(SellerSerializer(seller).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def seller_login(request):
    serializer = SellerLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    query = Q()
    if data.get("phone"):
        query &= Q(phone=data["phone"])
    elif data.get("email"):
        query &= Q(email=data["email"])
    else:
        return Response({"error": "Phone or email required"}, status=status.HTTP_400_BAD_REQUEST)

    seller = Seller.objects.filter(query).prefetch_related("addresses").first()
    if not seller:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    if not check_password(data["password"], seller.pswrd):
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(SellerSerializer(seller).data)


@api_view(["GET"])
def seller_dashboard(request, sellerid):
    try:
        seller = Seller.objects.get(sellerid=sellerid)
    except Seller.DoesNotExist:
        return Response({"error": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)

    variants = ProductVariant.objects.filter(prod_id__sellerid=seller)
    total_stock = variants.aggregate(total=Sum("stockquantity"))["total"] or 0
    orders = Order.objects.filter(items__variant_id__prod_id__sellerid=seller).distinct()
    total_orders = orders.count()
    total_revenue = orders.aggregate(total=Sum("totalamount"))["total"] or Decimal("0")

    return Response(
        {
            "seller": SellerSerializer(seller).data,
            "total_orders": total_orders,
            "available_stock": total_stock,
            "total_revenue": str(total_revenue),
        }
    )


@api_view(["GET"])
def seller_orders(request, sellerid):
    if not Seller.objects.filter(sellerid=sellerid).exists():
        return Response({"error": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)

    orders = (
        Order.objects.filter(items__variant_id__prod_id__sellerid=sellerid)
        .distinct()
        .prefetch_related("items__variant_id__prod_id", "userid")
        .order_by("-orderdate")
    )
    return Response(SellerOrderSerializer(orders, many=True).data)


@api_view(["GET"])
def seller_inventory(request, sellerid):
    if not Seller.objects.filter(sellerid=sellerid).exists():
        return Response({"error": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)

    search = request.query_params.get("search", "").strip()
    variants = ProductVariant.objects.filter(prod_id__sellerid=sellerid).select_related(
        "prod_id__cat_id", "color_id", "size_id", "image_id"
    )

    if search:
        variants = variants.filter(prod_id__prod_name__icontains=search)

    total_products = variants.values("prod_id").distinct().count()
    total_units = variants.aggregate(total=Sum("stockquantity"))["total"] or 0
    low_stock = variants.filter(stockquantity__lte=5, stockquantity__gt=0).count()

    return Response(
        {
            "summary": {
                "total_products": total_products,
                "total_units": total_units,
                "low_stock": low_stock,
            },
            "inventory": InventorySerializer(variants, many=True).data,
        }
    )


@api_view(["POST"])
def upload_stock(request, sellerid):
    try:
        seller = Seller.objects.get(sellerid=sellerid)
    except Seller.DoesNotExist:
        return Response({"error": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UploadStockSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    category = get_or_create_category(data["category"])
    brand = get_or_create_brand(data["brand"])
    color = get_or_create_color(data["color"])
    size = get_or_create_size(data["size"])

    with transaction.atomic():
        # Check if product already exists for this seller with same name
        product = Product.objects.filter(
            sellerid=seller,
            prod_name=data["prod_name"],
            cat_id=category,
            brand_id=brand
        ).first()

        if not product:
            # Create new product if it doesn't exist
            prod_id = generate_id("prod", Product)
            product = Product.objects.create(
                prod_id=prod_id,
                cat_id=category,
                brand_id=brand,
                sellerid=seller,
                prod_name=data["prod_name"],
                dscrptn=data.get("dscrptn") or "",
            )

        img_url = data.get("img_url") or ""
        image = None
        if img_url:
            # Check if image already exists for this product
            existing_image = Image.objects.filter(
                prod_id=product,
                img_url=img_url
            ).first()
            if not existing_image:
                image_id = generate_id("img", Image)
                image = Image.objects.create(
                    image_id=image_id,
                    prod_id=product,
                    img_url=img_url,
                    alt_text=data["prod_name"],
                )
            else:
                image = existing_image

        # Check if variant already exists with same size and color
        existing_variant = ProductVariant.objects.filter(
            prod_id=product,
            color_id=color,
            size_id=size
        ).first()

        if existing_variant:
            # Update existing variant
            existing_variant.price = data["price"]
            existing_variant.stockquantity += data["quantity"]
            if image:
                existing_variant.image_id = image
            existing_variant.save()
            variant = existing_variant
        else:
            # Create new variant
            variant_id = generate_id("var", ProductVariant)
            sku = data.get("sku") or f"{data['prod_name'][:10].lower()}-{size.size_no}-{color.color_name.lower()}-{variant_id}"
            variant = ProductVariant.objects.create(
                variant_id=variant_id,
                prod_id=product,
                color_id=color,
                size_id=size,
                price=data["price"],
                stockquantity=data["quantity"],
                image_id=image,
                sku=sku,
            )

    return Response(
        {
            "product": ProductDetailSerializer(product).data,
            "variant": InventorySerializer(variant).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["DELETE"])
def delete_variant(request, sellerid, variant_id):
    try:
        variant = ProductVariant.objects.select_related("prod_id").get(
            variant_id=variant_id, prod_id__sellerid_id=sellerid
        )
    except ProductVariant.DoesNotExist:
        return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

    variant.delete()
    return Response({"message": "Deleted successfully"})


# ── Products ──────────────────────────────────────────────────────────────────


@api_view(["GET"])
def product_list(request):
    products = Product.objects.select_related("cat_id", "brand_id").prefetch_related(
        "variants__color_id", "variants__size_id", "variants__image_id", "images"
    )

    category = request.query_params.get("category")
    if category:
        products = products.filter(cat_id__cat_name__iexact=category)

    search = request.query_params.get("search")
    if search:
        products = products.filter(prod_name__icontains=search)

    return Response(ProductListSerializer(products, many=True).data)


@api_view(["GET"])
def product_detail(request, prod_id):
    try:
        product = Product.objects.select_related("cat_id", "brand_id").prefetch_related(
            "variants__color_id", "variants__size_id", "variants__image_id", "images"
        ).get(prod_id=prod_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(ProductDetailSerializer(product).data)


def _get_user_cart(userid):
    cart, _ = Cart.objects.get_or_create(
        userid_id=userid,
        defaults={"cart_id": generate_id("cart", Cart)},
    )
    return cart


# ── Cart ──────────────────────────────────────────────────────────────────────


@api_view(["GET"])
def get_cart(request):
    userid = request.query_params.get("userid")
    if not userid:
        return Response({"error": "userid required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = Cart.objects.prefetch_related(
            "items__variant_id__prod_id",
            "items__variant_id__color_id",
            "items__variant_id__size_id",
            "items__variant_id__image_id",
        ).get(userid_id=userid)
    except Cart.DoesNotExist:
        cart = _get_user_cart(userid)

    data = CartSerializer(cart).data
    data["delivery_fee"] = str(DELIVERY_FEE)
    data["total"] = str(Decimal(data["subtotal"]) + DELIVERY_FEE)
    return Response(data)


@api_view(["POST"])
def add_to_cart(request):
    userid = request.data.get("userid")
    variant_id = request.data.get("variant_id")
    quantity = int(request.data.get("quantity", 1))

    if not userid or not variant_id:
        return Response({"error": "userid and variant_id required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        variant = ProductVariant.objects.get(variant_id=variant_id)
    except ProductVariant.DoesNotExist:
        return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

    if variant.stockquantity < quantity:
        return Response({"error": "Insufficient stock"}, status=status.HTTP_400_BAD_REQUEST)

    cart = _get_user_cart(userid)
    item = CartItem.objects.filter(cart_id=cart, variant_id=variant).first()

    if item:
        item.quantity += quantity
        item.save()
    else:
        item_id = generate_id("cart_item", CartItem)
        item = CartItem.objects.create(
            cartitem_id=item_id,
            cart_id=cart,
            variant_id=variant,
            quantity=quantity,
        )

    return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)


@api_view(["PUT", "DELETE"])
def cart_item_detail(request, cartitem_id):
    try:
        item = CartItem.objects.select_related("variant_id").get(cartitem_id=cartitem_id)
    except CartItem.DoesNotExist:
        return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        item.delete()
        return Response({"message": "Removed from cart"})

    quantity = int(request.data.get("quantity", item.quantity))
    if quantity <= 0:
        item.delete()
        return Response({"message": "Removed from cart"})

    if item.variant_id.stockquantity < quantity:
        return Response({"error": "Insufficient stock"}, status=status.HTTP_400_BAD_REQUEST)

    item.quantity = quantity
    item.save()
    return Response(CartItemSerializer(item).data)


# ── Wishlist ──────────────────────────────────────────────────────────────────


@api_view(["GET"])
def get_wishlist(request):
    userid = request.query_params.get("userid")
    if not userid:
        return Response({"error": "userid required"}, status=status.HTTP_400_BAD_REQUEST)

    items = Wishlist.objects.filter(userid_id=userid).select_related("prod_id").prefetch_related(
        "prod_id__variants", "prod_id__images"
    )
    return Response({"count": items.count(), "items": WishlistSerializer(items, many=True).data})


@api_view(["POST"])
def add_to_wishlist(request):
    userid = request.data.get("userid")
    prod_id = request.data.get("prod_id")

    if not userid or not prod_id:
        return Response({"error": "userid and prod_id required"}, status=status.HTTP_400_BAD_REQUEST)

    if Wishlist.objects.filter(userid_id=userid, prod_id_id=prod_id).exists():
        return Response({"error": "Already in wishlist"}, status=status.HTTP_400_BAD_REQUEST)

    wishlist_id = generate_id("wishlist", Wishlist)
    item = Wishlist.objects.create(
        wishlist_id=wishlist_id,
        userid_id=userid,
        prod_id_id=prod_id,
        added_date=timezone.now(),
    )
    return Response(WishlistSerializer(item).data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
def remove_from_wishlist(request, wishlist_id):
    try:
        item = Wishlist.objects.get(wishlist_id=wishlist_id)
    except Wishlist.DoesNotExist:
        return Response({"error": "Wishlist item not found"}, status=status.HTTP_404_NOT_FOUND)

    item.delete()
    return Response({"message": "Removed from wishlist"})


@api_view(["POST"])
def move_wishlist_to_cart(request, wishlist_id):
    try:
        item = Wishlist.objects.select_related("prod_id").get(wishlist_id=wishlist_id)
    except Wishlist.DoesNotExist:
        return Response({"error": "Wishlist item not found"}, status=status.HTTP_404_NOT_FOUND)

    variant = item.prod_id.variants.first()
    if not variant:
        return Response({"error": "No variant available for this product"}, status=status.HTTP_400_BAD_REQUEST)

    cart = _get_user_cart(item.userid_id)
    cart_item = CartItem.objects.filter(cart_id=cart, variant_id=variant).first()
    if cart_item:
        cart_item.quantity += 1
        cart_item.save()
    else:
        cartitem_id = generate_id("cart_item", CartItem)
        cart_item = CartItem.objects.create(
            cartitem_id=cartitem_id,
            cart_id=cart,
            variant_id=variant,
            quantity=1,
        )

    item.delete()
    return Response(CartItemSerializer(cart_item).data)


# ── Orders & Payments ─────────────────────────────────────────────────────────


@api_view(["GET", "POST"])
def orders(request):
    if request.method == "GET":
        return user_orders(request)
    return place_order(request)


def place_order(request):
    serializer = PlaceOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    userid = data["userid"]
    payment_method = data["payment_method"]

    try:
        user = Users.objects.get(userid=userid)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    order_items_data = []

    if data.get("use_cart", True):
        try:
            cart = Cart.objects.prefetch_related("items__variant_id").get(userid=user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        for item in cart.items.all():
            if item.variant_id.stockquantity < item.quantity:
                return Response(
                    {"error": f"Insufficient stock for {item.variant_id.prod_id.prod_name}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            order_items_data.append((item.variant_id, item.quantity, item.variant_id.price))
    else:
        variant_id = data.get("variant_id")
        quantity = data.get("quantity", 1)
        try:
            variant = ProductVariant.objects.get(variant_id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

        if variant.stockquantity < quantity:
            return Response({"error": "Insufficient stock"}, status=status.HTTP_400_BAD_REQUEST)

        order_items_data.append((variant, quantity, variant.price))

    total = sum(price * qty for _, qty, price in order_items_data)
    if payment_method == "COD":
        total += DELIVERY_FEE

    with transaction.atomic():
        order_id = generate_id("order", Order)
        order = Order.objects.create(
            order_id=order_id,
            userid=user,
            orderdate=timezone.now(),
            totalamount=total,
            order_status="Pending",
        )

        for variant, qty, price in order_items_data:
            item_id = generate_id("ord_item", OrderItem)
            OrderItem.objects.create(
                orderitem_id=item_id,
                order_id=order,
                variant_id=variant,
                quantity=qty,
                priceatpurchase=price,
            )
            variant.stockquantity -= qty
            variant.save(update_fields=["stockquantity"])

        payment_id = generate_id("payment", Payment)
        Payment.objects.create(
            payment_id=payment_id,
            order_id=order,
            amount=total,
            payment_method=payment_method,
            payment_status="Processing" if payment_method == "UPI" else "Pending",
            payment_date=timezone.now(),
        )

        if data.get("use_cart", True):
            CartItem.objects.filter(cart_id__userid=user).delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


def user_orders(request):
    userid = request.query_params.get("userid")
    if not userid:
        return Response({"error": "userid required"}, status=status.HTTP_400_BAD_REQUEST)

    orders = Order.objects.filter(userid_id=userid).prefetch_related(
        "items__variant_id__prod_id", "payments"
    ).order_by("-orderdate")
    return Response(OrderSerializer(orders, many=True).data)


@api_view(["GET"])
def order_detail(request, order_id):
    try:
        order = Order.objects.prefetch_related(
            "items__variant_id__prod_id", "payments", "userid__addresses"
        ).get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    data = OrderSerializer(order).data
    address = order.userid.addresses.first()
    if address:
        data["delivery_address"] = AddressSerializer(address).data
    return Response(data)


@api_view(["POST"])
def confirm_payment(request, order_id):
    try:
        order = Order.objects.get(order_id=order_id)
        payment = Payment.objects.get(order_id=order)
    except (Order.DoesNotExist, Payment.DoesNotExist):
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    payment.payment_status = "Completed"
    payment.save(update_fields=["payment_status"])
    order.order_status = "Confirmed"
    order.save(update_fields=["order_status"])

    return Response(OrderSerializer(order).data)


@api_view(["PATCH"])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get("order_status")
    if not new_status:
        return Response({"error": "order_status required"}, status=status.HTTP_400_BAD_REQUEST)

    order.order_status = new_status
    order.save(update_fields=["order_status"])
    return Response(OrderSerializer(order).data)


# ── Razorpay Payment Integration ────────────────────────────────────────────────


@api_view(["POST"])
def create_razorpay_order(request):
    """Create a Razorpay order for payment"""
    order_id = request.data.get("order_id")
    amount = request.data.get("amount")
    
    if not order_id or not amount:
        return Response({"error": "order_id and amount required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if not razorpay_client:
        return Response({"error": "Payment gateway not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        # Razorpay expects amount in paise (multiply by 100)
        amount_paise = int(float(amount) * 100)
        
        razorpay_order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": order_id,
            "payment_capture": "1"
        })
        
        return Response({
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key": RAZORPAY_KEY_ID,
            "amount": amount_paise,
            "currency": "INR",
            "order_id": order_id
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def verify_razorpay_payment(request):
    """Verify Razorpay payment signature and update order status"""
    razorpay_order_id = request.data.get("razorpay_order_id")
    razorpay_payment_id = request.data.get("razorpay_payment_id")
    razorpay_signature = request.data.get("razorpay_signature")
    order_id = request.data.get("order_id")
    
    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id]):
        return Response({"error": "All payment details required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not razorpay_client:
        return Response({"error": "Payment gateway not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        # Verify signature
        params = {
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        }
        razorpay_client.utility.verify_payment_signature(params)
        
        # Update order and payment status
        with transaction.atomic():
            order = Order.objects.get(order_id=order_id)
            payment = Payment.objects.get(order_id=order)
            
            payment.payment_status = "Completed"
            payment.save(update_fields=["payment_status"])
            
            order.order_status = "Confirmed"
            order.save(update_fields=["order_status"])
        
        return Response(OrderSerializer(order).data)
    except razorpay.errors.SignatureVerificationError:
        return Response({"error": "Invalid payment signature"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ── Seller password ─────────────────────────────────────────────────────────


@api_view(["POST"])
def seller_change_password(request, sellerid):
    try:
        seller = Seller.objects.get(sellerid=sellerid)
    except Seller.DoesNotExist:
        return Response({"error": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)

    current = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm = request.data.get("confirm_password")

    if not new_password or new_password != confirm:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    if current and not check_password(current, seller.pswrd):
        return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    seller.pswrd = make_password(new_password)
    seller.save(update_fields=["pswrd"])
    return Response({"message": "Password updated successfully"})


@api_view(["POST"])
def seller_reset_password(request):
    phone = str(request.data.get("phone", ""))
    otp = request.data.get("otp")
    new_password = request.data.get("new_password")
    confirm = request.data.get("confirm_password")

    if not phone or not otp or not new_password:
        return Response({"error": "phone, otp and new_password required"}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    if phone not in otp_store or str(otp_store[phone]) != str(otp):
        return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        seller = Seller.objects.get(phone=phone)
    except Seller.DoesNotExist:
        return Response({"error": "Seller not found"}, status=status.HTTP_404_NOT_FOUND)

    del otp_store[phone]
    seller.pswrd = make_password(new_password)
    seller.save(update_fields=["pswrd"])
    return Response({"message": "Password reset successfully"})


# ── Image upload ──────────────────────────────────────────────────────────────


@api_view(["POST"])
def upload_image(request):
    image_file = request.FILES.get("image")
    if not image_file:
        return Response({"error": "No image file provided"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        result = cloudinary.uploader.upload(
            image_file,
            folder="stepup/products",
        )

        return Response({
            "url": result["secure_url"]
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
# For Cloudinary - these support local media Path

    # import os
    # import uuid

    # ext = os.path.splitext(image_file.name)[1].lower() or ".jpg" or ".webp" or ".png" or ".avif"
    # filename = f"{uuid.uuid4().hex[:12]}{ext}"
    # folder = settings.MEDIA_ROOT / "products"
    # folder.mkdir(parents=True, exist_ok=True)
    # filepath = folder / filename

    # with open(filepath, "wb+") as dest:
    #     for chunk in image_file.chunks():
    #         dest.write(chunk)

    # url = f"{settings.MEDIA_URL}products/{filename}"
    # return Response({"url": url})

