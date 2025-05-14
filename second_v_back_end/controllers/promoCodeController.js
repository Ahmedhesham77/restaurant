import promoCodeModel from "../models/promoCodeModel.js"; // استيراد نموذج البرومو كود

// إنشاء برومو كود جديد
// إنشاء برومو كود جديد
export const createPromoCode = async (req, res) => {
    try {
        const { promoCode, discount, expiryDate, usageLimit, isActive } = req.body;
        console.log(req.body)
        // التحقق من البيانات المطلوبة
        if (!promoCode || typeof promoCode !== 'string' || promoCode.trim() === '') {
            return res.status(400).json({ message: "كود البرومو مطلوب ولا يمكن أن يكون فارغًا." });
        }
        if (!discount || typeof discount !== 'number' || discount <= 0) {
            return res.status(400).json({ message: "الخصم يجب أن يكون رقمًا صالحًا أكبر من الصفر." });
        }
        if (!expiryDate || isNaN(new Date(expiryDate).getTime())) {
            return res.status(400).json({ message: "تاريخ الانتهاء مطلوب ويجب أن يكون تاريخًا صالحًا." });
        }

        // التحقق من وجود البرومو كود مسبقًا
        const existingCode = await promoCodeModel.findOne({ promoCode });
        if (existingCode) {
            return res.status(400).json({ message: "البرومو كود موجود بالفعل." });
        }

        // إنشاء البرومو كود
        const newPromoCode = new promoCodeModel({
            promoCode: req.body.promoCode,
            discount: req.body.discount,
            expiryDate: req.body.expiryDate,
            usageLimit: req.body.usageLimit, // افتراضي إذا لم يتم الإرسال
            isActive: req.body.isActive, // افتراضي إذا لم يتم الإرسال
        });

        await newPromoCode.save();
        res.status(201).json({ message: "تم إنشاء البرومو كود بنجاح", promoCode: newPromoCode });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إنشاء البرومو كود", error: error.message });
    }
};


// جلب جميع البرومو كودات
export const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await promoCodeModel.find();
        res.status(200).json({ promoCodes });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب البرومو كودات", error: error.message });
    }
};

// تحديث برومو كود
export const updatePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { promoCode, discount, expiryDate, usageLimit, isActive } = req.body;

        // تحديث البرومو كود
        const updatedPromoCode = await promoCodeModel.findByIdAndUpdate(
            id,
            { promoCode, discount, expiryDate, usageLimit, isActive },
            { new: true }
        );

        if (!updatedPromoCode) {
            return res.status(404).json({ message: "لم يتم العثور على البرومو كود" });
        }

        res.status(200).json({ message: "تم تحديث البرومو كود بنجاح", promoCode: updatedPromoCode });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث البرومو كود", error: error.message });
    }
};

// حذف برومو كود
export const deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;

        // حذف البرومو كود
        const deletedPromoCode = await promoCodeModel.findByIdAndDelete(id);

        if (!deletedPromoCode) {
            return res.status(404).json({ message: "لم يتم العثور على البرومو كود" });
        }

        res.status(200).json({ message: "تم حذف البرومو كود بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء حذف البرومو كود", error: error.message });
    }
};

export const validatePromoCode = async (req, res) => {
    try {
        const { promoCode, token } = req.body;

        // التحقق من إرسال البرومو كود والـ token
        if (!promoCode || typeof promoCode !== 'string' || promoCode.trim() === '') {
            return res.status(400).json({
                isActive: false,
                message: "يرجى إدخال البرومو كود."
            });
        }

        if (!token || typeof token !== 'string' || token.trim() === '') {
            return res.status(400).json({
                isActive: false,
                message: "يرجى إدخال التوكن الخاص بالعميل."
            });
        }

        // البحث عن البرومو كود في قاعدة البيانات
        const existingCode = await promoCodeModel.findOne({ promoCode });

        if (!existingCode) {
            return res.status(404).json({
                isActive: false,
                message: "البرومو كود غير صحيح."
            });
        }

        // التحقق من انتهاء صلاحية البرومو كود
        const currentDate = new Date();
        if (new Date(existingCode.expiryDate) < currentDate) {
            return res.status(400).json({
                isActive: false,
                message: "البرومو كود منتهي الصلاحية."
            });
        }

        // التحقق من الحد المسموح للاستخدام
        if (existingCode.usageLimit !== 0 && existingCode.usageLimit <= 0) {
            return res.status(400).json({
                isActive: false,
                message: "تم الوصول إلى الحد الأقصى لاستخدام البرومو كود."
            });
        }

        // التحقق إذا كان العميل قد استخدم الكود مسبقًا
        if (existingCode.usedBy.includes(token)) {
            return res.status(400).json({
                isActive: false,
                message: "لقد استخدمت هذا البرومو كود مسبقًا."
            });
        }

        // التحقق من حالة البرومو كود
        if (!existingCode.isActive) {
            return res.status(400).json({
                isActive: false,
                message: "البرومو كود غير مفعل."
            });
        }

        // تحديث قائمة المستخدمين الذين استخدموا البرومو كود
        existingCode.usedBy.push(token);
        if (existingCode.usageLimit > 0) {
            existingCode.usageLimit -= 1;
        }
        await existingCode.save();

        // إرجاع نسبة الخصم إذا كان البرومو كود صالحًا
        return res.status(200).json({
            isActive: true,
            discount: existingCode.discount,
            message: "تم التحقق من البرومو كود بنجاح."
        });
    } catch (error) {
        res.status(500).json({
            isActive: false,
            message: "حدث خطأ أثناء التحقق من البرومو كود.",
            error: error.message
        });
    }
};

