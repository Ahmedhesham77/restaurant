import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import axios from 'axios';

const Verify = () => {
    const route = useRoute();
    const navigation = useNavigation();


    const { success, orderId } = route.params || {}; // Getting params from route

    const verifyPayment = async () => {
        try {
            const response = await axios.post("http://localhost:4004/api/order/verify", { success, orderId });
            if (response.data.success) {
                navigation.navigate("MyOrders"); // Navigate to 'MyOrders' screen
            } else {
                navigation.navigate("Home"); // Navigate to Home screen if verification fails
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            navigation.navigate("Home"); // In case of error, navigate to Home
        }
    };

    useEffect(() => {
        if (success && orderId) {
            verifyPayment();
        }
    }, [success, orderId]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Verify;
