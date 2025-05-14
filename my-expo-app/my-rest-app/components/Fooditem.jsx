import React, { useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { StoreContext } from '../components/StoreContext.jsx';
import { assets } from '../assets/assets.js';
import axios from 'axios';

const Fooditem = ({ id, name, price, description, image, addons, sizes }) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [foodData, setFoodData] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const items = description.split('|');
    const [selectedCompos, setSelectedCompos] = useState(items);
    const [quantity, setQuantity] = useState(0);
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const { cartItems, addToCart, url } = useContext(StoreContext);

    const handleFoodClick = async () => {
        if (!modalIsOpen) {
            try {
                const response = await axios.get(`${url}/api/food/meal?name=${name}`);
                setFoodData(response.data);
                setIsOpen(true);
            } catch (error) {
                console.error('Error fetching food:', error);
            }
        } else {
            setIsOpen(true);
        }
    };

    const handleCheckboxChange = (value) => {
        if (selectedAddons.includes(value)) {
            setSelectedAddons(selectedAddons.filter(addon => addon !== value));
        } else {
            setSelectedAddons([...selectedAddons, value]);
        }
    };

    const handleComposChange = (value, checked) => {
        if (checked) {
            setSelectedCompos([...selectedCompos, value]);
        } else {
            setSelectedCompos(selectedCompos.filter((item) => item !== value));
        }
    };

    const handleSizeChange = (id) => {
        const selectedSize = sizes.find(size => size._id === id);
        setSelectedSize(selectedSize);
    };

    const plusOne = () => setQuantity(quantity + 1);
    const minusOne = () => setQuantity(quantity - 1);

    const handleAddToCart = () => {
        if (foodData && selectedSize) {
            const selectedFood = {
                id,
                name,
                price: selectedSize.price,
                compos: selectedCompos,
                size: selectedSize.name,
                addons: selectedAddons.map((addonId) => addons.find((addon) => addon._id === addonId)),
                Quantity: quantity === 0 ? quantity + 1 : quantity,
            };
            addToCart(selectedFood);
            setIsOpen(false);
        } else {
            console.warn('Please select a size before adding to cart.');
        }
    };

    return (
        <View style={styles.foodItem}>
            <Modal
                visible={modalIsOpen}
                animationType="slide"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeModalButton}>
                        <Text>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{name}</Text>
                    <Text>{description}</Text>
                    <ScrollView>
                        {items.map((item, index) => (
                            <View key={index} style={styles.checkboxContainer}>
                                <TouchableOpacity onPress={() => handleComposChange(item, !selectedCompos.includes(item))}>
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <Text>Size</Text>
                        {sizes.map(size => (
                            <View key={size._id} style={styles.sizeContainer}>
                                <TouchableOpacity onPress={() => handleSizeChange(size._id)}>
                                    <Text style={styles.sizeName}>{size.name}</Text>
                                    <Text>{`$ ${size.price}`}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <Text>Add-ons:</Text>
                        {addons.map(addon => (
                            <View key={addon._id} style={styles.addonContainer}>
                                <TouchableOpacity onPress={() => handleCheckboxChange(addon._id)}>
                                    <Text>{addon.name} - ${addon.price}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
                            <Text>Add to cart</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            <View style={styles.foodItemImgContainer}>
                <TouchableOpacity onPress={handleFoodClick}>
                    <Image style={styles.foodItemImage} source={{ uri: `${url}/images/${image}` }} />
                </TouchableOpacity>
                {quantity === 0 ? (
                    <TouchableOpacity onPress={plusOne}>
                        <Image style={styles.addIcon} source={assets.add_icon_white} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.foodItemCounter}>
                        <TouchableOpacity onPress={minusOne}>
                            <Image style={styles.removeIcon} source={assets.remove_icon_red} />
                        </TouchableOpacity>
                        <Text>{quantity}</Text>
                        <TouchableOpacity onPress={plusOne}>
                            <Image style={styles.addIcon} source={assets.add_icon_green} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.foodItemInfo} onPress={handleFoodClick}>
                <Text style={styles.foodItemName}>{name}</Text>
                <Text>{description}</Text>
                <Text>{`$${price}`}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    foodItem: {
        marginBottom: 20,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    closeModalButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        marginVertical: 5,
    },
    sizeContainer: {
        marginVertical: 5,
    },
    addonContainer: {
        marginVertical: 5,
    },
    foodItemImgContainer: {
        alignItems: 'center',
    },
    foodItemImage: {
        width: 200,
        height: 200,
    },
    addIcon: {
        width: 30,
        height: 30,
    },
    removeIcon: {
        width: 30,
        height: 30,
    },
    foodItemCounter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    foodItemInfo: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    foodItemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
});

export default Fooditem;
