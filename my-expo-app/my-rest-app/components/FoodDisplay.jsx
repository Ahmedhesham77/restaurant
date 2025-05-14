import React, { useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StoreContext } from "../components/StoreContext.jsx";
import Fooditem from '../components/Fooditem.jsx';

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    const renderFoodItem = ({ item }) => {
        // نحصل على السعر الافتراضي بناءً على الحجم
        const defPrice = item.sizes.map((size) => {
            if (size.name === "Xl" || size.name === "xl" || size.name === "Xl ") {
                return size.price;
            } else {
                console.log("noSize");
            }
        });

        // إذا كان التصنيف هو "All" أو يطابق تصنيف العنصر
        if (category === "All" || category === item.category) {
            return (
                <Fooditem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    description={item.description}
                    price={defPrice}
                    image={item.image}
                    addons={item.addons}
                    sizes={item.sizes}
                />
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top dishes near You!</Text>

            <FlatList
                data={food_list}
                renderItem={renderFoodItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.foodList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    foodList: {
        marginTop: 10,
    },
});

export default FoodDisplay;
