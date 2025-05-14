import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { StoreContext } from "../../components/StoreContext.jsx";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import io from "socket.io-client";

const MyOrders = () => {
    const navigation = useNavigation();
    const [socket, setSocket] = useState(null);
    const { token } = useContext(StoreContext);

    const [data, setData] = useState([]); // All fetched orders
    const [displayedOrders, setDisplayedOrders] = useState([]); // Orders to be displayed

    useEffect(() => {
        const newSocket = io("ws://localhost:4004", { withCredentials: true });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const fetchOrders = async () => {
        if (!token) return;
        const response = await axios.post("http://localhost:4004/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
        setDisplayedOrders(response.data.data.filter((order) => order.status !== "complete")); // Filter out complete orders
    };

    const handleOrderClick = (orderId) => {
        navigation.navigate("TrackOrder", { orderId }); // Pass the order ID as a parameter
    };

    useEffect(() => {
        if (token) {
            fetchOrders(); // Always fetch orders if token exists
        }
    }, [token]);

    useEffect(() => {
        if (!socket) return;

        socket.on("orderStatusUpdated", (updatedStatus) => {
            setData((prevData) =>
                prevData.map((order) =>
                    order._id === updatedStatus._id
                        ? { ...order, status: updatedStatus.newStatus }
                        : order
                )
            );

            setDisplayedOrders((prevDisplayedOrders) =>
                prevDisplayedOrders
                    .map((order) =>
                        order._id === updatedStatus._id
                            ? { ...order, status: updatedStatus.newStatus }
                            : order
                    )
                    .filter((order) => order.status !== "complete")
            );
        });

        return () => {
            socket.off("orderStatusUpdated");
        };
    }, [socket]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Orders</Text>
            <View style={styles.ordersContainer}>
                {displayedOrders.map((order) => (
                    <View key={order._id} style={styles.orderCard}>
                        <Image source={assets.parcel_icon} style={styles.image} />
                        <Text style={styles.orderDetails}>
                            {order.items
                                .map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return `${item.name} x ${item.Quantity}`;
                                    } else {
                                        return `${item.name} x ${item.Quantity}, `;
                                    }
                                })
                                .join("")}
                        </Text>
                        <Text style={styles.orderAmount}>${order.amount}.00</Text>
                        <Text style={styles.orderStatus}>
                            <Text>&#x25cf;</Text> <Text style={styles.bold}>{order.status}</Text>
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.trackButton,
                                order.status === "Processing" && styles.disabledButton,
                            ]}
                            disabled={order.status === "Processing"}
                            onPress={() => handleOrderClick(order._id)}
                        >
                            <Text style={styles.buttonText}>Track Order</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    myOrders: {
        marginVertical: 50,
    },
    container: {
        flexDirection: "column",
        gap: 20,
        marginTop: 30,
    },
    orderCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 30,
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: "#454545",
        borderWidth: 1,
        borderColor: "tomato",
        borderRadius: 4,
    },
    orderStatusIcon: {
        color: "tomato",
    },
    orderStatusText: {
        fontWeight: "500",
        color: "#454545",
    },
    button: {
        borderWidth: 0,
        paddingVertical: 12,
        borderRadius: 4,
        backgroundColor: "tomato",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
    },
    buttonHover: {
        backgroundColor: "#454545",
        color: "tomato",
    },
    // Responsive styling
    "@media (max-width:600px)": {
        orderCard: {
            flexDirection: "column",
        },
    },
});
export default MyOrders;
