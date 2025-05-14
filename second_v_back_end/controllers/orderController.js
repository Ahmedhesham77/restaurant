import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import userAdminModel from "../models/userAdminModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
//placing user order for frontend


const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173"
    try {
        if (req.body.paymentMethod === 'cod') {
            // Create the order without Stripe payment
            const newOrder = new orderModel({
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                paymentMethod: 'cod',

            })
            await newOrder.save()
            await userModel.findByIdAndUpdate(req.body.userId, { cartData: [] })
            res.json({ success: true, message: 'Order placed successfully. Cash on delivery payment method selected.' })
        } else {
            // Existing Stripe payment logic
            const newOrder = new orderModel({
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                paymentMethod: 'Stripe'
            })
            console.log(req.body.amount)
            await newOrder.save()
            await userModel.findByIdAndUpdate(req.body.userId, { cartData: [] })
            const line_items = req.body.items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        description: "addons :" + (item.addons.map((addon) => (addon.name))).join(",")
                    },
                    unit_amount: 100 * (item.addons && item.addons.reduce((acc, addon) => acc + addon.price, 0) + item.price),
                },
                quantity: item.Quantity
            }))
            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Delivery Charges"
                    },
                    unit_amount: 2 * 100
                },
                quantity: 1
            })

            const session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: "payment",
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
            })
            res.json({ success: true, session_url: session.url })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        const find = await orderModel.findById({ _id: orderId })


        if (success == "true" && find.paymentMethod === "Stripe") {

            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message: "Paid" })
        }

        else if (find.paymentMethod === "cod") {
            await orderModel.findByIdAndUpdate(orderId, { payment: false })
            res.json({ success: true, message: "Not Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })

    }
}

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId })
        res.json({ success: true, data: orders })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
}

//Listing orders for admin panel

const listingOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

//get one order on click him
const findOrder = async (req, res) => {
    try {
        const orderId = req.body._id;

        // البحث عن الطلب وجلب بيانات عامل التوصيل المرتبطة
        const order = await orderModel
            .findById(orderId)
            .populate({
                path: 'deliveryMen', // اسم الحقل الذي يمثل العلاقة مع عامل التوصيل
                select: 'token' // جلب فقط التوكن واسم عامل التوصيل
            });

        if (!order) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateStatus = async (req, res) => {
    try {
        const userId = req.body._id;
        const status = req.body.status
        const user = await orderModel.findByIdAndUpdate(userId, { status })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

const latestOrder = async (req, res) => {
    try {
        const latestOrder = await orderModel.findOne().sort({ date: -1 }); // جلب أحدث طلب بناءً على تاريخ الإنشاء
        if (!latestOrder) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        res.status(200).json({ success: true, order: latestOrder });
    } catch (error) {
        console.error("Error fetching latest order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const selectedDelivery = async (req, res) => {
    try {
        const { _id: orderId, deliveryMen, deliveryMenName } = req.body;
        const user = await orderModel.findByIdAndUpdate(
            orderId,
            { deliveryMen, deliveryMenName: deliveryMenName },

            { new: true } // لإرجاع الوثيقة بعد التحديث
        );


        if (!orderId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: { orderId, deliveryMen } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

export { placeOrder, verifyOrder, userOrders, listingOrders, findOrder, updateStatus, selectedDelivery, latestOrder }