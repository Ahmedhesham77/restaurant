import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { assets } from '../assets/assets.js'; // تأكد من أن هذا الملف يحتوي على المسارات الصحيحة للصور

const AppDownload = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                For Better Experience Download {'\n'}Tomato App
            </Text>
            <View style={styles.platformsContainer}>
                <Image source={assets.play_store} style={styles.platformImage} />
                <Image source={assets.app_store} style={styles.platformImage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    platformsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    platformImage: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
    },
});

export default AppDownload;
