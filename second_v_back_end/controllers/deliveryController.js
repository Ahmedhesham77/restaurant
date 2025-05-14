import deliveryModel from "../models/deliveryModels.js";
import bcrypt from "bcrypt"
import validator from "validator";
import jwt from "jsonwebtoken";
import fs from "fs"
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await deliveryModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Dosen't exist" })

        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            console.log(user)
            return res.json({ success: false, message: "invalid Cardentials" })

        }


        // تحديث التوكن في قاعدة البيانات
        const token = user.token;
        await user.save();
        res.json({ success: true, token });



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error occurred during login" })

    }
}

const addDelivery = async (req, res) => {

    try {
        if (!req.file) {
            return res.json({ success: false, message: "Please select an image" });
        }

        const { filename } = req.file;
        const { name, phone, email, password } = req.body;

        const exists = await deliveryModel.findOne({
            $or: [{ name }, { email }],
        });

        if (exists) {
            fs.unlinkSync(req.file.path);
            return res.json({ success: false, message: "user already Exist" });
        }

        if (!validator.isEmail(email)) {
            console.log(email)
            fs.unlinkSync(req.file.path);
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 5) {
            fs.unlinkSync(req.file.path);
            return res.json({ success: false, message: "Please enter a strong password", password: password.length });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = jwt.sign({ id: email }, process.env.JWT_SECRET); // باستخدام البريد الإلكتروني كـ معرف فريد
        const newUser = new deliveryModel({
            name: name,
            phone: phone,
            email: email,
            password: hashedPassword,
            image: filename,
            token
        });

        const user = await newUser.save()
        // const token = createToken(user._id)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }

}

const allDelivry = async (req, res) => {
    try {
        const deliveryMen = await deliveryModel.find({})
        res.json({ success: true, data: deliveryMen })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error occurred while adding delivery" })
    }
}
const updateDeliveryStatus = async (req, res) => {
    const { id } = req.body;
    const { status } = req.body;

    try {
        const updatedDelivery = await deliveryModel.findByIdAndUpdate(id, { $set: { state: Boolean(status) } });

        if (!updatedDelivery) {
            return res.status(404).json({ success: false, message: "Delivery not found" });
        }

        res.json({ success: true, data: updatedDelivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const assignOrder = async (req, res) => {

    const { orderId, deliveryManId } = req.body;

    try {



        // تحديث عامل التوصيل وإضافة معرف الطلب إلى قائمته
        const updatedDeliveryMan = await deliveryModel.findByIdAndUpdate(
            deliveryManId,
            { $push: { orders: orderId } }, // استخدام $push لإضافة معرف الطلب إلى القائمة
            { new: true } // لإرجاع عامل التوصيل المحدث
        );

        if (!updatedDeliveryMan) {
            return res.status(404).json({ success: false, message: "Delivery man not found" });
        }

        res.json({
            success: true,
            message: "Order assigned successfully",
            data: { updatedDeliveryMan },
        });
    } catch (error) {
        console.error("Error assigning delivery man:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getOrdersForDelivery = async (req, res) => {
    const { token } = req.body;

    try {
        // البحث عن السائق باستخدام التوكن
        const deliveryMan = await deliveryModel.findOne({ token }).populate('orders');

        // إذا لم يتم العثور على السائق
        if (!deliveryMan) {
            return res.status(404).json({
                success: false,
                message: "Delivery man not found",
            });
        }

        // جلب الطلبات المرتبطة بالسائق
        const orders = deliveryMan.orders;

        // إرجاع الطلبات في الاستجابة
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: { orders },
        });
    } catch (error) {
        // التعامل مع أي أخطاء
        console.error("Error fetching orders for delivery man:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const removeOrderFromDeliveryOrders = async (req, res) => {
    const { token, orderId } = req.body;

    try {
        // البحث عن وثيقة delivery باستخدام التوكن
        const delivery = await deliveryModel.findOne({ token });

        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        // البحث عن المؤشر الخاص بـ orderId في مصفوفة orders
        const orderIndex = delivery.orders.indexOf(orderId);

        if (orderIndex !== -1) {
            // إزالة العنصر من المصفوفة
            delivery.orders.splice(orderIndex, 1);

            // حفظ التغييرات
            await delivery.save();

            return res.status(200).json({ message: "Order removed successfully" });
        } else {
            return res.status(404).json({ message: "Order not found in delivery" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export { addDelivery, allDelivry, updateDeliveryStatus, loginUser, assignOrder, getOrdersForDelivery, removeOrderFromDeliveryOrders }