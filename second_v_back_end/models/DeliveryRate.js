// models/DeliveryRate.js
import mongoose from "mongoose";

const DeliveryRateSchema = new mongoose.Schema({
    ratePerKilometer: {
        type: Number,
        required: true,
        default: 0.5 // مثال: 0.5 دولار لكل كيلومتر
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const DeliveryRateModel = mongoose.models.DeliveryRate || mongoose.model("DeliveryRate", DeliveryRateSchema)
export default DeliveryRateModel
