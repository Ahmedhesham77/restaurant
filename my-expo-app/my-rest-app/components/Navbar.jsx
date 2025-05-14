import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { assets } from '../../assets/assets';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // حالة فتح/إغلاق القائمة
    const [animationValue] = useState(new Animated.Value(0)); // قيمة الرسوم المتحركة
    const navigation = useNavigation();

    // عناصر القائمة
    const menuItems = [
        { label: 'Home', link: '/' },
        { label: 'Menu', link: '#explore-menu' },
        { label: 'Mobile App', link: '#app-download' },
        { label: 'Contact Us', link: '#footer' },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        Animated.timing(animationValue, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleNavigation = (link) => {
        if (link === '/') {
            navigation.navigate('Home'); // التنقل إلى الصفحة الرئيسية
        } else {
            // التنقل إلى روابط أخرى
            console.log(`Navigating to: ${link}`);
        }
    };

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => handleNavigation('/')}>
                <Image source={assets.logo} style={styles.logo} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleMenu} style={styles.menuToggle}>
                <Text style={styles.menuToggleText}>☰</Text>
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.circularMenu,
                    {
                        opacity: animationValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            >
                {menuItems.map((item, index) => {
                    const angle = (360 / menuItems.length) * index;
                    const x = isOpen
                        ? 100 * Math.cos((angle * Math.PI) / 180)
                        : 0;
                    const y = isOpen
                        ? 100 * Math.sin((angle * Math.PI) / 180)
                        : 0;

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.menuItem,
                                {
                                    transform: [{ translateX: x }, { translateY: y }],
                                },
                            ]}
                        >
                            <TouchableOpacity onPress={() => handleNavigation(item.link)}>
                                <Text style={styles.menuItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logo: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
    },
    menuToggle: {
        padding: 10,
        backgroundColor: '#ff5733',
        borderRadius: 50,
    },
    menuToggleText: {
        fontSize: 24,
        color: '#fff',
    },
    circularMenu: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItem: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});

export default Navbar;
