import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerLayout from './layouts/SellerLayout';
import { deleteVariant, getSellerInventory } from './api';
import { useApp } from './context/AppContext';
import { resolveImageUrl } from './utils/helpers';

import "./styles/inventory.css"
import {
    Package,
    Search,
    Plus,
    Boxes,
    AlertTriangle,
    Trash2
} from "lucide-react";


export default function Inventory() {

  const navigate = useNavigate();
  const { seller } = useApp();
  const [data, setData] = useState({ summary: {}, inventory: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInventory = async (term = search) => {
    if (!seller?.sellerid) return;
    setLoading(true);
    try {
      const result = await getSellerInventory(seller.sellerid, term);
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seller?.sellerid) {
      navigate('/signin');
      return;
    }
    loadInventory('');
  }, [seller, navigate]);

  const handleDelete = async (variantId) => {
    if (!window.confirm('Delete this stock item?')) return;
    try {
      await deleteVariant(seller.sellerid, variantId);
      await loadInventory();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && !data.inventory.length) return <p className="statusMsg">Loading inventory...</p>;

  return (
    <SellerLayout>
      <div className="availableContainer">
        <div className="inventoryHeader">

    <div>

        <h1>Inventory</h1>

        <p>
            Manage your products and stock levels.
        </p>

    </div>

    <button
        className="uploadProductBtn"
        onClick={()=>navigate("/uploadstock")}
    >

        <Plus size={18}/>

        Upload Product

    </button>

</div>

        <div className="inventoryStats">

<div className="summaryCard">

    <div className="summaryIcon productsIcon">

        <Package size={22}/>

    </div>

    <h4>Total Products</h4>

    <p>{data.summary?.total_products ?? 0}</p>

</div>

<div className="summaryCard">

    <div className="summaryIcon unitsIcon">

        <Boxes size={22}/>

    </div>

    <h4>Total Units</h4>

    <p>{data.summary?.total_units ?? 0}</p>

</div>

<div className="summaryCard">

    <div className="summaryIcon lowStockIcon">

        <AlertTriangle size={22}/>

    </div>

    <h4>Low Stock</h4>

    <p>{data.summary?.low_stock ?? 0}</p>

</div>

</div>
<div className="inventoryFilters">

    <select>

        <option>All Categories</option>

        <option>Men</option>

        <option>Women</option>

        <option>Kids</option>

    </select>

    <select>

        <option>All Stock</option>

        <option>In Stock</option>

        <option>Low Stock</option>

    </select>

</div>

        <form
    className="inventorySearch"
    onSubmit={(e)=>{
        e.preventDefault();
        loadInventory(search);
    }}
>

<div className="searchInput">

    <Search size={18}/>

<input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<button type="submit">

Search

</button>

</form>

        {error && <p className="statusMsg error">{error}</p>}
        <div className="inventoryGrid">

{!data.inventory.length ? (

<div className="emptyInventory">

<h2>

No Products Yet

</h2>

<p>

Upload your first product to start selling.

</p>

<button
onClick={()=>navigate("/uploadstock")}
>

Upload Product

</button>

</div>

) : (

data.inventory.map((item)=>(

<div
    className="inventoryCard"
    key={item.variant_id}
>

<img
    src={resolveImageUrl(item.image)}
    alt={item.prod_name}
/>

<div className="inventoryInfo">

<h3>{item.prod_name}</h3>

<div className="productMeta">

<span>

{item.category}

</span>

<span>

UK {item.size}

</span>

<span>

{item.color}

</span>

</div>

<div className="inventoryFooter">

<div className="stockInfo">

<small>

Stock

</small>

<strong>

{item.stockquantity} Units

</strong>

</div>

<span
className={
item.status==="In Stock"
?
"inStock"
:
"lowStock"
}
>
</span>

<span className="statusDot"></span>

{item.status}


<button
className="deleteBtn"
onClick={()=>handleDelete(item.variant_id)}
>

<Trash2 size={18}/>

Delete

</button>

</div>

</div>

</div>

))

)}

</div>
        
      </div>
    </SellerLayout>
  );
}
