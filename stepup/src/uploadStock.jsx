import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerLayout from './layouts/SellerLayout';
import { uploadImage, uploadStock } from './api';
import { useApp } from './context/AppContext';

import {
    Package,
    Image,
    Layers3,
    Upload,
    Plus,
    Trash2
} from "lucide-react";

import "./styles/uploadstock.css";



export default function UploadStock() {
  const navigate = useNavigate();
  const { seller } = useApp();
  const [productForm, setProductForm] = useState({
    prod_name: '', category: 'Men', brand: '', dscrptn: '',
  });
  const [variants, setVariants] = useState([
    { size: '', color: '', price: '', quantity: '', img_url: '', imageFile: null }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!seller?.sellerid) {
    navigate('/signin');
    return null;
  }

  const handleProductChange = (field, value) => setProductForm((prev) => ({ ...prev, [field]: value }));

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleVariantImageChange = (index, file) => {
    const newVariants = [...variants];
    newVariants[index].imageFile = file;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', price: '', quantity: '', img_url: '', imageFile: null }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!productForm.prod_name || !productForm.brand) {
      setError('Product name and brand are required');
      return;
    }

    const validVariants = variants.filter(v => v.size && v.color && v.price && v.quantity);
    if (validVariants.length === 0) {
      setError('At least one variant with size, color, price, and quantity is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      for (const variant of validVariants) {
        let imgUrl = variant.img_url;
        if (variant.imageFile) {
          const uploaded = await uploadImage(variant.imageFile);
          imgUrl = uploaded.url;
        }
        await uploadStock(seller.sellerid, {
          prod_name: productForm.prod_name,
          category: productForm.category,
          brand: productForm.brand,
          dscrptn: productForm.dscrptn,
          size: Number(variant.size),
          color: variant.color,
          price: Number(variant.price),
          quantity: Number(variant.quantity),
          img_url: imgUrl,
        });
      }
      navigate('/success-stock');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProductForm({
      prod_name: '', category: 'Men', brand: '', dscrptn: '',
    });
    setVariants([{ size: '', color: '', price: '', quantity: '', img_url: '', imageFile: null }]);
    setError('');
  };

  return (
    <SellerLayout>
      <div className="containerUploadStock">
        <div className="uploadCard">
<div className="uploadHeader">

    <h1>Add New Product</h1>

    <p>

        Publish products to your StepUP catalogue.

    </p>

</div>          
          <div className="productSection">
<h3 className="sectionHeading">

<Package size={20}/>

Product Information

</h3>            <div className="containerInput">
              <input type="text" placeholder="Product Name" value={productForm.prod_name}
                onChange={(e) => handleProductChange('prod_name', e.target.value)} />
              <select value={productForm.category} onChange={(e) => handleProductChange('category', e.target.value)}>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
              <input type="text" placeholder="Brand" value={productForm.brand}
                onChange={(e) => handleProductChange('brand', e.target.value)} />
              <textarea placeholder="Product Description" value={productForm.dscrptn}
                onChange={(e) => handleProductChange('dscrptn', e.target.value)} />
            </div>
          </div>

          <div className="variantsSection">
<h3 className="sectionHeading">

<Layers3 size={20}/>

Product Variants

</h3>
            {variants.map((variant, index) => (
              <div key={index} className="variantRow">
                <div className="containerInput">
                  <input type="number" placeholder="Size" value={variant.size}
                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)} />
                  <input type="text" placeholder="Color" value={variant.color}
                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)} />
                  <input type="number" placeholder="Price" value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)} />
                  <input type="number" placeholder="Quantity" value={variant.quantity}
                    onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)} />
                  <input type="text" placeholder="Image URL (optional)" value={variant.img_url}
                    onChange={(e) => handleVariantChange(index, 'img_url', e.target.value)} />
                  <input type="file" accept="image/*" onChange={(e) => handleVariantImageChange(index, e.target.files?.[0] || null)} />
                </div>
                {variants.length > 1 && (
                  <button type="button" className="removeVariantBtn" onClick={() => removeVariant(index)}>
<>
<Trash2 size={18}/>
Remove
</>                  </button>
                )}
              </div>
            ))}
            <button type="button" className="addVariantBtn" onClick={addVariant}>
<>
<Plus size={18}/>
Add Variant
</>            </button>
          </div>

          {error && <p className="statusMsg error">{error}</p>}

          <div className="uploadActions">
            <button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Uploading...' : <>
<Upload size={18}/>

Publish Product

</>}
            </button>
            <button type="button" className="secondaryBtn" onClick={handleReset}>Reset</button>
          </div>

          <div className="containerUploadAvailable">
            <button type="button" className="linkBtn" onClick={() => navigate('/inventory')}>
              View Inventory
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
