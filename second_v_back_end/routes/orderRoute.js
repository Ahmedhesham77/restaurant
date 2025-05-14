import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, userOrders, listingOrders, findOrder, updateStatus, selectedDelivery, latestOrder } from "../controllers/orderController.js";


const orderRouter = express.Router()
orderRouter.post("/place", authMiddleware, placeOrder)
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/userorders", authMiddleware, userOrders)
orderRouter.get("/list", listingOrders)
orderRouter.get("/latest", latestOrder)
orderRouter.post("/oneorder", findOrder)
orderRouter.post("/updatestatus", updateStatus)
orderRouter.post("/selectdelivery", selectedDelivery)


export default orderRouter
