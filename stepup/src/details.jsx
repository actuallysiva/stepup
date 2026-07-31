import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addToCart, addToWishlist, getProduct } from './api';
import { useApp } from './context/AppContext';
import { formatPrice, resolveImageUrl } from './utils/helpers';

export default function Details() {
  const { prodId } = useParams();
  const navigate = useNavigate();
  const { user, setCheckout } = useApp();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!prodId) {
      navigate('/');
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getProduct(prodId);
        if (!cancelled) {
          setProduct(data);
          setSelectedSize(data.available_sizes?.[0] ?? null);
          setSelectedColor(data.available_colors?.[0] ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [prodId, navigate]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find(
      (v) => Number(v.size) === Number(selectedSize) && v.color === selectedColor
    );
  }, [product, selectedSize, selectedColor]);

  const requireUserOrRedirect = (flow = 'checkout') => {
    if (!user?.userid) {
      navigate('/verification', { state: { flow } });
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!requireUserOrRedirect('checkout')) return;
    if (!selectedVariant) {
      setError('Please select size and color');
      return;
    }
    try {
      await addToCart({ userid: user.userid, variant_id: selectedVariant.variant_id, quantity: 1 });
      setMessage('Added to cart!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBuyNow = () => {
    if (!requireUserOrRedirect('checkout')) return;
    if (!selectedVariant) {
      setError('Please select size and color');
      return;
    }
    setCheckout({
      buyNow: true,
      variantId: selectedVariant.variant_id,
      quantity: 1,
      paymentMethod: 'UPI',
      buyNowItem: {
        prod_name: product.prod_name,
        size: selectedVariant.size,
        color: selectedVariant.color,
        price: selectedVariant.price,
        image: selectedVariant.image_url || product.images?.[0]?.url,
        quantity: 1,
      },
    });
    navigate('/verification', { state: { flow: 'checkout' } });
  };

  const handleAddToWishlist = async () => {
    if (!requireUserOrRedirect('wishlist')) return;
    try {
      await addToWishlist({ userid: user.userid, prod_id: prodId });
      setMessage('Added to wishlist!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="statusMsg">Loading product...</p>;
  if (error && !product) return <p className="statusMsg error">{error}</p>;
  if (!product) return <p className="statusMsg">Product not found.</p>;

  const imageUrl = resolveImageUrl(
    selectedVariant?.image_url || product.images?.[0]?.url || ''
  );

  return (
    <div className="detailsPage">
      <div className="imageCard">
        <img src={imageUrl} alt={product.prod_name} />
      </div>

      <div className="productDetails">
        <div className="productTitle">
          <h2>{product.prod_name}</h2>
          <p className="rating">★★★★☆</p>
        </div>

        <div className="description">
          <p>{product.dscrptn}</p>
        </div>

        <div className="selectSize">
          <h3>Select Size</h3>
          <div className="buttonGroup">
            {product.available_sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={selectedSize === size ? 'selected' : ''}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="selectColor">
          <h3>Select Color</h3>
          <div className="buttonGroup">
            {product.available_colors.map((color) => (
              <button
                key={color}
                type="button"
                className={selectedColor === color ? 'selected' : ''}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="stockStatus">
          <h4>
            {selectedVariant?.stockquantity > 0 ? 'In Stock' : 'Out of Stock'}
            {selectedVariant ? ` (${selectedVariant.stockquantity} left)` : ''}
          </h4>
        </div>

        <div className="price">
          <h2>{formatPrice(selectedVariant?.price || product.min_price)}</h2>
        </div>

        {error && <p className="statusMsg error">{error}</p>}
        {message && <p className="statusMsg">{message}</p>}

        <div className="proceed">
          <button type="button" onClick={handleBuyNow}>Buy Now</button>
          <button type="button" onClick={handleAddToCart}>Add to Cart</button>
          <button type="button" onClick={handleAddToWishlist}>Add to Wishlist</button>
        </div>
      </div>
    </div>
  );
}
