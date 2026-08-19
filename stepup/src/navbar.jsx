import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';

import "./styles/navbar.css";

import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";

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
    '/signin',
    '/regseller',
    '/success-registration',
    '/dashboardseller',
    '/inventory',
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
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {!isSellerPage ? (
        <><>
<div className="navLinks desktopNav">

<button
type="button"
className={`navLinkBtn ${location.pathname === "/" ? "activeNav" : ""}`}
onClick={() => handleNavClick('/')}
>
Home
</button>

<button
type="button"
className={`navLinkBtn ${location.pathname === "/men" ? "activeNav" : ""}`}
onClick={() => handleNavClick('/men')}
>
Men
</button>

<button
type="button"
className={`navLinkBtn ${location.pathname === "/women" ? "activeNav" : ""}`}
onClick={() => handleNavClick('/women')}
>
Women
</button>

<button
type="button"
className={`navLinkBtn ${location.pathname === "/kids" ? "activeNav" : ""}`}
onClick={() => handleNavClick('/kids')}
>
Kids
</button>

</div>

{mobileMenuOpen && (

<>

<div
className="mobileOverlay"
onClick={() => setMobileMenuOpen(false)}
/>

<div className="mobileDrawer">
  <div className="drawerHeader">

<h2>STEPUP</h2>

<button
className="drawerClose"
onClick={() => setMobileMenuOpen(false)}
>

<X size={22}/>

</button>

</div>

<button onClick={() => handleNavClick("/")}>Home</button>

<button onClick={() => handleNavClick("/men")}>Men</button>

<button onClick={() => handleNavClick("/women")}>Women</button>

<button onClick={() => handleNavClick("/kids")}>Kids</button>

<hr/>

<button onClick={toggleTheme}>
{theme === "light" ? "Dark Mode" : "Light Mode"}
</button>

<button onClick={() => navigate("/signin")}>
Seller Portal
</button>

<button onClick={() => user?.userid ? navigate('/wishlist') : navigate('/userLogin')}>
Wishlist
</button>

<button onClick={() => user?.userid ? navigate('/cart') : navigate('/userLogin')}>
Cart
</button>

<button onClick={() => user?.userid ? navigate('/userProfile') : navigate('/userLogin')}>
Profile
</button>

</div>

</>

)}
</>

          <form className="searchBar" onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search className="searchIcon" size={18} />
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
              {theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}
            </button>
            <button type="button" className="sellerBtn" onClick={() => navigate('/signin')}>Seller Portal</button>
            <button type="button" onClick={() => user?.userid ? navigate('/wishlist') : navigate('/userLogin')}><Heart size={18}/></button>
            <button type="button" onClick={() => user?.userid ? navigate('/cart') : navigate('/userLogin')}><ShoppingCart size={18}/></button>
            <button type="button" onClick={() => user?.userid ? navigate('/userProfile') : navigate('/userLogin')}><User size={18}/></button>
          </div>
        </>
      ) : null}
    </div>
  );
}
 