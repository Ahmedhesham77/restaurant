import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";

const Cart = ({ closeModal, isInModal }) => {
    const {
        cartItems,
        removeFoodFromCart,
        calculateItemSubtotal,
        calculateCartTotal,
        calculateTotalWithDiscount,
        validatePromoCode,
        promoMessage,
    } = useContext(StoreContext);

    const [promoCode, setPromoCode] = useState("");
    const navigate = useNavigate();

    const handleApplyPromoCode = () => {
        validatePromoCode(promoCode);
    };

    const handleGoShopping = () => {
        if (closeModal) {
            closeModal(); // إغلاق الـ Modal
        }
        navigate("/"); // الانتقال إلى الصفحة الرئيسية
    };

    return (
        <div className={`cart ${isInModal ? 'modal-cart' : ''}`}>
            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p className="empty-cart-message">Cart is Empty</p>
                ) : (
                    <>
                        <div className="cart-items-title">
                            <p>Items</p>
                            <p>Price</p>
                            <p>Quantity</p>
                            {/* إخفاء هذه الأعمدة إذا كان cart في الـ modal */}
                            {!isInModal && <>
                                <p>Size</p>
                                <p>Addons</p>
                                <p>Component</p>
                            </>}
                            <p>Remove</p>
                        </div>
                        <br />
                        <hr />
                        {cartItems.map((item, index) => (
                            <div key={index}>
                                <div className="cart-items-title cart-items-item">
                                    <p>{item.name}</p>
                                    <p>{calculateItemSubtotal(item)} $</p>
                                    <p>{item.Quantity}</p>
                                    {/* إخفاء هذه الأعمدة إذا كان cart في الـ modal */}
                                    {!isInModal && <>
                                        <p>{item.size}</p>
                                        <p>{item.addons ? item.addons.map((addon) => addon.name).join(", ") : ""}</p>
                                        <p>{item.compos ? item.compos.join(", ") : ""}</p>
                                    </>}
                                    <p onClick={() => removeFoodFromCart(index)} className="cross">
                                        x
                                    </p>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="cart-bottom">
                {cartItems.length > 0 && (
                    <div className="cart-total">
                        <div>
                            <h2>Cart Totals</h2>
                            <div className="cart-total-details">
                                <p>Subtotal</p>
                                <p>{calculateCartTotal(cartItems)}$</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Total (with discount)</b>
                                <b>{calculateTotalWithDiscount()}$</b>
                            </div>
                        </div>
                        <button onClick={() => navigate("/order")}>Proceed To Checkout</button>
                    </div>
                )}

                {cartItems.length === 0 && (
                    <div className="cart-promocode">
                        <button onClick={handleGoShopping}>Go Shopping</button>
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="cart-promocode">
                        <div>
                            <p>If you have a promo code, enter it here</p>
                            <div className="cart-promocode-input">
                                <input
                                    type="text"
                                    placeholder="Promo code?"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button onClick={handleApplyPromoCode}>Submit</button>
                            </div>
                            {promoMessage && <p className="promo-message">{promoMessage}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
