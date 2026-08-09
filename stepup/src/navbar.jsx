import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery, seller, theme, toggleTheme, user } = useApp();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch.trim());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isSellerPage = [
    '/login',
    '/regseller',
    '/success-registration',
    '/dashboardseller',
    '/availablestockseller',
    '/uploadstock',
    '/success-stock',
    '/current-orders',
    '/password-recovery',
    '/password-change'
  ].some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  const handleNavClick = (path) => {
    setSearchQuery('');
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbarLeft">
        <div className="logoCard">
          <h2 onClick={() => { setSearchQuery(''); navigate('/'); }}>StepUP</h2>
        </div>
        <button 
          className="mobileMenuBtn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none' }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {!isSellerPage ? (
        <>
          <div className={`navLinks ${mobileMenuOpen ? 'mobileOpen' : ''}`}>
            <button type="button" className="navLinkBtn" onClick={() => handleNavClick('/')}>Home</button>
            <button type="button" className="navLinkBtn" onClick={() => handleNavClick('/men')}>Men</button>
            <button type="button" className="navLinkBtn" onClick={() => handleNavClick('/women')}>Women</button>
            <button type="button" className="navLinkBtn" onClick={() => handleNavClick('/kids')}>Kids</button>
          </div>

          <form className="searchBar" onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg
              className="searchIcon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{
                position: 'absolute',
                left: '14px',
                width: '18px',
                height: '18px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
            </svg>
            <input
              type="text"
              placeholder="Search shoes..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
          </form>

          <div className="sidebuttons">
            <button type="button" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button type="button" onClick={() => navigate('/login')}>Seller?</button>
            <button type="button" onClick={() => user?.userid ? navigate('/wishlist') : navigate('/userLogin')}>❤️</button>
            <button type="button" onClick={() => user?.userid ? navigate('/cart') : navigate('/userLogin')}>🛒</button>
            <button type="button" onClick={() => user?.userid ? navigate('/userProfile') : navigate('/userLogin')}>Profile</button>
          </div>
        </>
      ) : null}
    </div>
  );
}
