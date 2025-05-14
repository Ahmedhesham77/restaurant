import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import axios from 'axios';
import './leaflet.css';
import './Deliveryage.css';
import io from 'socket.io-client';

const socket = io('ws://localhost:4004', { withCredentials: true });

const DeliveryPage = ({ url }) => {
    const [position, setPosition] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const routingControl = useRef(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);

                if (!mapInstance.current) {
                    mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors',
                    }).addTo(mapInstance.current);

                    L.marker([latitude, longitude])
                        .addTo(mapInstance.current)
                        .bindPopup('You are here!');
                }
            },
            (error) => console.error('Error fetching location:', error),
            { enableHighAccuracy: true }
        );

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const driverToken = localStorage.getItem('token');

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/deivery/allordersfordelivery`, { token: driverToken });
            if (response.data.success) {
                setOrderDetails(response.data.data.orders);
            } else {
                console.error("Failed to fetch orders:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    const handleStatusChange = async (orderId, newStatus) => {
        console.log(newStatus, orderId);
        try {
            // Call your backend API endpoint to update order status
            const response = await axios.post(`${url}/api/order/updatestatus`, { _id: orderId, status: newStatus });

            if (response.data.data) {
                console.log('Order status updated successfully!');
                socket.emit('orderStatusUpdated', { _id: orderId, newStatus });

                if (newStatus === 'complete') {
                    // Remove the completed order from the driver's database
                    try {
                        const removeOrderResponse = await axios.post(`${url}/api/deivery/removeOrderFromDeliveryOrders`, {
                            token: localStorage.getItem('token'), // استخدم توكن السائق
                            orderId,
                        });

                        if (removeOrderResponse.data.success) {
                            console.log('Order removed from driver\'s database successfully!');
                        } else {
                            console.error('Error removing order from driver\'s database:', removeOrderResponse.data.message);
                        }
                    } catch (error) {
                        console.error('Error removing order from driver\'s database:', error);
                    }

                    // Update orderDetails to reflect the removed order
                    setOrderDetails((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                }
            } else {
                console.error('Error updating order status:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    useEffect(() => {
        fetchOrders();

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);

                if (driverToken) {
                    // تحديث موقع السائق وإرسال إلى السيرفر
                    socket.emit('updateLocation', { token: driverToken, location: { latitude, longitude } });

                    // الانضمام لغرفة السائق
                    socket.emit('joinRoom', { token: driverToken });

                    // استقبال الطلبات الجديدة
                    socket.off('newOrder'); // إزالة الاستماع السابق لتجنب الاستماع المكرر
                    socket.on('newOrder', async ({ orderId }) => {
                        try {
                            const response = await axios.post(`${url}/api/order/oneorder`, { _id: orderId });
                            if (response.data.success) {
                                const order = response.data.data;
                                setOrderDetails((prevDetails) => [...prevDetails, order]);
                            }
                        } catch (error) {
                            console.error('Error during order fetch:', error);
                        }
                    });
                }

                // التحقق من المسافة بين السائق والعميل
            },
            (error) => console.error(error),
            { enableHighAccuracy: true }
        );

        return () => {
            socket.off('newOrder'); // إزالة الاستماع للطلبات الجديدة عند إلغاء الاشتراك
            socket.disconnect(); // قطع الاتصال عند الخروج
            navigator.geolocation.clearWatch(watchId); // إيقاف مراقبة الموقع
        };
    }, [driverToken]);


    useEffect(() => {
        if (position && orderDetails.length > 0) {
            const [latitude, longitude] = position;
            const firstOrder = orderDetails[0];
            const { lati, lngi } = firstOrder.address;

            if (lati && lngi) {
                if (mapInstance.current && routingControl.current) {
                    mapInstance.current.removeControl(routingControl.current);
                }

                routingControl.current = L.Routing.control({
                    waypoints: [
                        L.latLng(latitude, longitude),
                        L.latLng(lati, lngi),
                    ],
                    routeWhileDragging: false,
                    createMarker: (i, waypoint) => {
                        const iconUrl = i === 0
                            ? 'https://cdn-icons-png.flaticon.com/512/3448/3448653.png'
                            : 'https://cdn-icons-png.flaticon.com/512/3448/3448654.png';
                        return L.marker(waypoint.latLng, {
                            icon: L.icon({
                                iconUrl,
                                iconSize: [32, 32],
                            }),
                        });
                    },
                }).addTo(mapInstance.current);
            }
        }
    }, [orderDetails]);
    useEffect(() => {
        if (position) {
            const [latitude, longitude] = position;

            // التحقق من عدم وجود طلبات
            if (orderDetails.length === 0) {
                // إزالة المسار السابق إن وجد
                if (mapInstance.current && routingControl.current) {
                    mapInstance.current.removeControl(routingControl.current);
                    routingControl.current = null; // تعيين المرجع إلى null
                }

                // إضافة موقع السائق فقط عند عدم وجود طلبات
                if (mapInstance.current) {
                    L.marker([latitude, longitude], {
                        icon: L.icon({
                            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448653.png', // أيقونة السائق
                            iconSize: [32, 32],
                        }),
                    })
                        .addTo(mapInstance.current)
                        .bindPopup('Driver Location')
                        .openPopup();
                }
            } else {
                // عند وجود طلبات، رسم المسار كما في الكود السابق
                const firstOrder = orderDetails[0];
                const { lati, lngi } = firstOrder.address;

                if (lati && lngi) {
                    // إزالة المسار السابق إذا كان موجودًا
                    if (mapInstance.current && routingControl.current) {
                        mapInstance.current.removeControl(routingControl.current);
                    }

                    // رسم مسار جديد
                    routingControl.current = L.Routing.control({
                        waypoints: [
                            L.latLng(latitude, longitude),
                            L.latLng(lati, lngi),
                        ],
                        routeWhileDragging: false,
                        createMarker: (i, waypoint) => {
                            const iconUrl = i === 0
                                ? 'https://cdn-icons-png.flaticon.com/512/3448/3448653.png'
                                : 'https://cdn-icons-png.flaticon.com/512/3448/3448654.png';
                            return L.marker(waypoint.latLng, {
                                icon: L.icon({
                                    iconUrl,
                                    iconSize: [32, 32],
                                }),
                            });
                        },
                    }).addTo(mapInstance.current);
                }
            }
        }
    }, [orderDetails]);

    return (
        <>
            <div className='container-map'>
                <div id='map' ref={mapRef}></div>
            </div>

            <div className="order-details">
                {orderDetails.length > 0 ? (
                    <div>
                        <h3>Order Details</h3>
                        {orderDetails.map((order, index) => (
                            <div key={index}>
                                <p><strong>Order ID:</strong> {order._id}</p>
                                <p><strong>Customer Name:</strong> {order.address.firstName} {order.address.lastName}</p>
                                <p><strong>Delivery Address:</strong> {order.address.street}, {order.address.city}</p>
                                <select name="status" id="status" onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                                    <option value={order.status}>{order.status}</option>
                                    <option value="complete">complete</option>
                                    <option value="on the way">on the way</option>
                                </select>
                                <hr />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Waiting for new orders...</p>
                )}
            </div>
        </>
    );
};

export default DeliveryPage;
