import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

// Tạo Context
const MyContext = createContext();
MyContext.displayName = "vbdvabv";

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

// Khai báo collection
const USERS = firestore().collection("USERS");

// Hàm login
const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => {
      USERS.doc(email).onSnapshot(snapshot => {
        if (snapshot.exists) {
          dispatch({ type: "USER_LOGIN", value: snapshot.data() });
        } else {
          Alert.alert("Tài khoản không tồn tại trong Firestore.");
        }
      });
    })
    .catch(e => Alert.alert("Sai email hoặc password"));
};

// Hàm logout
const logout = (dispatch) => {
  auth()
    .signOut()
    .then(() => dispatch({ type: "LOGOUT" }))
    .catch(e => Alert.alert("Đăng xuất thất bại", e.message));
};

// Export các thành phần
export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
};
