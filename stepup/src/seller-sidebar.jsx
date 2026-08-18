import {
  LayoutDashboard,
  Package,
  Upload,
  ClipboardList,
  User,
  LogOut,
  Store,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "./context/AppContext";

import "./styles/seller-sidebar.css";

export default function SellerSidebar() {
  const navigate = useNavigate();
  const { logoutSeller } = useApp();

  const handleLogout = () => {
    logoutSeller();
    navigate("/signin");
  };

  return (
    <aside className="sellerSidebar">

      <div className="sellerSidebarBrand">
        <Store size={24} />

        <div>
          <h3>STEPUP</h3>
          <span>Seller Hub</span>
          <div className="sellerOnline">
    Online
</div>
        </div>
      </div>

      <nav className="sellerNav">

        <NavLink
          to="/dashboardseller"
          className={({ isActive }) =>
            isActive ? "sellerNavItem active" : "sellerNavItem"
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive ? "sellerNavItem active" : "sellerNavItem"
          }
        >
          <Package size={20} />
          Inventory
        </NavLink>

        <NavLink
          to="/uploadstock"
          className={({ isActive }) =>
            isActive ? "sellerNavItem active" : "sellerNavItem"
          }
        >
          <Upload size={20} />
          Upload Stock
        </NavLink>

        <NavLink
          to="/current-orders"
          className={({ isActive }) =>
            isActive ? "sellerNavItem active" : "sellerNavItem"
          }
        >
          <ClipboardList size={20} />
          Orders
        </NavLink>

      </nav>

      <div className="sellerSidebarBottom">

        <NavLink
          to="/userProfile"
          className={({ isActive }) =>
            isActive ? "sellerNavItem active" : "sellerNavItem"
          }
        >
          <User size={20} />
          Profile
        </NavLink>

        <button
          className="sellerLogout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}