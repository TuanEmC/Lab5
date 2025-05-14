import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import { MyContextControllerProvider } from "./store";
import Router from "./routers/Router";

const App = () => {
  const USERS = firestore().collection("USERS");

  const admin = {
    fullName: "Admin",
    email: "vanhuudhsp@gmail.com",
    password: "123456",
    phone: "0913131732",
    address: "Bình Dương",
    role: "admin",
  };

  useEffect(() => {
    const unsubscribe = USERS.doc(admin.email).onSnapshot((u) => {
      if (!u.exists) {
        auth()
          .createUserWithEmailAndPassword(admin.email, admin.password)
          .then((response) => {
            USERS.doc(admin.email).set(admin);
            console.log("Thêm tài khoản admin thành công");
          })
          .catch((error) => {
            console.log("Không thể tạo tài khoản admin:", error.message);
          });
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);
  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControllerProvider>
  );
};

export default App;
