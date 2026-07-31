import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerLayout from './layouts/SellerLayout';
import { deleteVariant, getSellerInventory } from './api';
import { useApp } from './context/AppContext';
import { resolveImageUrl } from './utils/helpers';

export default function AvailableStock() {
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
      navigate('/login');
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
        <div className="availableHeader">
          <h2>Available Inventory</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => navigate('/dashboardseller')} style={{ background: '#2e2e32', border: '1px solid #3e3e42' }}>
              Back to Dashboard
            </button>
            <button type="button" onClick={() => navigate('/uploadstock')}>Upload Stock</button>
          </div>
        </div>

        <div className="stockSummary">
          <div className="summaryCard"><h4>Total Products</h4><p>{data.summary?.total_products ?? 0}</p></div>
          <div className="summaryCard"><h4>Total Units</h4><p>{data.summary?.total_units ?? 0}</p></div>
          <div className="summaryCard"><h4>Low Stock</h4><p>{data.summary?.low_stock ?? 0}</p></div>
        </div>

        <form className="availableSearch" onSubmit={(e) => { e.preventDefault(); loadInventory(search); }}>
          <input type="text" placeholder="Search Product" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <button type="submit">Search</button>
        </form>

        {error && <p className="statusMsg error">{error}</p>}

        <div className="inventoryTable">
          <div className="tableHeader">
            <span>Image</span><span>Name</span><span>Category</span><span>Size</span>
            <span>Color</span><span>Quantity</span><span>Status</span><span>Actions</span>
          </div>
          {!data.inventory.length ? (
            <p className="statusMsg">No inventory found.</p>
          ) : (
            data.inventory.map((item) => (
              <div className="tableRow" key={item.variant_id}>
                <img src={resolveImageUrl(item.image)} alt={item.prod_name} />
                <span>{item.prod_name}</span>
                <span>{item.category}</span>
                <span>{item.size}</span>
                <span>{item.color}</span>
                <span>{item.stockquantity}</span>
                <span className={item.status === 'In Stock' ? 'inStock' : ''}>{item.status}</span>
                <div className="actionButtons">
                  <button type="button" onClick={() => handleDelete(item.variant_id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
