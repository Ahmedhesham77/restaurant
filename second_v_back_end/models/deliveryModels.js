import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, requird: true },
    password: { type: String, required: true },
    state: { type: Boolean, default: true },
    image: { type: String, required: true },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order' // اسم الموديل الذي يمثل الطلب
    }]
    , token: { type: String } // الحقل الجديد لحفظ التوكن
})
const deliveryModel = mongoose.models.delivery || mongoose.model("delivery", deliverySchema)
export default deliveryModel