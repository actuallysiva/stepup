
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './navbar.jsx'
import Home from './home.jsx'
import Wishlist from './wishlist.jsx'
import Details from './details.jsx'
import Cart from './cart.jsx'
import Men from './men.jsx'
import Women from './women.jsx'
import Kids from './kids.jsx'
import Profile from './userProfile.jsx'

import Verification from './verification.jsx'
import UserLogin from './userLogin.jsx'
import Personal from './personal-details.jsx'
import Confirmation from './confirmation.jsx'
import Razorpay from './razorpay.jsx'
import Success from './success.jsx'

import SignIn from './signin.jsx'
import Registration from './regseller.jsx'
import SuccessRegistration from './success-registration.jsx'
import Dashboard from './dashboardseller.jsx'
import Inventory from './inventory.jsx'
import Uploadstock from './uploadStock.jsx'
import SuccessStock from './success-stock.jsx'
import CurrentOrders from './current-orders.jsx'
import PasswordRecovery from './password-recovery.jsx'
import ChangePassword from './password-change.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:prodId" element={<Details />} />
        <Route path="/details" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/userProfile" element={<Profile />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/personal-details" element={<Personal />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/razorpay" element={<Razorpay />} />
        <Route path="/success" element={<Success />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/regseller" element={<Registration />} />
        <Route path="/success-registration" element={<SuccessRegistration />} />
        <Route path="/dashboardseller" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/uploadstock" element={<Uploadstock />} />
        <Route path="/success-stock" element={<SuccessStock />} />
        <Route path="/current-orders" element={<CurrentOrders />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/password-change" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
