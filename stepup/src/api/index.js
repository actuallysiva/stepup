import api from './client';

export const sendOtp = (phone) => api.post('/send-otp/', { phone });
export const verifyOtp = (phone, otp) => api.post('/verify-otp/', { phone, otp });

export const registerUser = (data) => api.post('/users/register/', data);
export const getUser = (userid) => api.get(`/users/${userid}/`);
export const updateUser = (userid, data) => api.put(`/users/${userid}/`, data);
export const getUserByPhone = (phone) => api.get(`/users/phone/${phone}/`);

export const registerSeller = (data) => api.post('/sellers/register/', data);
export const loginSeller = (data) => api.post('/sellers/login/', data);
export const getSellerDashboard = (sellerid) => api.get(`/sellers/${sellerid}/dashboard/`);
export const getSellerOrders = (sellerid) => api.get(`/sellers/${sellerid}/orders/`);
export const getSellerInventory = (sellerid, search = '') => {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  return api.get(`/sellers/${sellerid}/inventory/${q}`);
};
export const uploadStock = (sellerid, data) => api.post(`/sellers/${sellerid}/upload-stock/`, data);
export const deleteVariant = (sellerid, variantId) =>
  api.delete(`/sellers/${sellerid}/variants/${variantId}/`);
export const changeSellerPassword = (sellerid, data) =>
  api.post(`/sellers/${sellerid}/change-password/`, data);
export const resetSellerPassword = (data) => api.post('/sellers/reset-password/', data);

export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/products/${query ? `?${query}` : ''}`);
};
export const getProduct = (prodId) => api.get(`/products/${prodId}/`);

export const getCart = (userid) => api.get(`/cart/?userid=${userid}`);
export const addToCart = (data) => api.post('/cart/add/', data);
export const updateCartItem = (cartitemId, quantity) =>
  api.put(`/cart/items/${cartitemId}/`, { quantity });
export const removeCartItem = (cartitemId) => api.delete(`/cart/items/${cartitemId}/`);

export const getWishlist = (userid) => api.get(`/wishlist/?userid=${userid}`);
export const addToWishlist = (data) => api.post('/wishlist/add/', data);
export const removeFromWishlist = (wishlistId) => api.delete(`/wishlist/${wishlistId}/`);
export const moveWishlistToCart = (wishlistId) =>
  api.post(`/wishlist/${wishlistId}/move-to-cart/`);

export const placeOrder = (data) => api.post('/orders/', data);
export const getOrders = (userid) => api.get(`/orders/?userid=${userid}`);
export const getOrder = (orderId) => api.get(`/orders/${orderId}/`);
export const confirmPayment = (orderId) => api.post(`/orders/${orderId}/confirm-payment/`);
export const updateOrderStatus = (orderId, order_status) =>
  api.patch(`/orders/${orderId}/status/`, { order_status });

// Razorpay
export const createRazorpayOrder = (data) => api.post('/payments/razorpay/create-order/', data);
export const verifyRazorpayPayment = (data) => api.post('/payments/razorpay/verify/', data);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.upload('/upload-image/', formData);
};
