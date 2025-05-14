import userModel from "../models/userModel.js"
import { loginUser } from "./userController.js";


//add items  to user Cart

const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        cartData.unshift(req.body.selectedFood)
        await userModel.findByIdAndUpdate(req.body.userId, { cartData })

        res.json({ success: true, message: "added To cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" })

    }
}

//remove items from user Cart

const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        const indexToDelete = cartData.findIndex((item) => JSON.stringify(item) === JSON.stringify(req.body.deleted));
        if (indexToDelete !== -1) {
            console.log("hello")
            cartData.splice(indexToDelete, 1);
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData })

        res.json({ success: true, message: "Removed From Cart" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })

    }

};

//fetch user cart data 

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData
        res.json({ success: true, cartData })
        console.log("cartData new")
        console.log(cartData)
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

export { addToCart, removeFromCart, getCart }