import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// import CanvasAnimation from '../FireCanvas/FireAnimation'; // إذا كنت تستخدم WebView لعرض الرسوم المتحركة

const Header = () => {
    return (
        <ScrollView style={styles.mainBanner}>
            {/* هنا يمكن تضمين CanvasAnimation باستخدام WebView أو Canvas */}


            <View style={styles.contentWrapper}>
                <View style={styles.hero}>
                    <Text style={styles.title}>
                        والطعم من بلاد <Text style={styles.highlight}>الشام</Text>
                    </Text>

                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={styles.button} onPress={() => console.log('Go to Menu')}>
                            <Text style={styles.buttonText}>Check our Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mainBanner: {
        flex: 1,
        backgroundColor: '#f8f8f8', // لون الخلفية للـ banner
    },
    canvasContainer: {
        width: '100%',
        height: 250, // يمكنك تخصيص هذا حسب حاجتك
        backgroundColor: '#e0e0e0', // الخلفية للـ Canvas إذا لم تستخدم WebView
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    hero: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    highlight: {
        color: '#FF5733', // يمكن تخصيصه حسب اللون الذي تريده
    },
    buttonWrapper: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#FF5733',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Header;
