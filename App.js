import React, { useEffect } from "react";
import { LogBox } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { MyContextControllerProvider } from "./store";
import Router from "./routers/Router";

// Ignore specific LogBox warnings
LogBox.ignoreLogs([
  "Animated: `useNativeDriver`",
  "shadow* style props are deprecated",
  "props.pointerEvents is deprecated",
  "Module not found: Can't resolve '@react-native-vector-icons/material-design-icons'",
  "export 'DarkTheme' (imported as 'DarkTheme') was not found in 'react-native-paper'"
]);

// Tùy chỉnh theme cho ứng dụng
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff6b81',
    accent: '#ffa502',
    background: '#f1f2f6',
    surface: '#ffffff',
    text: '#2f3542',
    error: '#ff4757',
    success: '#2ed573',
    warning: '#ffa502'
  },
  roundness: 10,
  animation: {
    scale: 1.0,
  },
};

const App = () => {
  const admin = {
    fullName: "Admin",
    email: "admin@gmail.com",
    password: "123456",
    phone: "0913131732",
    address: "Bình Dương",
    role: "admin",
  };

  useEffect(() => {
    const userRef = doc(db, "USERS", admin.email);
    
    const unsubscribe = onSnapshot(userRef, (u) => {
      if (!u.exists()) {
        createUserWithEmailAndPassword(auth, admin.email, admin.password)
          .then(() => {
            setDoc(userRef, admin);
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
    <PaperProvider theme={theme}>
      <MyContextControllerProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </MyContextControllerProvider>
    </PaperProvider>
  );
};

export default App;
