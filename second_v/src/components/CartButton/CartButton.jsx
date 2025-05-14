import React, { useState, useEffect } from 'react';
import { assets } from "../../assets/assets";
import './CartButton.css';
import Cart from "../../pages/Cart/Cart";

const CartButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // حالة لإظهار الـ Modal

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsVisible(true); // يظهر الزر عندما يتجاوز التمرير 100px
        } else {
            setIsVisible(false); // إذا كان التمرير أقل من 100px يختفي الزر
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`floating-button ${isVisible ? 'visible' : ''}`}>
                <button onClick={openModal}>
                    <img className="cart-icon" src={assets.basket_icon} alt="cart" />
                </button>
            </div>

            {isModalOpen && (
                <div className="cart-modal">

                    <div className="cart-modal-content">
                        <button onClick={closeModal} className="close-btn">X</button>
                        {/* تمرير دالة closeModal إلى مكون Cart */}
                        <Cart closeModal={closeModal} isInModal={true} />
                    </div>


                </div>
            )}
        </>
    );
};

export default CartButton;
