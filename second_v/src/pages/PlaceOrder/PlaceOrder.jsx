import React, { useContext, useState, useEffect, useRef } from 'react'
import "./PlaceOrder.css"
import L, { marker } from 'leaflet';
import "./leaflet.css"
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine"

import io from 'socket.io-client';

import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const PlaceOrder = () => {
    const { calculateCartTotal, cartItems, token, url, calculateTotalWithDiscount } = useContext(StoreContext)
    const [socket, setSocket] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(null)
    const [deliveryRate, setDeliveryRate] = useState(null)

    const restaurantLat = 31.24085450858617;
    const restaurantLng = 29.992484673857696;
    const [distance, setDistance] = useState(0)
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        lati: "",
        lngi: ""

    })
    const urlFronEnd = "http://localhost:5173"
    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }
    useEffect(() => {
        const newSocket = io('ws://localhost:4004', { withCredentials: true });
        setSocket(newSocket);
        const fetchDeliveryRate = async () => {
            try {
                const response = await axios.get("http://localhost:4004/api/delivery-rate/current");
                setDeliveryRate(response.data.data.ratePerKilometer); // معدل التوصيل من الخادم
                console.log(response.data.data.ratePerKilometer)
            } catch (error) {
                console.error("Error fetching delivery rate:", error);
            }
        };

        fetchDeliveryRate();

        // تنظيف الاتصال عند إلغاء المكون
        return () => {
            newSocket.disconnect();
        };

    }, []);
    const placeOrder = async (event) => {
        event.preventDefault()
        let orderItems = []

        cartItems.map((item) => {
            if (cartItems.length > 0) {
                let itemInfo = item

                orderItems.push(itemInfo)
            }
        })
        const discountedTotal = calculateTotalWithDiscount();
        let orderData = {
            address: data,
            items: orderItems,
            amount: discountedTotal + deliveryFee, // استخدام السعر بعد الخصم هنا
        }



        // Add payment method selection
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value
        orderData.paymentMethod = paymentMethod

        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
        if (response.data.success) {

            socket.emit("newOrder", orderData)
            if (paymentMethod === 'cod') {
                // Handle COD payment
                alert('Order placed successfully. Cash on delivery payment method selected.')

                window.location.replace(urlFronEnd + "/myorders")
            } else {
                const { session_url } = response.data
                window.location.replace(session_url)
            }
        } else { alert("error") }
        console.log(orderItems);
        console.log(deliveryFee)
    }
    console.log(calculateCartTotal(cartItems))
    const navigate = useNavigate()
    useEffect(() => {
        if (!token) {
            navigate("/cart")
        }
        else if (calculateCartTotal(cartItems) === 0) {
            navigate("/cart")
        }
    })

    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]); // تخزين المصفوفة في الحالة


    useEffect(() => {
        // إنشاء خريطة Leaflet
        let map = L.map(mapRef.current).setView([0, 0], 10);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "Code Man Corp",
            maxZoom: 30,
        }).addTo(map);
        const restaurantMarker = L.marker([31.24085450858617, 29.992484673857696], {
            icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448653.png", // Replace with your icon path
                iconSize: [32, 32], // Adjust icon size as needed
            }),
        }).addTo(map);
        setMarkers({ ...markers, restaurant: restaurantMarker });

        // Get current geolocation on initial render
        if (navigator.geolocation && deliveryRate) {

            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setDistance(calculateDistance(restaurantLat, restaurantLng, latitude, longitude))
                console.log(distance)
                setDeliveryFee(distance * deliveryRate);

                map.setView([latitude, longitude], 16); // Adjust zoom level
                const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                fetch(nominatimUrl)
                    .then(response => response.json())
                    .then(loc => {
                        const address = loc.address;
                        console.log(address)
                        const streetName = address.road || address.street;
                        const neighbourhood = address.suburb || address.neighbourhood;
                        console.log(`Clicked at: ${streetName}, ${address.city},${neighbourhood}, ${address.country},${latitude},${longitude}`);
                        updateAddressData(address, latitude, longitude);
                    })

                    .catch(error => console.error(error));

                // Create initial marker and store it in state
                const newMarker = L.marker([latitude, longitude]).addTo(map);
                setMarkers({ ...markers, [socket.id]: newMarker }); // Use socket ID as unique key

                // Emit initial location to server
                socket.emit("send_location", { latitude, longitude });
            }, (error) => {
                console.error(error);
            });

        }
        const updateAddressData = (address, latitude, longitude) => {
            setData({
                ...data,
                street: address.road || address.street ? address.road || address.street : address.country,
                city: address.city || address.state,
                zipCode: address.postcode,
                state: address.neighbourhood || address.hamlet || address.state,
                lati: latitude,
                lngi: longitude
            });
        };


        // calculate distance
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // نصف قطر الأرض بالكيلومترات
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return Math.round(R * c); // المسافة بالكيلومترات (مقربة إلى أقرب عدد صحيح)
        };

        // Handle map click event
        map.on('click', (e) => {
            const { lat, lng } = e.latlng; // Get clicked coordinates
            const distanceCalc = calculateDistance(restaurantLat, restaurantLng, lat, lng);
            setDeliveryFee(distanceCalc * deliveryRate);


            console.log(`ddddddddddddddd${distance}`)
            console.log("Distance from restaurant:", distanceCalc);
            // Update map view and socket location
            map.setView([lat, lng], 16); // Adjust zoom level
            if (socket) {
                socket.emit("send_location", { latitude: lat, longitude: lng });
            } else {
                console.warn("Socket is not ready to send location");
            }



            map.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer["_latlng"].lat != 31.24085450858617 && layer["_latlng"].lng != 29.992484673857696) {
                    map.removeLayer(layer)

                }

            });


            // Create a new marker for the clicked location
            const newMarker = L.marker([lat, lng]).addTo(map);
            setMarkers({ ...markers, [socket.id]: newMarker }); // Update markers state
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;








            fetch(nominatimUrl)
                .then(response => response.json())
                .then(data => {
                    const address = data.address;
                    console.log(address)
                    const streetName = address.road || address.street;
                    const neighbourhood = address.suburb || address.neighbourhood;
                    console.log(`Clicked at: ${streetName}, ${address.city},${neighbourhood}, ${address.country},${lat},${lng}`);
                    updateAddressData(data.address, lat, lng);

                })


                .catch(error => console.error(error));


        });
        // Cleanup function (optional)
        return () => map.remove(); // Remove map instance on unmount
    }, [socket, deliveryRate]);
    return (
        <>
            <p className="title">Delivery Information</p>
            <form className='place-order' onSubmit={placeOrder}>
                <div className="place-order-left">
                    <div ref={(element) => mapRef.current = element} id="map" style={{ flexGrow: 1 }} />
                    <h3 className='optionOfInformation'><h1>or</h1>Fill in the fields manually</h3>

                    <div className="multi-fields">
                        <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' required />
                        <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' required />
                    </div>
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                    <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />

                    <div className="multi-fields">
                        <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                        <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                    </div>
                    <div className="multi-fields">
                        <input name='zipCode' onChange={onChangeHandler} value={data.zipCode} type="text" placeholder='Zip code' />
                    </div>
                    <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' required />
                </div>
                <div className="place-order-right">
                    <div className="cart-total">

                        <div>
                            <h2>Cart Totals</h2>
                            <div className="cart-total-details">
                                <p>Subtotal</p>
                                <p>{calculateCartTotal(cartItems)}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Delivery fee</p>
                                <p>{deliveryFee}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Total</b>
                                <b>{calculateTotalWithDiscount() + (calculateCartTotal(cartItems) === 0 ? 0 : deliveryFee)}</b>
                            </div>
                        </div>
                        <div>
                            <input type="radio" id="payment-method-stripe" name="payment-method" value="stripe" checked />
                            <label htmlFor="payment-method-stripe">Stripe</label>
                        </div>
                        <div>
                            <input type="radio" id="payment-method-cod" name="payment-method" value="cod" />
                            <label htmlFor="payment-method-cod">Cash on Delivery (COD)</label>
                        </div>

                        <button type='submit'> Proceed To Payment</button>
                    </div>
                </div>


            </form>
        </>
    )
}

export default PlaceOrder
