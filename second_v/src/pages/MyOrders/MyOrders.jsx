import React, { useContext, useEffect, useState } from 'react'
import "./MyOrders.css"
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../../assets/assets'
import io from "socket.io-client"
import { useLocation } from 'react-router-dom';


const MyOrders = () => {
    const navigate = useNavigate()
    const [socket, setSocket] = useState(null);

    const { url, token } = useContext(StoreContext)

    const [data, setData] = useState([]) // All fetched orders
    const [displayedOrders, setDisplayedOrders] = useState([]) // Orders to be displayed
    const location = useLocation()


    useEffect(() => {
        const newSocket = io('ws://localhost:4004', { withCredentials: true });
        setSocket(newSocket);

        // تنظيف الاتصال عند إلغاء المكون
        return () => {
            newSocket.disconnect();
        };
    }, []);


    const fetchOrders = async () => {
        if (!token) return
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
        console.log(response.data.data)
        setData(response.data.data);
        setDisplayedOrders(response.data.data.filter(order => order.status !== 'complete')); // Filter out complete orders
    }

    const handleOrderClick = (orderId) => {
        navigate(`/trackorder/${orderId}`) // Pass the order ID as a parameter
    }
    useEffect(() => {
        if (token) {
            fetchOrders(); // تحميل الطلبات دائمًا
        }
    }, [token]);

    // useEffect(() => {
    //     // إعادة تحميل الطلبات إذا تم إرسال حالة من الصفحة السابقة
    //     if (location.state?.reloadOrders) {
    //         fetchOrders();
    //         console.log(location.state)
    //     }
    // }, [location.state]);


    useEffect(() => {
        if (!socket) return; // إذا كان الكائن null، لا تفعل شيئاً

        socket.on('orderStatusUpdated', (updatedStatus) => {
            setData((prevData) =>
                prevData.map(order =>
                    order._id === updatedStatus._id
                        ? { ...order, status: updatedStatus.newStatus }
                        : order
                )
            );

            setDisplayedOrders((prevDisplayedOrders) =>
                prevDisplayedOrders
                    .map(order =>
                        order._id === updatedStatus._id
                            ? { ...order, status: updatedStatus.newStatus }
                            : order
                    )
                    .filter(order => order.status !== 'complete') // إعادة التصفية
            );
        });

        // تنظيف الحدث عند إلغاء المكون
        return () => {
            socket.off('orderStatusUpdated');
        };
    }, [socket]); // يتم التحقق فقط عند تغير الكائن socke

    return (
        <div className='my-orders'>
            <h2>My Order</h2>
            <div className="container">
                {displayedOrders.map((order) => (
                    <div key={order._id} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item, index) => {
                            if (index === order.items.length - 1) {
                                return item.name + " x " + item.Quantity;
                            } else {
                                return item.name + " x " + item.Quantity + ", ";
                            }
                        })}</p>
                        <p>${order.amount}.00</p>
                        <p><span>&#x25cf;</span>  <b>{order.status}</b>  </p>
                        {/* تعطيل الزر بناءً على حالة الطلب */}
                        <button
                            type="button" // تحديد نوع الزر
                            disabled={order.status === "Processing"} // تعطيل إذا كانت الحالة "Processing"
                            onClick={() => {
                                handleOrderClick(order._id);
                            }}
                        >
                            Track Order
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );


}

export default MyOrders