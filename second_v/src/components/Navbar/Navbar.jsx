import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./navbar.css";
import { StoreContext } from "../../context/StoreContext";


const Navbar = ({ setShowLogin }) => {
    const { cartItems, token } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);

    // غلق القائمة عند الضغط خارج الـ navbar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.navbar')) {
                setIsOpen(false); // إغلاق الـ navbar
            }
        };

        document.addEventListener('click', handleClickOutside);

        // تنظيف الحدث بعد استخدامه
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="logo-link">
                <img src={assets.logo} alt="Logo" className="logo" />
            </Link>

            <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>

            <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
                <li className="cart-box">
                    <Link to="/cart" onClick={() => setIsOpen(false)}>
                        <img className="cart-icon" src={assets.basket_icon} alt="" />
                    </Link>
                    {cartItems.length > 0 && <div className="dot"></div>}
                </li>
                <li>
                    <a href="#food-display" onClick={() => setIsOpen(false)}>
                        Menu
                    </a>
                </li>
                <li>
                    <a href="#food-display" onClick={() => setIsOpen(false)}>
                        Contact Us
                    </a>
                </li>
                <li>
                    {token ? (
                        <img
                            src={assets.profile_icon} // تأكد من وجود الصورة داخل ملف assets
                            alt="Avatar"
                            className="avatar-img"
                            onClick={() => setIsOpen(false)}
                        />
                    ) : (
                        <button className="login-btn" onClick={() => { setShowLogin(true); setIsOpen(false) }}>
                            Login
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
