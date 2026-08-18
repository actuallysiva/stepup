import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addToCart, addToWishlist, getProduct } from './api';
import { useApp } from './context/AppContext';
import { formatPrice, resolveImageUrl } from './utils/helpers';

import "./styles/details.css";
import { Heart } from "lucide-react";

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
      <div className='detailsContainer'>
        <div className="productGallery">
        <img src={imageUrl} alt={product.prod_name} />
      </div>

      

      <div className="detailsInfo">
      <div className="detailsHeader">

  <h1 className="detailsName">
    {product.prod_name}
  </h1>

  <div className="productMeta">
    <span className="rating">★★★★☆</span>
    <span className="reviewCount">
      4.8 (126 Reviews)
    </span>
  </div>

  <div className="priceStockRow">

    <h2 className="detailsPrice">
      {formatPrice(selectedVariant?.price || product.min_price)}
    </h2>

    <div className="stockStatus">
      <p
        className={
          selectedVariant?.stockquantity > 0
            ? "stockAvailable"
            : "stockUnavailable"
        }
      >
        {selectedVariant?.stockquantity > 0
          ? `In Stock • ${selectedVariant.stockquantity} left`
          : "Out of Stock"}
      </p>
    </div>

  </div>

</div>
 

        <div className="detailsDescription">

    <h3>Description</h3>

    <p>
        {product.dscrptn}
    </p>

</div>

<div className='detailsOptions'>

        <div className="sizeSection">
          <h3>Size</h3>
          <div className="sizeOptions">
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

        <div className="colorSection">
          <h3>Color</h3>
          <div className="colorOptions">
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

 </div>

        

        {error && <p className="statusMsg error">{error}</p>}
        {message && <p className="statusMsg">{message}</p>}

        <div className="detailsActions">
          <button className="addCartBtn" type="button" onClick={handleAddToCart}>
  Add to Cart
</button>

<button className="buyNowBtn" type="button" onClick={handleBuyNow}>
  Buy Now
</button>

<button
    className="wishlistBtn"
    type="button"
    onClick={handleAddToWishlist}
>
    <Heart size={18} />
    <span>Add to Wishlist</span>
</button>
        </div>
      </div>
            </div>

    </div>
  );
}
