// controllers/DeliveryRateController.js
import DeliveryRateModel from "../models/DeliveryRate.js";

// إنشاء سعر توصيل جديد
export const createRate = async (req, res) => {
    try {
        const { ratePerKilometer } = req.body;
        const newRate = new DeliveryRateModel({ ratePerKilometer });
        await newRate.save();
        res.status(201).json({ success: true, data: newRate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// تحديث سعر التوصيل
export const updateRate = async (req, res) => {
    try {
        const { ratePerKilometer } = req.body;
        const updatedRate = await DeliveryRateModel.findByIdAndUpdate(
            req.params.id,
            { ratePerKilometer },
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedRate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// الحصول على سعر التوصيل الحالي
export const getCurrentRate = async (req, res) => {
    try {
        const rate = await DeliveryRateModel.findOne().sort({ createdAt: -1 }); // آخر سعر تم إدخاله
        res.status(200).json({ success: true, data: rate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
