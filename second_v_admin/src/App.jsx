import React from 'react'
import Navbar from './components/Navbar/Navbar'
// import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, useLocation } from "react-router-dom"
import Add from './pages/Add/Add'
import List from "./pages/List/List"
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Delivery from './pages/Delivery/Delivery'
import Login from './pages/Login/Login'
import AddUsers from './pages/AddUsers/AddUsers'
import DeliveryPage from './pages/Orders/DeliveryPage/DeliveryPage'
import Home from './pages/Home/Home.jsx'
const App = () => {
  const url = "http://localhost:4004"
  return (

    <div>
      <ToastContainer />
      {location.pathname !== '/deliverypage' && <Navbar />}
      <hr />
      <div className="app-content">
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<Login url={url} />} />
          <Route path="/add-users" element={<AddUsers url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path='/delivery' element={<Delivery url={url} />} />
          <Route path='/deliverypage' element={<DeliveryPage url={url} />} />
          <Route path='/Home' element={<Home url={url} />} />

        </Routes>
      </div>
    </div>
  )
}

export default App
