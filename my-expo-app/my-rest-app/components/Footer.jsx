import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { assets } from '../../assets/assets';

const Footer = () => {
    const companyLinks = ['Home', 'About us', 'Delivery'];
    const contactLinks = ['01558300711', '2319648'];

    return (
        <View style={styles.footer} id='footer'>
            <View style={styles.footerContent}>
                <View style={styles.footerContentLeft}>
                    <Image source={assets.logo} style={styles.logo} />
                    <Text style={styles.footerText}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum beatae facere, quo at iusto nulla! Unde sequi earum praesentium minus natus odit ut nemo nihil quaerat laudantium magni, a esse?
                    </Text>
                    <View style={styles.footerSocialIcons}>
                        <TouchableOpacity>
                            <Image source={assets.facebook_icon} style={styles.socialIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={assets.twitter_icon} style={styles.socialIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={assets.linkedin_icon} style={styles.socialIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footerContentCenter}>
                    <Text style={styles.footerHeading}>Company</Text>
                    <FlatList
                        data={companyLinks}
                        renderItem={({ item }) => <Text style={styles.footerLink}>{item}</Text>}
                        keyExtractor={(item) => item}
                    />
                </View>

                <View style={styles.footerContentRight}>
                    <Text style={styles.footerHeading}>Get in Touch</Text>
                    <FlatList
                        data={contactLinks}
                        renderItem={({ item }) => <Text style={styles.footerLink}>{item}</Text>}
                        keyExtractor={(item) => item}
                    />
                </View>
            </View>

            <View style={styles.footerBottom}>
                <Text style={styles.footerCopyright}>Copyright 2024 Tomato.com - All Rights Reserved</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        marginTop: 30,
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    footerContentLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    footerContentCenter: {
        flex: 1,
        alignItems: 'center',
    },
    footerContentRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    footerText: {
        marginVertical: 10,
        fontSize: 14,
        color: '#333',
    },
    footerSocialIcons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 10,
    },
    footerHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    footerLink: {
        fontSize: 16,
        color: '#007BFF',
        marginBottom: 5,
    },
    footerBottom: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerCopyright: {
        fontSize: 12,
        color: '#888',
    },
    logo: {
        width: 100,
        height: 100,
    },
});

export default Footer;
