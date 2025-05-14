import express from "express";
import {
    createPromoCode,
    getAllPromoCodes,
    updatePromoCode,
    deletePromoCode,
    validatePromoCode
} from "../controllers/promoCodeController.js";

const promoCodeRouter = express.Router();

// إنشاء برومو كود جديد
promoCodeRouter.post("/codey", createPromoCode);

// جلب جميع البرومو كودات
promoCodeRouter.get("/code", getAllPromoCodes);

// تحديث برومو كود
promoCodeRouter.put("/code/:id", updatePromoCode);

// حذف برومو كود
promoCodeRouter.delete("/code/:id", deletePromoCode);
promoCodeRouter.post("/validatePromoCode", validatePromoCode);

export default promoCodeRouter;
