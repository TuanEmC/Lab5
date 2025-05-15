import React from "react";
import { Image } from 'react-native';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';
import { useMyContextController } from '../store';

import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Customers from "./Customers";
import Setting from "./Setting";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const ServicesStack = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#694fad',
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
        component={RouterService}
        options={{ 
          title: `Admin: ${userLogin?.fullName || 'Admin'}`,
        }}
      />
    </Stack.Navigator>
  );
};

const Admin = () => {
  const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    materialLight: MD3LightTheme,
  });

  return (
    <Tab.Navigator 
      initialRouteName="Services"
      theme={LightTheme}
      barStyle={{ backgroundColor: '#694fad' }}
    >
      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{
          tabBarLabel: "Dịch vụ",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarLabel: "Giao dịch",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cash" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Customers"
        component={Customers}
        options={{
          tabBarLabel: "Khách hàng",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: "Cài đặt",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default Admin;
