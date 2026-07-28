from django.urls import path

from . import views

urlpatterns = [
    # OTP
    path("send-otp/", views.send_otp),
    path("verify-otp/", views.verify_otp),
    # Users
    path("users/register/", views.register_user),
    path("users/<str:userid>/", views.user_profile),
    path("users/phone/<int:phone>/", views.user_by_phone),
    # Sellers
    path("sellers/register/", views.register_seller),
    path("sellers/login/", views.seller_login),
    path("sellers/<str:sellerid>/dashboard/", views.seller_dashboard),
    path("sellers/<str:sellerid>/orders/", views.seller_orders),
    path("sellers/<str:sellerid>/inventory/", views.seller_inventory),
    path("sellers/<str:sellerid>/upload-stock/", views.upload_stock),
    path("sellers/<str:sellerid>/variants/<str:variant_id>/", views.delete_variant),
    # Products
    path("products/", views.product_list),
    path("products/<str:prod_id>/", views.product_detail),
    # Cart
    path("cart/", views.get_cart),
    path("cart/add/", views.add_to_cart),
    path("cart/items/<str:cartitem_id>/", views.cart_item_detail),
    # Wishlist
    path("wishlist/", views.get_wishlist),
    path("wishlist/add/", views.add_to_wishlist),
    path("wishlist/<str:wishlist_id>/", views.remove_from_wishlist),
    path("wishlist/<str:wishlist_id>/move-to-cart/", views.move_wishlist_to_cart),
    # Orders & Payments
    path("orders/", views.orders),
    path("orders/<str:order_id>/", views.order_detail),
    path("orders/<str:order_id>/confirm-payment/", views.confirm_payment),
    path("orders/<str:order_id>/status/", views.update_order_status),
    # Razorpay
    path("payments/razorpay/create-order/", views.create_razorpay_order),
    path("payments/razorpay/verify/", views.verify_razorpay_payment),
    path("sellers/<str:sellerid>/change-password/", views.seller_change_password),
    path("sellers/reset-password/", views.seller_reset_password),
    path("upload-image/", views.upload_image),
]
