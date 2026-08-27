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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
    onClick={() => {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
    }}
/>

<div className="mobileDrawer">
  <div className="drawerHeader">

    {!mobileSearchOpen ? (
        <>
            <h2>StepUP</h2>

            <div className="drawerActions">

                <button
                    className="drawerIconBtn"
                    onClick={() => setMobileSearchOpen(true)}
                >
                    <Search size={20}/>
                </button>

                <button
                    className="drawerClose"
                    onClick={()=>{
                        setMobileMenuOpen(false);
                        setMobileSearchOpen(false);
                    }}
                >
                    <X size={22}/>
                </button>

            </div>
        </>
    ) : (

        <form
            className="drawerSearch"
            onSubmit={handleSearch}
        >

            <button
                type="button"
                className="drawerBack"
                onClick={() => setMobileSearchOpen(false)}
            >
                ←
            </button>

            <input
                autoFocus
                placeholder="Search shoes..."
                value={localSearch}
                onChange={(e)=>setLocalSearch(e.target.value)}
            />

            <button
                type="button"
                className="drawerClose"
                onClick={()=>{
                    setMobileMenuOpen(false);
                    setMobileSearchOpen(false);
                }}
            >
                <X size={22}/>
            </button>

        </form>

    )}

</div>

{!mobileSearchOpen && (
    <>

        <button
    className="drawerMenuBtn"
    onClick={() => handleNavClick("/")}
>
    Home
</button>
<button className="drawerMenuBtn" onClick={() => handleNavClick("/men")}>
    Men
</button>

<button className="drawerMenuBtn" onClick={() => handleNavClick("/women")}>
    Women
</button>

<button className="drawerMenuBtn" onClick={() => handleNavClick("/kids")}>
    Kids
</button>

<button className="drawerMenuBtn" onClick={toggleTheme}>
    {theme === "light" ? "Dark Mode" : "Light Mode"}
</button>

<button className="drawerMenuBtn" onClick={() => navigate("/signin")}>
    Seller Portal
</button>

<button className="drawerMenuBtn" onClick={() => user?.userid ? navigate('/wishlist') : navigate('/userLogin')}>
    Wishlist
</button>

<button className="drawerMenuBtn" onClick={() => user?.userid ? navigate('/cart') : navigate('/userLogin')}>
    Cart
</button>

<button className="drawerMenuBtn" onClick={() => user?.userid ? navigate('/userProfile') : navigate('/userLogin')}>
    Profile
</button>

    </>
)}

</div>

</>

)}
</>

          <form className="searchBar" onSubmit={handleSearch}>
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
 