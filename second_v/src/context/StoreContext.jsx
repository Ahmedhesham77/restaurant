import { createContext, useEffect, useState } from "react";
import axios from "axios"


export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([])
    const url = "http://localhost:4004"
    const [token, setToken] = useState("")
    const [food_list, setFoodList] = useState([])
    const [discount, setDiscount] = useState(0); // قيمة الخصم
    const [promoMessage, setPromoMessage] = useState(""); // الرسائل الخاصة بالبرومو كود


    const addToCart = async (selectedFood) => {
        setCartItems((prevCartItems) => [...prevCartItems, selectedFood]);
        console.log("cartItems", cartItems)
        if (token) {
            await axios.post(url + "/api/cart/add", { selectedFood }, { headers: { token } })
        }
    };
    const removeFoodFromCart = async (i) => {

        let deleted = cartItems[i]
        console.log("deleted cart items", deleted)

        setCartItems((prevCartItems) => prevCartItems.filter((item, index) => index !== i));

        if (token) {
            await axios.post(url + "/api/cart/remove", { deleted }, { headers: { token } })
        }
    };

    const validatePromoCode = async (promoCode) => {
        try {
            const response = await axios.post(`${url}/api/promo-code/validatePromoCode`, { promoCode, token });
            if (response.data.isActive) {
                setDiscount(response.data.discount); // ضبط الخصم بناءً على الرد
                setPromoMessage("Promo code applied successfully!");
            } else {
                setPromoMessage("Invalid promo code.");
                setDiscount(0); // إلغاء الخصم
            }
        } catch (error) {
            setPromoMessage("Error validating promo code.");
            setDiscount(0); // إلغاء الخصم في حالة حدوث خطأ
        }
    };

    const calculateTotalWithDiscount = () => {
        const subtotal = calculateCartTotal(cartItems);
        return subtotal - discount;
    };
    const loadCartData = async (token) => {

        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        const cartData = response.data.cartData; // Set cartData to an empty array if undefined
        setCartItems(cartData)

    }


    function calculateItemSubtotal(item) {
        const addonPrice = item.addons && item.addons.reduce((acc, addon) => acc + addon.price, 0);
        return item.Quantity * (item.price + addonPrice);
    }
    function calculateCartTotal(cartItems) {
        return cartItems.reduce((acc, item) => acc + calculateItemSubtotal(item), 0);
    }




    const fetchFoodlist = async () => {
        const response = await axios.get(url + "/api/food/list")
        setFoodList(response.data.data)
    }


    useEffect(() => {
        async function loadData() {
            await fetchFoodlist();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadData()
    }, [])




    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        calculateItemSubtotal,
        calculateCartTotal,
        addToCart,
        calculateTotalWithDiscount,
        promoMessage,
        removeFoodFromCart,
        validatePromoCode,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider