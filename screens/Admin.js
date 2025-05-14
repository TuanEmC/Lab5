import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Customer from "./Customer";
import Setting from "./Setting";
import Customers from "./Customers";

const Tab = createMaterialBottomTabNavigator();

const Admin = () => {
  return (
    <Tab.Navigator initialRouteName="RouterService">
      <Tab.Screen
        name="RouterService"
        component={RouterService}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarLabel: "Transaction",
          tabBarIcon: ({ color }) => <Icon name="cash" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Customers"
        component={Customers}
        options={{
          tabBarLabel: "Customers",
          tabBarIcon: ({ color }) => <Icon name="account" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ color }) => <Icon name="cog" color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default Admin;
