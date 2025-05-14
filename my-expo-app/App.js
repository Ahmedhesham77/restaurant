import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// مكوناتك
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import TrackOrder from './pages/TrackOrder/TrackOrder';

const App = () => {
  const url = "http://localhost:4004";
  const [showLogin, setShowLogin] = useState(false);

  // إعداد مكدس التنقل
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <View style={styles.container}>
        <Navbar setShowLogin={setShowLogin} />
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {() => <Home />}
          </Stack.Screen>
          <Stack.Screen name="Cart">
            {() => <Cart url={url} />}
          </Stack.Screen>
          <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
          <Stack.Screen name="Verify" component={Verify} />
          <Stack.Screen name="MyOrders" component={MyOrders} />
          <Stack.Screen name="TrackOrder">
            {({ route }) => <TrackOrder orderId={route.params?.orderId} />}
          </Stack.Screen>
        </Stack.Navigator>
        <Footer />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
