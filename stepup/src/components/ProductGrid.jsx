import { useEffect, useState } from 'react';
import { getProducts } from '../api';
import { resolveImageUrl } from '../utils/helpers';
import Component from '../component';
import { useApp } from '../context/AppContext';

export default function ProductGrid({ category }) {
  const { searchQuery, setSearchQuery } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (category) params.category = category;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        const data = await getProducts(params);
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category, searchQuery]);

  if (loading) return <p className="statusMsg">Loading products...</p>;
  if (error) return <p className="statusMsg error">{error}</p>;

  if (!products.length) {
    return (
      <div className="statusMsgContainer" style={{ textAlign: 'center', padding: '40px 20px', width: '100%' }}>
        <p className="statusMsg" style={{ marginBottom: '20px' }}>No products found{searchQuery.trim() ? ` for "${searchQuery}"` : ''}.</p>
        {searchQuery.trim() && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Back to Home
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {searchQuery.trim() && (
        <div className="search-results-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 20px' }}>
          <span style={{ fontSize: '18px', color: '#fff' }}>
            Search results for: <strong>"{searchQuery}"</strong>
          </span>
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Back to Home
          </button>
        </div>
      )}
      <div className="card-elements">
        {products.map((product) => (
          <Component
            key={product.prod_id}
            id={product.prod_id}
            name={product.prod_name}
            color={product.color}
            price={product.price}
            image={resolveImageUrl(product.image)}
            size={product.size}
          />
        ))}
      </div>
    </div>
  );
}
