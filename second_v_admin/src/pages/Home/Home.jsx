import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ url }) => {
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [promoCodes, setPromoCodes] = useState([]);
    const [deliveryRate, setDeliveryRate] = useState('');
    const [currentRate, setCurrentRate] = useState(null);

    // جلب البرومو كودات عند تحميل الصفحة
    useEffect(() => {
        axios.get(`${url}/api/promo-code/code`)
            .then(response => setPromoCodes(response.data.promoCodes))
            .catch(error => console.error('حدث خطأ أثناء جلب البرومو كودات:', error));
    }, [url]);

    // جلب سعر التوصيل الحالي
    useEffect(() => {
        axios.get(`${url}/api/delivery-rate/current`)
            .then(response => setCurrentRate(response.data.data))
            .catch(error => console.error('حدث خطأ أثناء جلب سعر التوصيل:', error));
    }, [url]);

    // إرسال بيانات البرومو كود إلى الخادم
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!promoCode.trim()) {
            alert("يرجى إدخال كود البرومو.");
            return;
        }

        if (isNaN(discount) || Number(discount) <= 0) {
            alert("يرجى إدخال نسبة خصم صحيحة أكبر من الصفر.");
            return;
        }

        if (!expiryDate || isNaN(new Date(expiryDate).getTime())) {
            alert("يرجى إدخال تاريخ انتهاء صحيح.");
            return;
        }

        const newPromoCode = {
            promoCode: promoCode.trim(),
            discount: Number(discount),
            expiryDate: new Date(expiryDate),
            usageLimit: Number(usageLimit) || 0,
            isActive,
        };

        try {
            const response = await axios.post(`${url}/api/promo-code/codey`, newPromoCode);
            setPromoCodes([...promoCodes, response.data.promoCode]);
            alert('تم حفظ البرومو كود بنجاح!');
        } catch (error) {
            console.error('حدث خطأ أثناء حفظ البرومو كود:', error);
        }
    };

    // تحديث سعر التوصيل
    const handleDeliveryRateSubmit = async (e) => {
        e.preventDefault();

        if (isNaN(deliveryRate) || Number(deliveryRate) <= 0) {
            alert("يرجى إدخال سعر صحيح أكبر من الصفر.");
            return;
        }

        try {
            const response = await axios.post(`${url}/api/delivery-rate/create`, { ratePerKilometer: Number(deliveryRate) });
            setCurrentRate(response.data.data);
            alert('تم تحديث سعر التوصيل بنجاح!');
        } catch (error) {
            console.error('حدث خطأ أثناء تحديث سعر التوصيل:', error);
        }
    };

    return (
        <div className="home-container">
            <div className="promo-code-section">
                <h2>إدارة البرومو كود</h2>
                <form onSubmit={handleSubmit} className="promo-form">
                    <div className="form-group">
                        <label htmlFor="promoCode">كود البرومو</label>
                        <input
                            type="text"
                            id="promoCode"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="أدخل الكود"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="discount">نسبة الخصم</label>
                        <input
                            type="number"
                            id="discount"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="أدخل نسبة الخصم"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiryDate">تاريخ الانتهاء</label>
                        <input
                            type="date"
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="usageLimit">عدد الاستخدامات المسموح بها</label>
                        <input
                            type="number"
                            id="usageLimit"
                            value={usageLimit}
                            onChange={(e) => setUsageLimit(e.target.value)}
                            placeholder="أدخل العدد"
                        />
                    </div>
                    <div className="form-group">
                        <label>حالة الكود</label>
                        <select
                            value={isActive}
                            onChange={(e) => setIsActive(e.target.value === 'true')}
                        >
                            <option value="true">مفعل</option>
                            <option value="false">غير مفعل</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-btn">حفظ البرومو كود</button>
                </form>
            </div>

            <div className="delivery-rate-section">
                <h2>إدارة سعر التوصيل</h2>
                <form onSubmit={handleDeliveryRateSubmit} className="delivery-rate-form">
                    <div className="form-group">
                        <label htmlFor="deliveryRate">سعر التوصيل لكل كيلومتر</label>
                        <input
                            type="number"
                            id="deliveryRate"
                            value={deliveryRate}
                            onChange={(e) => setDeliveryRate(e.target.value)}
                            placeholder="أدخل السعر"
                        />
                    </div>
                    <button type="submit" className="submit-btn">تحديث السعر</button>
                </form>
                {currentRate && (
                    <p className="current-rate">
                        السعر الحالي لكل كيلومتر: <strong>{currentRate.ratePerKilometer} ريال</strong>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
