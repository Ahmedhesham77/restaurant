import React, { useContext, useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import "./leaflet.css";
import "./TrackOrder.css";
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const TrackOrder = () => {
    const [socket, setSocket] = useState(null);
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState({});
    const [ordrState, setOrderState] = useState("");
    const [token, setToken] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false); // حالة لإظهار رسالة الشكر
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const routingControl = useRef(null); // Reference to the routing control

    useEffect(() => {
        const newSocket = io('ws://localhost:4004', { withCredentials: true });
        setSocket(newSocket);

        // تنظيف الاتصال عند إلغاء المكون
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const verifyStatus = (state, location = null) => {
        const { lati, lngi } = orderData.address || {};

        if (state === "complete") {
            console.log("Order completed. Clearing the map and showing thank you message.");
            if (mapInstance.current) {
                mapInstance.current.remove(); // إزالة الخريطة
                mapInstance.current = null;
            }
            setShowThankYou(true); // عرض رسالة الشكر
        } else if (state === "on the way" && location) {
            console.log("Updating route with real-time delivery location.");

            // Remove previous routing control if exists
            if (routingControl.current) {
                mapInstance.current.removeControl(routingControl.current);
            }

            // Create a new route between real-time location and customer
            routingControl.current = L.Routing.control({
                waypoints: [
                    L.latLng(location.latitude, location.longitude), // موقع السائق
                    L.latLng(lati, lngi), // العميل
                ],
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                showAlternatives: false,
                createMarker: (i, waypoint) => {
                    const icons = [
                        'https://cdn-icons-png.flaticon.com/512/3448/3448653.png',
                        'https://cdn-icons-png.flaticon.com/512/3448/3448654.png',
                    ];
                    return L.marker(waypoint.latLng, {
                        icon: L.icon({
                            iconUrl: icons[i],
                            iconSize: [32, 32],
                        }),
                    });
                },
            }).addTo(mapInstance.current);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post("http://localhost:4004/api/order/oneorder", { _id: orderId });
            if (response.data.success) {
                setOrderData(response.data.data);
                const status = response.data.data.status;
                setOrderState(status);
                setToken(response.data.data.deliveryMen.token);

                // Call verifyStatus when order state is fetched
                verifyStatus(status);
            } else {
                console.error(response.data.message);
            }
        };
        fetchData();
    }, [orderId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('orderStatusUpdated', (updatedStatus) => {
            const newState = updatedStatus.newStatus;
            setOrderState(newState);

            // Call verifyStatus on order state update
            verifyStatus(newState);
        });

        return () => {
            if (socket) {
                socket.off('orderStatusUpdated');
            }
        };
    }, [socket]);

    useEffect(() => {
        if (orderData.address) {
            const { lati, lngi } = orderData.address;
            let map = L.map(mapRef.current).setView([lati, lngi], 10);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "Code Man Corp",
                maxZoom: 30,
            }).addTo(map);
            mapInstance.current = map; // Save the map instance

            // Create initial routing control
            routingControl.current = L.Routing.control({
                waypoints: [
                    L.latLng(lati, lngi),
                    L.latLng(31.24085450858617, 29.992484673857696), // مطعم
                ],
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: false,
                showAlternatives: false,
                editable: true,
            }).addTo(map);
        }
    }, [orderData.address]);

    useEffect(() => {
        if (token) {
            socket.emit("joinRoom", { token });
            socket.on('locationUpdate', (location) => {
                const { latitude, longitude } = location;

                // Call verifyStatus with real-time location if order is on the way
                if (ordrState === "on the way") {
                    verifyStatus(ordrState, location);
                }
            });
            return () => {
                socket.off('locationUpdate');
            };
        }
    }, [token, ordrState, socket]);

    return (
        <div>
            {showThankYou ? (
                <div className="thank-you-message">
                    <h1>Thank you for ordering!</h1>
                </div>
            ) : (
                <div ref={(element) => mapRef.current = element} id="map" style={{ flexGrow: 1 }} />
            )}
        </div>
    );
};

export default TrackOrder;
