import React from 'react';
import { Image } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMyContextController } from '../store';

import CustomerServices from './CustomerServices';
import BookService from './BookService';
import CustomerBookings from './CustomerBookings';
import CustomerTransactions from './CustomerTransactions';
import CustomerProfile from './CustomerProfile';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const ServicesStack = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff6b81',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 40, height: 40, marginLeft: 10 }}
            resizeMode="contain"
          />
        ),
        headerRight: () => (
          <MaterialCommunityIcons
            name="account"
            size={24}
            color="#fff"
            style={{ marginRight: 15 }}
          />
        ),
      }}
    >
      <Stack.Screen 
        name="ServicesList" 
        component={CustomerServices}
        options={{ 
          title: `Xin chào, ${userLogin?.fullName || 'Khách'}`,
        }}
      />
      <Stack.Screen 
        name="BookService" 
        component={BookService}
        options={{ 
          title: 'Đặt lịch',
        }}
      />
    </Stack.Navigator>
  );
};

const Customer = () => {
  return (
    <Tab.Navigator
      initialRouteName="Services"
      activeColor="#ff6b81"
      inactiveColor="#999"
      barStyle={{ backgroundColor: '#fff' }}
    >
      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{
          tabBarLabel: 'Dịch vụ',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="spa" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={CustomerBookings}
        options={{
          tabBarLabel: 'Lịch hẹn',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-clock" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={CustomerTransactions}
        options={{
          tabBarLabel: 'Thanh toán',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfile}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Customer;
