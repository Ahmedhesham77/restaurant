import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client';

const TrackOrder = () => {
    const [socket, setSocket] = useState(null);
    const [orderData, setOrderData] = useState({});
    const [orderState, setOrderState] = useState("");
    const [token, setToken] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const route = useRoute();
    const { orderId } = route.params;

    useEffect(() => {
        const newSocket = io('ws://localhost:4004', { withCredentials: true });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const verifyStatus = (state, location = null) => {
        if (state === "complete") {
            setShowThankYou(true);
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

                verifyStatus(status);
            } else {
                console.error(response.data.message);
            }
        };
        fetchData();
    }, [orderId]);

    const { lati, lngi } = orderData.address || {};
    const initialRegion = lati && lngi ? {
        latitude: parseFloat(lati),
        longitude: parseFloat(lngi),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    } : null;

    return (
        <View style={styles.container}>
            {showThankYou ? (
                <View style={styles.thankYouMessage}>
                    <Text style={styles.thankYouText}>Thank you for ordering!</Text>
                </View>
            ) : (
                <MapView
                    style={styles.map}
                    region={initialRegion}
                    showsUserLocation={true}
                >
                    {orderData.address && (
                        <Marker coordinate={{ latitude: parseFloat(lati), longitude: parseFloat(lngi) }} />
                    )}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    thankYouMessage: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    thankYouText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default TrackOrder;
