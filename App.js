import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import หน้าจอต่างๆ
import SplashScreen from './components/screens/AASplashScreen';
import OnboardingScreen from './components/screens/ABAOnboardingScreen';
import SelectRole  from './components/screens/ABBSelectRole';
import LoginScreen from './components/screens/ACALoginScreen';
import LoginResScreen from './components/screens/ACBLoginResScreen';
import RegisterScreen from './components/screens/ADARegisterScreen';
import RegisterRasScreen from './components/screens/ADARegisterRasScreen';
import ForgotPasswordScreen from './components/screens/ADBForgotPasswordScreen';
import ForgotPasswordRasScreen from './components/screens/ADBForgotPasswordRasScreen';
import HomeScreen from './components/screens/BAHomeScreen';
import HomeRasScreen from './components/screens/BAHomeRasScreen';
import BookingScreen from './components/screens/BBBookingScreen';
import BookingRasScreen from './components/screens/BBBookingRasScreen';
import BookingSummaryScreen from './components/screens/BCBookingSummaryScreen';
/*import DepositScreen from './components/screens/BDDepositScreen';
import QRSelectionScreen from './components/screens/BEQRSelectionScreen';
import BookingSuccessScreen from './components/screens/BFBookingSuccessScreen';
import SearchScreen from './components/screens/CABSearchScreen';
import MyBookingsScreen from './components/screens/DAMyBookingsScreen';
import ProfileScreen from './components/screens/EAProfileScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer> 
      <Stack.Navigator 
        initialRouteName="Splash" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SelectRole" component={SelectRole} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginResScreen" component={LoginResScreen} />
        <Stack.Screen name="RegisterRas" component={RegisterRasScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ForgotPasswordRas" component={ForgotPasswordRasScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="HomeRas" component={HomeRasScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} /> 
        <Stack.Screen name="BookingRas" component={BookingRasScreen} />
        <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
        {/*<Stack.Screen name="Deposit" component={DepositScreen} />
        <Stack.Screen name="QRSelection" component={QRSelectionScreen} />
        <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}