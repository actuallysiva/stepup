import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext(null);

const USER_KEY = 'stepup_user';
const SELLER_KEY = 'stepup_seller';
const CHECKOUT_KEY = 'stepup_checkout';
const ORDER_KEY = 'stepup_last_order';
const THEME_KEY = 'stepup_theme';

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => loadJson(USER_KEY, null));
  const [seller, setSellerState] = useState(() => loadJson(SELLER_KEY, null));
  const [checkout, setCheckoutState] = useState(() =>
    loadJson(CHECKOUT_KEY, {
      phone: '',
      verified: false,
      paymentMethod: 'UPI',
      buyNow: false,
      variantId: null,
      quantity: 1,
    })
  );
  const [lastOrder, setLastOrderState] = useState(() => loadJson(ORDER_KEY, null));
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');

  const setUser = (value) => {
    setUserState(value);
    if (value) localStorage.setItem(USER_KEY, JSON.stringify(value));
    else localStorage.removeItem(USER_KEY);
  };

  const setSeller = (value) => {
    setSellerState(value);
    if (value) localStorage.setItem(SELLER_KEY, JSON.stringify(value));
    else localStorage.removeItem(SELLER_KEY);
  };

  const setCheckout = (value) => {
    setCheckoutState((prev) => {
      const next = typeof value === 'function' ? value(prev) : { ...prev, ...value };
      localStorage.setItem(CHECKOUT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setLastOrder = (value) => {
    setLastOrderState(value);
    if (value) localStorage.setItem(ORDER_KEY, JSON.stringify(value));
    else localStorage.removeItem(ORDER_KEY);
  };

  const setTheme = (value) => {
    setThemeState(value);
    localStorage.setItem(THEME_KEY, value);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const logoutUser = () => setUser(null);
  const logoutSeller = () => setSeller(null);

  const value = useMemo(
    () => ({
      user,
      setUser,
      seller,
      setSeller,
      checkout,
      setCheckout,
      lastOrder,
      setLastOrder,
      searchQuery,
      setSearchQuery,
      theme,
      setTheme,
      toggleTheme,
      logoutUser,
      logoutSeller,
    }),
    [user, seller, checkout, lastOrder, searchQuery, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useRequireUser() {
  const { user } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.userid) navigate('/userLogin');
  }, [user, navigate]);
  return user;
}
