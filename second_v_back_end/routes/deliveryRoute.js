import express from "express"
import { addDelivery, allDelivry, updateDeliveryStatus, loginUser, assignOrder, getOrdersForDelivery, removeOrderFromDeliveryOrders } from "../controllers/deliveryController.js"
import multer from "multer"
const deliveryRouter = express.Router()
const storage = multer.diskStorage({
    destination: "deliveryUpload",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
console.log(Date.now)
const upload = multer({ storage: storage })
deliveryRouter.post("/add", upload.single("image"), addDelivery)
deliveryRouter.get("/deliverymen", allDelivry)
deliveryRouter.patch("/deliverystatus", updateDeliveryStatus)
deliveryRouter.post("/login", loginUser)
deliveryRouter.post("/assignorder", assignOrder)
deliveryRouter.post("/allordersfordelivery", getOrdersForDelivery)
deliveryRouter.post("/removeOrderFromDeliveryOrders", removeOrderFromDeliveryOrders)

export default deliveryRouter
