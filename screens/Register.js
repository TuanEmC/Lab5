import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(true);

  const hasErrorFullName = () => fullName === "";
  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPassword = () => password.length < 6;
  const hasErrorPasswordConfirm = () => passwordConfirm !== password;

  const handleCreateAccount = async () => {
    if (hasErrorFullName() || hasErrorEmail() || hasErrorPassword() || hasErrorPasswordConfirm()) {
      Alert.alert("Thông tin không hợp lệ", "Vui lòng kiểm tra lại các trường dữ liệu.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "USERS", email);
      await setDoc(userRef, {
        fullName,
        email,
        password,
        phone,
        address,
        role: "customer",
      });
      Alert.alert("Đăng ký thành công", "Bạn có thể đăng nhập ngay.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Lỗi đăng ký", "Tài khoản đã tồn tại hoặc không hợp lệ.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          alignSelf: "center",
          color: "pink",
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        Register New Account
      </Text>

      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        mode="outlined"
      />
      <HelperText type="error" visible={hasErrorFullName()}>
        Full name không được phép để trống
      </HelperText>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
      />
      <HelperText type="error" visible={hasErrorEmail()}>
        Địa chỉ email không hợp lệ
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hiddenPassword}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={hiddenPassword ? "eye" : "eye-off"}
            onPress={() => setHiddenPassword(!hiddenPassword)}
          />
        }
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Password ít nhất 6 kí tự
      </HelperText>

      <TextInput
        label="Confirm Password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry={hiddenPasswordConfirm}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={hiddenPasswordConfirm ? "eye" : "eye-off"}
            onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)}
          />
        }
      />
      <HelperText type="error" visible={hasErrorPasswordConfirm()}>
        Confirm Password phải so khớp với password
      </HelperText>

      <TextInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        mode="outlined"
        style={{ marginBottom: 20 }}
      />

      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        keyboardType="phone-pad"
        style={{ marginBottom: 20 }}
      />

      <Button mode="contained" onPress={handleCreateAccount}>
        Create New Account
      </Button>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text>Do you have an account? </Text>
        <Button onPress={() => navigation.navigate("Login")}>
          Login Account
        </Button>
      </View>
    </View>
  );
};

export default Register;
