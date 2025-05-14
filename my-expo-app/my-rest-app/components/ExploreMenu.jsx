import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { menu_list } from '../assets/assets.js';

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Explore our menu</Text>
            <Text style={styles.subtitle}>Choose from our delicious meals!</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuList}>
                {menu_list.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuItem, category === item.menu_name && styles.activeMenuItem]}
                        onPress={() => setCategory(prev => (prev === item.menu_name ? "All" : item.menu_name))}
                    >
                        <Image
                            source={{ uri: "../assets/art.jpeg" }}
                            style={[styles.menuImage, category === item.menu_name && styles.activeImage]}
                        />
                        <Text style={styles.menuText}>{item.menu_name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    menuList: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    menuItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    activeMenuItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#ff6347', // لون لتمييز العنصر النشط
    },
    menuImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 5,
        resizeMode: 'cover',
    },
    activeImage: {
        opacity: 0.7, // تأثير عند تحديد العنصر
    },
    menuText: {
        fontSize: 14,
        color: '#333',
    },
});

export default ExploreMenu;
