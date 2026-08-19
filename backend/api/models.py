from django.db import models


class Users(models.Model):
    userid = models.CharField(db_column="UserId", primary_key=True, max_length=15)
    name = models.CharField(db_column="Name", max_length=20, blank=True, null=True)
    phone = models.BigIntegerField(db_column="Phone", unique=True)
    email = models.EmailField(db_column="Email", max_length=50, unique=True, blank=True, null=True)

    class Meta:
        db_table = "Users"
        managed = True

    def __str__(self):
        return f"{self.userid} - {self.name}"


class Address(models.Model):
    addrid = models.CharField(db_column="AddrID", primary_key=True, max_length=15)
    userid = models.ForeignKey(
        Users,
        db_column="UserId",
        on_delete=models.CASCADE,
        related_name="addresses",
    )
    home_no = models.CharField(db_column="Home_no", max_length=10, blank=True, null=True)
    street = models.CharField(db_column="Street", max_length=30, blank=True, null=True)
    city = models.CharField(db_column="City", max_length=20, blank=True, null=True)
    state = models.CharField(db_column="State", max_length=20, blank=True, null=True)
    pincode = models.IntegerField(db_column="PinCode", blank=True, null=True)

    class Meta:
        db_table = "Address"
        managed = True


class Seller(models.Model):
    sellerid = models.CharField(db_column="SellerID", primary_key=True, max_length=15)
    name = models.CharField(db_column="Name", max_length=20, blank=True, null=True)
    shopname = models.CharField(db_column="ShopName", max_length=50, blank=True, null=True)
    shopno = models.CharField(db_column="ShopNo", max_length=10, blank=True, null=True)
    phone = models.BigIntegerField(db_column="Phone", unique=True)
    email = models.EmailField(db_column="Email", max_length=50, blank=True, null=True)
    pswrd = models.CharField(db_column="Pswrd", max_length=128)

    class Meta:
        db_table = "Seller"
        managed = True


class SellerAddress(models.Model):
    saddrid = models.CharField(db_column="SAddrID", primary_key=True, max_length=15)
    sellerid = models.ForeignKey(
        Seller,
        db_column="SellerID",
        on_delete=models.CASCADE,
        related_name="addresses",
    )
    street = models.CharField(db_column="Street", max_length=20, blank=True, null=True)
    city = models.CharField(db_column="City", max_length=20, blank=True, null=True)
    state = models.CharField(db_column="State", max_length=20, blank=True, null=True)
    pincode = models.IntegerField(db_column="PinCode", blank=True, null=True)

    class Meta:
        db_table = "SellerAddress"
        managed = True


class Category(models.Model):
    cat_id = models.CharField(db_column="Cat_ID", primary_key=True, max_length=15)
    cat_name = models.CharField(db_column="Cat_Name", max_length=20)

    class Meta:
        db_table = "Category"
        managed = True


class Brand(models.Model):
    brand_id = models.CharField(db_column="Brand_ID", primary_key=True, max_length=15)
    brand_name = models.CharField(db_column="Brand_name", max_length=20)

    class Meta:
        db_table = "Brand"
        managed = True


class Product(models.Model):
    prod_id = models.CharField(db_column="Prod_ID", primary_key=True, max_length=15)
    cat_id = models.ForeignKey(
        Category,
        db_column="Cat_ID",
        on_delete=models.CASCADE,
        related_name="products",
    )
    brand_id = models.ForeignKey(
        Brand,
        db_column="Brand_ID",
        on_delete=models.CASCADE,
        related_name="products",
    )
    sellerid = models.ForeignKey(
        Seller,
        db_column="SellerID",
        on_delete=models.CASCADE,
        related_name="products",
    )
    prod_name = models.CharField(db_column="Prod_Name", max_length=30)
    dscrptn = models.TextField(db_column="Dscrptn", blank=True, null=True)
    class Meta:
        db_table = "Product"
        managed = True


class Color(models.Model):
    color_id = models.CharField(db_column="Color_ID", primary_key=True, max_length=15)
    color_name = models.CharField(db_column="Color_Name", max_length=15)

    class Meta:
        db_table = "Color"
        managed = True


class Size(models.Model):
    size_id = models.CharField(db_column="Size_ID", primary_key=True, max_length=15)
    size_no = models.IntegerField(db_column="Size_no")

    class Meta:
        db_table = "Size"
        managed = True


class Image(models.Model):
    image_id = models.CharField(db_column="Image_ID", primary_key=True, max_length=15)
    prod_id = models.ForeignKey(
        Product,
        db_column="Prod_ID",
        on_delete=models.CASCADE,
        related_name="images",
    )
    img_url = models.CharField(db_column="Img_url", max_length=2048, blank=True, null=True)
    alt_text = models.CharField(db_column="alt_text", max_length=50, blank=True, null=True)

    class Meta:
        db_table = "Image"
        managed = True


class ProductVariant(models.Model):
    variant_id = models.CharField(db_column="Variant_ID", primary_key=True, max_length=15)
    prod_id = models.ForeignKey(
        Product,
        db_column="Prod_ID",
        on_delete=models.CASCADE,
        related_name="variants",
    )
    color_id = models.ForeignKey(
        Color,
        db_column="Color_ID",
        on_delete=models.CASCADE,
        related_name="variants",
    )
    size_id = models.ForeignKey(
        Size,
        db_column="Size_ID",
        on_delete=models.CASCADE,
        related_name="variants",
    )
    price = models.DecimalField(db_column="Price", max_digits=10, decimal_places=2)
    stockquantity = models.IntegerField(db_column="StockQuantity")
    image_id = models.ForeignKey(
        Image,
        db_column="Image_ID",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="variants",
    )
    sku = models.CharField(db_column="SKU", max_length=50, unique=True)

    class Meta:
        db_table = "Product_Variant"
        managed = True


class Order(models.Model):
    order_id = models.CharField(db_column="Order_ID", primary_key=True, max_length=15)
    userid = models.ForeignKey(
        Users,
        db_column="UserID",
        on_delete=models.CASCADE,
        related_name="orders",
    )
    orderdate = models.DateTimeField(db_column="OrderDate")
    totalamount = models.DecimalField(db_column="TotalAmount", max_digits=10, decimal_places=2)
    order_status = models.CharField(db_column="Order_Status", max_length=10)

    class Meta:
        db_table = "Orders"
        managed = True


class OrderItem(models.Model):
    orderitem_id = models.CharField(db_column="OrderItem_ID", primary_key=True, max_length=15)
    order_id = models.ForeignKey(
        Order,
        db_column="Order_ID",
        on_delete=models.CASCADE,
        related_name="items",
    )
    variant_id = models.ForeignKey(
        ProductVariant,
        db_column="Variant_ID",
        on_delete=models.CASCADE,
        related_name="order_items",
    )
    quantity = models.IntegerField(db_column="Quantity")
    priceatpurchase = models.DecimalField(db_column="PriceAtPurchase", max_digits=10, decimal_places=2)

    class Meta:
        db_table = "Order_Item"
        managed = True


class Payment(models.Model):
    payment_id = models.CharField(db_column="Payment_ID", primary_key=True, max_length=15)
    order_id = models.ForeignKey(
        Order,
        db_column="Order_ID",
        on_delete=models.CASCADE,
        related_name="payments",
    )
    amount = models.DecimalField(db_column="Amount", max_digits=10, decimal_places=2)
    payment_method = models.CharField(db_column="Payment_Method", max_length=10)
    payment_status = models.CharField(db_column="Payment_Status", max_length=10)
    payment_date = models.DateTimeField(db_column="Payment_Date")

    class Meta:
        db_table = "Payment"
        managed = True


class Cart(models.Model):
    cart_id = models.CharField(db_column="Cart_ID", primary_key=True, max_length=15)
    userid = models.ForeignKey(
        Users,
        db_column="UserID",
        on_delete=models.CASCADE,
        related_name="carts",
    )

    class Meta:
        db_table = "Cart"
        managed = True


class CartItem(models.Model):
    cartitem_id = models.CharField(db_column="CartItem_ID", primary_key=True, max_length=15)
    cart_id = models.ForeignKey(
        Cart,
        db_column="Cart_ID",
        on_delete=models.CASCADE,
        related_name="items",
    )
    variant_id = models.ForeignKey(
        ProductVariant,
        db_column="Variant_ID",
        on_delete=models.CASCADE,
        related_name="cart_items",
    )
    quantity = models.IntegerField(db_column="Quantity")

    class Meta:
        db_table = "Cart_Item"
        managed = True


class Wishlist(models.Model):
    wishlist_id = models.CharField(db_column="Wishlist_ID", primary_key=True, max_length=15)
    userid = models.ForeignKey(
        Users,
        db_column="UserID",
        on_delete=models.CASCADE,
        related_name="wishlist_items",
    )
    prod_id = models.ForeignKey(
        Product,
        db_column="Prod_ID",
        on_delete=models.CASCADE,
        related_name="wishlist_entries",
    )
    added_date = models.DateTimeField(db_column="Added_Date")

    class Meta:
        db_table = "Wishlist"
        managed = True


class AdminTable(models.Model):
    admin_id = models.CharField(db_column="Admin_ID", primary_key=True, max_length=15)
    name = models.CharField(db_column="Name", max_length=20)
    email = models.EmailField(db_column="Email", max_length=50)
    password = models.CharField(db_column="Password", max_length=50)
    role = models.CharField(db_column="Role", max_length=10)
    createdat = models.DateTimeField(db_column="CreatedAt")
    lastlogin = models.DateTimeField(db_column="LastLogin", blank=True, null=True)

    class Meta:
        db_table = "Admin_table"
        managed = True
 
# class Track(models.Model):
#     track_id = models.CharField(primary_key=True, max_length=10)
#     class Meta:
#         db_table = "TrackTable"
        