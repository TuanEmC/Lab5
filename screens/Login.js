import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, HelperText, Text, TextInput, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { login, useMyContextController } from "../store";

const Login = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPassword = () => password.length < 6;

  const handleLogin = async () => {
    if (!hasErrorEmail() && !hasErrorPassword()) {
      setLoading(true);
      try {
        await login(dispatch, email, password);
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userLogin != null) {
      console.log("User logged in:", userLogin);
      if (userLogin.role === "admin") {
        navigation.replace("Admin");
      } else if (userLogin.role === "customer") {
        navigation.replace("Customer");
      }
    }
  }, [userLogin]);

  return (
    <View style={styles.container}>
      <Surface style={styles.loginCard}>
        <Image 
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>
          Welcome to Spa Service
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          disabled={loading}
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />
        <HelperText type="error" visible={hasErrorEmail()}>
          Địa chỉ Email không hợp lệ
        </HelperText>

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={hiddenPassword}
          mode="outlined"
          disabled={loading}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={hiddenPassword ? "eye" : "eye-off"}
              onPress={() => setHiddenPassword(!hiddenPassword)}
            />
          }
          style={styles.input}
        />
        <HelperText type="error" visible={hasErrorPassword()}>
          Password ít nhất 6 kí tự
        </HelperText>

        <Button 
          mode="contained" 
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        <View style={styles.registerContainer}>
          <Text>Don't have an account?</Text>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate("Register")}
            style={styles.registerButton}
          >
            Create New Account
          </Button>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginCard: {
    padding: 20,
    borderRadius: 15,
    elevation: 4,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    color: '#ff6b81',
    marginBottom: 30,
  },
  input: {
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#ff6b81',
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerButton: {
    marginLeft: 5,
  },
});

export default Login;
