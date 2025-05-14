import React, { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../../context/StoreContext";

const Cart = () => {
    const {
        food_list,
        cartItems,
        removeFoodFromCart,
        calculateItemSubtotal,
        calculateCartTotal,
        calculateTotalWithDiscount,
        validatePromoCode,
        discount,
        promoMessage,
    } = useContext(StoreContext);

    const [promoCode, setPromoCode] = useState("");
    const navigation = useNavigation();

    const handleApplyPromoCode = () => {
        validatePromoCode(promoCode); // استخدام الوظيفة من `StoreContext`
    };

    const renderCartItem = ({ item, index }) => (
        <View style={styles.cartItem}>
            <Text style={styles.cartText}>{item.name}</Text>
            <Text style={styles.cartText}>{calculateItemSubtotal(item)} $</Text>
            <Text style={styles.cartText}>{item.Quantity}</Text>
            <Text style={styles.cartText}>{item.size}</Text>
            <Text style={styles.cartText}>
                {item.addons ? item.addons.map((addon) => addon.name).join(", ") : ""}
            </Text>
            <Text style={styles.cartText}>
                {item.compos ? item.compos.join(", ") : ""}
            </Text>
            <TouchableOpacity onPress={() => removeFoodFromCart(index)}>
                <Text style={styles.removeButton}>x</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Items</Text>
                        <Text style={styles.headerText}>Price</Text>
                        <Text style={styles.headerText}>Quantity</Text>
                        <Text style={styles.headerText}>Size</Text>
                        <Text style={styles.headerText}>Addons</Text>
                        <Text style={styles.headerText}>Component</Text>
                        <Text style={styles.headerText}>Remove</Text>
                    </View>
                }
                renderItem={renderCartItem}
            />
            <View style={styles.cartBottom}>
                <View style={styles.cartTotal}>
                    <Text style={styles.totalTitle}>Cart Totals</Text>
                    <View style={styles.totalRow}>
                        <Text>Subtotal</Text>
                        <Text>{calculateCartTotal(cartItems)}$</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.boldText}>Total (with discount)</Text>
                        <Text style={styles.boldText}>
                            {calculateTotalWithDiscount()}$
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => navigation.navigate("PlaceOrder")}
                    >
                        <Text style={styles.checkoutText}>Proceed To Checkout</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cartPromocode}>
                    <Text>If you have a promo code, enter it here</Text>
                    <View style={styles.promoInputContainer}>
                        <TextInput
                            style={styles.promoInput}
                            placeholder="Promo code?"
                            value={promoCode}
                            onChangeText={(text) => setPromoCode(text)}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleApplyPromoCode}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    {promoMessage && <Text style={styles.promoMessage}>{promoMessage}</Text>}
                </View>
            </View>
        </View>
    );
};
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    cart: {
        marginTop: 100,
    },
    cartItemsTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        color: "gray",
        fontSize: Math.max(width * 0.01, 12),
    },
    cartItemsItem: {
        marginVertical: 20,
        color: "black",
    },
    hr: {
        height: 1,
        backgroundColor: "#e2e2e2",
        width: "100%",
    },
    cross: {
        color: "red", // يمكنك تخصيص اللون هنا
        fontWeight: "bold",
    },
    cartBottom: {
        marginTop: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: Math.max(width * 0.12, 20),
    },
    cartTotal: {
        flex: 1,
        flexDirection: "column",
        gap: 20,
    },
    cartTotalDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        color: "#555",
    },
    cartTotalButton: {
        borderWidth: 0,
        color: "white",
        backgroundColor: "tomato",
        width: Math.max(width * 0.15, 200),
        paddingVertical: 12,
        borderRadius: 4,
        textAlign: "center",
    },
    cartPromocode: {
        flex: 1,
    },
    cartPromocodeText: {
        color: "#555",
    },
    cartPromocodeInputContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#eaeaea",
        borderRadius: 4,
    },
    cartPromocodeInput: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: 0,
        paddingLeft: 10,
    },
    cartPromocodeButton: {
        width: Math.max(width * 0.1, 150),
        paddingVertical: 12,
        backgroundColor: "black",
        borderRadius: 4,
        textAlign: "center",
        color: "white",
    },
    responsive: {
        flexDirection: "column-reverse",
    },
});


export default Cart;
