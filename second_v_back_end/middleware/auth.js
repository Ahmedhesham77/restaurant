import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    // تحقق إذا كان التوكن غير موجود
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized login again" });
    }

    try {
        // محاولة فك التوكن والتحقق منه
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next(); // تمرير الطلب للميدل وير التالي

    } catch (error) {
        console.log(error);
        // إرسال رسالة خطأ فقط إذا لم تكن الاستجابة قد أُرسلت مسبقًا
        if (!res.headersSent) {
            return res.status(400).json({ success: false, message: "Invalid token or session expired" });
        }
    }
}

export default authMiddleware;
