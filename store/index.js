import { createContext, useContext, useMemo, useReducer } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, db } from "../firebase";

// Tạo Context
const MyContext = createContext();
MyContext.displayName = "MyContext";

// Định nghĩa reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value };
    case "LOGOUT":
      return { ...state, userLogin: null };
    default:
      throw new Error("Action not found");
  }
};

// Định nghĩa Provider
const MyContextControllerProvider = ({ children }) => {
  const initialState = {
    userLogin: null,
    services: [],
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook để sử dụng context
const useMyContextController = () => {
  const context = useContext(MyContext);
  if (context === null) {
    throw new Error("useMyContextController must be used within MyContextControllerProvider");
  }
  return context;
};

// Hàm login
const login = async (dispatch, email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "USERS", email);
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(userRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            dispatch({ type: "USER_LOGIN", value: userData });
            resolve(unsubscribe);
          } else {
            reject(new Error("Tài khoản không tồn tại trong Firestore."));
            unsubscribe();
          }
        },
        (error) => {
          console.error("Lỗi khi lắng nghe thay đổi:", error);
          reject(error);
          unsubscribe();
        }
      );
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    if (error.code === 'auth/invalid-credential') {
      Alert.alert("Lỗi đăng nhập", "Email hoặc mật khẩu không đúng");
    } else if (error.code === 'auth/network-request-failed') {
      Alert.alert("Lỗi kết nối", "Vui lòng kiểm tra kết nối internet của bạn");
    } else {
      Alert.alert("Lỗi đăng nhập", error.message);
    }
    throw error;
  }
};

// Hàm logout
const logout = async (dispatch) => {

  auth().signOut()
  .then(() => 
    dispatch({ type: "LOGOUT" }))
  }
  
// Export các thành phần
export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
};
