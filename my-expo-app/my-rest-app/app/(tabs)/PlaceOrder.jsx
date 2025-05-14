import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import axios from 'axios';
import { StoreContext } from '../../components/StoreContext.jsx'; // تحديث المسار بناءً على المشروع
import { useNavigation } from '@react-navigation/native';

const PlaceOrder = () => {
    const { calculateCartTotal, cartItems, token, url, calculateTotalWithDiscount } = useContext(StoreContext);
    const [socket, setSocket] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryRate, setDeliveryRate] = useState(null);
    const [distance, setDistance] = useState(0);
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        lati: '',
        lngi: '',
    });
    const navigation = useNavigation();

    const restaurantLat = 31.24085450858617;
    const restaurantLng = 29.992484673857696;

    useEffect(() => {
        const newSocket = io('http://localhost:4004', { withCredentials: true });
        setSocket(newSocket);

        const fetchDeliveryRate = async () => {
            try {
                const response = await axios.get('http://localhost:4004/api/delivery-rate/current');
                setDeliveryRate(response.data.data.ratePerKilometer);
            } catch (error) {
                console.error('Error fetching delivery rate:', error);
            }
        };

        fetchDeliveryRate();

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location access is required to proceed.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setDistance(calculateDistance(restaurantLat, restaurantLng, latitude, longitude));
            setDeliveryFee(distance * deliveryRate);
            setData((prevData) => ({
                ...prevData,
                lati: latitude,
                lngi: longitude,
            }));
        })();
    }, [deliveryRate]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    const onChangeHandler = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const placeOrder = async () => {
        const orderItems = cartItems.map((item) => ({ ...item }));

        const discountedTotal = calculateTotalWithDiscount();
        const orderData = {
            address: data,
            items: orderItems,
            amount: discountedTotal + deliveryFee,
            paymentMethod: 'stripe', // افتراضي
        };

        try {
            const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });

            if (response.data.success) {
                socket.emit('newOrder', orderData);
                Alert.alert('Order Placed', 'Your order has been placed successfully.');
                navigation.navigate('MyOrders'); // تأكد من تحديث المسار
            } else {
                Alert.alert('Error', 'Failed to place the order.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while placing the order.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Delivery Information</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: restaurantLat,
                    longitude: restaurantLng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={{ latitude: restaurantLat, longitude: restaurantLng }} title="Restaurant" />
                {data.lati && data.lngi && (
                    <Marker coordinate={{ latitude: data.lati, longitude: data.lngi }} title="Your Location" />
                )}
            </MapView>
            <Text style={styles.subtitle}>Or Fill in the Fields Manually</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={data.firstName}
                onChangeText={(value) => onChangeHandler('firstName', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={data.lastName}
                onChangeText={(value) => onChangeHandler('lastName', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={data.email}
                onChangeText={(value) => onChangeHandler('email', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Street"
                value={data.street}
                onChangeText={(value) => onChangeHandler('street', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={data.city}
                onChangeText={(value) => onChangeHandler('city', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="State"
                value={data.state}
                onChangeText={(value) => onChangeHandler('state', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Zip Code"
                value={data.zipCode}
                onChangeText={(value) => onChangeHandler('zipCode', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={data.phone}
                onChangeText={(value) => onChangeHandler('phone', value)}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={placeOrder}>
                    <Text style={styles.buttonText}>Proceed To Payment</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    button: {
        backgroundColor: 'tomato',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PlaceOrder;
