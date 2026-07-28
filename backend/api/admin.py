from django.contrib import admin

from .models import (
    Address,
    AdminTable,
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

admin.site.register(Users)
admin.site.register(Address)
admin.site.register(Seller)
admin.site.register(SellerAddress)
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(Color)
admin.site.register(Size)
admin.site.register(Image)
admin.site.register(ProductVariant)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Wishlist)
admin.site.register(AdminTable)
