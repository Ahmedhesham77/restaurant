import mongoose from "mongoose"


const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    paymentMethod: { type: String },
    deliveryMen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'delivery', // اسم الموديل الذي يمثل عامل التوصيل
        default: null
    },
    deliveryMenName: {
        type: String,
        default: "not specific"

    }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)
export default orderModel