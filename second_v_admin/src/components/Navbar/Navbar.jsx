import React from 'react'
import { assets } from "../../assets/assets"
import "./Navbar.css"

import { NavLink } from 'react-router-dom'
const Navbar = () => {
    console.log(assets.add_icon)
    return (
        <div className='navbar'>
            <img className='logo' src={assets.logo} alt="" />
            <NavLink to="/add" className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>add Items</p>
            </NavLink>

            <NavLink to="/list" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>List Items</p>
            </NavLink>


            <NavLink to="/orders" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Orders</p>
            </NavLink>
            <NavLink to="/delivery" className="sidebar-option">
                <img src={assets.delivery} alt="" />
                <p>delivery</p>
            </NavLink>
            <NavLink to="/Home" className="sidebar-option">

                <h2>Home</h2>
            </NavLink>

        </div>
    )
}

export default Navbar
