import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { logout, useMyContextController } from "../store";

const Setting = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const handleLogout = () => {
    logout(dispatch);
  };

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Login");
    }
  }, [userLogin]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Cài đặt</Text>
      <Button mode="contained" onPress={handleLogout}>
        Đăng xuất
      </Button>
    </View>
  );
};

export default Setting;
