import mongoose from "mongoose";

const userAdminShcema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    access: { type: Boolean, default: false },
    state: { type: Boolean, default: false },
    password: { type: String, required: true },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    promoCodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PromoCode"
    }]
});

const userAdminModel = mongoose.models.UserAdmin || mongoose.model("UserAdmin", userAdminShcema);
export default userAdminModel;
