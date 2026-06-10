
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
import Personal from './personal-details.jsx'
import Confirmation from './confirmation.jsx'
import UPI from './upi.jsx'
import Success from './success.jsx'

import Login from './login.jsx'
import Registration from './regseller.jsx'
import SuccessRegistration from './success-registration.jsx'
import Dashboard from './dashboardseller.jsx'
import AvailableStock from './availablestockseller.jsx'
import Uploadstock from './uploadStock.jsx'
import SuccessStock from './success-stock.jsx'


import CurrentOrders from './current-orders.jsx'
import PasswordRecovery from './password-recovery.jsx'
import ChangePassword from './password-change.jsx'
import CheckoutSteps from './step-component.jsx'
function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/details' element={<Details/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/men' element={<Men/>}></Route>
        <Route path='/women' element={<Women/>}></Route>
        <Route path='/kids' element={<Kids/>}></Route>
        <Route path='/wishlist' element={<Wishlist/>}></Route>
        <Route path='/userProfile' element={<Profile/>}></Route>
        <Route path='/verification' element={<Verification/>}></Route>
        <Route path='/personal-details' element={<Personal/>}></Route>
        <Route path='/confirmation' element={<Confirmation/>}></Route>
        <Route path='/upi' element={<UPI/>}></Route>
        <Route path='/success' element={<Success/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/regseller' element={<Registration/>}></Route>
        <Route path='/success-registration' element={<SuccessRegistration/>}></Route>
        <Route path='/dashboardseller' element={<Dashboard/>}></Route>
        <Route path='/availablestockseller' element={<AvailableStock/>}></Route>
        <Route path='/uploadstock' element={<Uploadstock/>}></Route>
        <Route path='/success-stock' element={<SuccessStock/>}></Route>
        <Route path='/current-orders' element={<CurrentOrders/>}></Route>
        <Route path='/password-recovery' element={<PasswordRecovery/>}></Route>
        <Route path='/password-change' element={<ChangePassword/>}></Route>
        <Route path='/step-component' element={<CheckoutSteps/>}></Route>
      </Routes>
      </BrowserRouter>
  </>
  )
}

export default App
