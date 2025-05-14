import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from "./pages/MyOrders/MyOrders"
import TrackOrder from './pages/TrackOrder/TrackOrder'
import './App.css' // لإضافة الأنيميشن والتنسيقات الخاصة
import { assets } from './assets/assets'

const App = () => {
  const url = "http://localhost:4004"
  const [showLogin, setShowLogin] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowWelcome(false);
      setContentVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {showWelcome && (
        <div className="welcome-screen">
          <img src={assets.logo} className='welcome-logo' />
        </div>
      )}

      <div className={`app ${contentVisible ? 'fade-in' : ''}`}>

        {/* 
        <Navbar setShowLogin={setShowLogin} /> */}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart url={url} />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/trackorder/:orderId" element={<TrackOrder />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App
