import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header.jsx";
import ExploreMenu from "../../components/ExploreMenu.jsx";
import FoodDisplay from "../../components/FoodDisplay.jsx";
import AppDownload from "../../components/AppDownload.jsx";
import StoreContextProvider from "../../components/StoreContext.jsx";
import { SafeAreaView } from 'react-native';
const Home = () => {
    const [category, setCategory] = useState("All");

    return (
        <View style={styles.container}>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <StoreContextProvider>
                <SafeAreaView>
                    <FoodDisplay category={category} />
                </SafeAreaView>
            </StoreContextProvider>
            <AppDownload />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

export default Home;
