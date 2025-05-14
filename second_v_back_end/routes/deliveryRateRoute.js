// routes/deliveryRate.js
import express from "express"
import { updateRate, createRate, getCurrentRate } from "../controllers/DeliveryRateController.js"
const deliveryRateRouter = express.Router();

// إنشاء سعر توصيل جديد
deliveryRateRouter.post('/create', createRate);

// تحديث سعر التوصيل
deliveryRateRouter.put('/update/:id', updateRate);

// الحصول على سعر التوصيل الحالي
deliveryRateRouter.get('/current', getCurrentRate);

export default deliveryRateRouter
