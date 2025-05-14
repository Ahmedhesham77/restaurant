import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);

    const [currState, setCurrState] = useState('Login');
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const onChangeHandler = (name, value) => {
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === 'Login') {
            newUrl += '/api/user/login';
        } else {
            newUrl += '/api/user/register';
        }
        try {
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setShowLogin(false);
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred. Please try again later.');
        }
    };

    return (
        <View style={styles.loginPopup}>
            <View style={styles.loginPopupContainer}>
                <View style={styles.loginPopupTitle}>
                    <Text style={styles.title}>{currState}</Text>
                    <TouchableOpacity onPress={() => setShowLogin(false)}>
                        <Text style={styles.closeButton}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.loginPopupInputs}>
                    {currState === 'Login' ? null : (
                        <TextInput
                            name="name"
                            style={styles.input}
                            onChangeText={(value) => onChangeHandler('name', value)}
                            value={data.name}
                            placeholder="Your Name"
                            required
                        />
                    )}
                    <TextInput
                        name="email"
                        style={styles.input}
                        onChangeText={(value) => onChangeHandler('email', value)}
                        value={data.email}
                        placeholder="Your Email"
                        keyboardType="email-address"
                        required
                    />
                    <TextInput
                        name="password"
                        style={styles.input}
                        onChangeText={(value) => onChangeHandler('password', value)}
                        value={data.password}
                        placeholder="Your Password"
                        secureTextEntry
                        required
                    />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={onLogin}>
                    <Text style={styles.submitButtonText}>
                        {currState === 'Sign up' ? 'Create account' : 'Login'}
                    </Text>
                </TouchableOpacity>
                <View style={styles.conditionContainer}>
                    <TouchableOpacity style={styles.checkbox}>
                        <Text style={styles.checkboxText}>✔</Text>
                    </TouchableOpacity>
                    <Text style={styles.conditionText}>
                        By continuing, I agree to the terms of use & privacy policy
                    </Text>
                </View>
                <Text style={styles.toggleText}>
                    {currState === 'Login' ? (
                        <>
                            Create new account?{' '}
                            <Text onPress={() => setCurrState('Sign up')} style={styles.toggleLink}>
                                Click here
                            </Text>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <Text onPress={() => setCurrState('Login')} style={styles.toggleLink}>
                                Click here
                            </Text>
                        </>
                    )}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loginPopup: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    loginPopupContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    loginPopupTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 24,
        color: '#ff0000',
    },
    loginPopupInputs: {
        marginVertical: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#ff5733',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    conditionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        marginRight: 5,
    },
    checkboxText: {
        fontSize: 18,
    },
    conditionText: {
        fontSize: 12,
        color: '#777',
    },
    toggleText: {
        fontSize: 14,
        textAlign: 'center',
    },
    toggleLink: {
        color: '#ff5733',
        textDecorationLine: 'underline',
    },
});

export default LoginPopup;
