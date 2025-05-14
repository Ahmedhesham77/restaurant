import mongoose from "mongoose"


const promoCodeSchema = new mongoose.Schema({
    promoCode: { type: String, required: true },
    discount: { type: Number, required: true }, // نسبة أو قيمة الخصم
    expiryDate: { type: Date, required: true }, // تاريخ انتهاء الصلاحية
    usageLimit: { type: Number, default: 0 }, // عدد الاستخدامات المسموح بها
    isActive: { type: Boolean, default: true }, // حالة البرومو كود (مفعل أو غير مفعل)
    usedBy: { type: [String], default: [] } // قائمة بالـ
});
const promoCodeModel = mongoose.models.PromoCode || mongoose.model("PromoCode", promoCodeSchema);
export default promoCodeModel;
