import { createStackNavigator } from "@react-navigation/stack";
import Services from "../screens/Services";
import AddNewService from "../screens/AddNewService";
import ServiceDetail from "../screens/ServiceDetail";
import { useMyContextController } from "../store";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();

const RouterService = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      initialRouteName="Services"
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "pink",
        },
        headerRight: () => (
          <MaterialCommunityIcons 
            name="account"
            size={24}
            style={{ marginRight: 16 }}
            onPress={() => {}}
          />
        )
      }}
    >
      <Stack.Screen 
        name="Services" 
        component={Services}
        options={{
          title: "Danh sách dịch vụ"
        }}
      />
      <Stack.Screen 
        name="AddNewService" 
        component={AddNewService}
        options={{
          title: "Thêm dịch vụ mới"
        }}
      />
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetail}
        options={{
          title: "Chi tiết dịch vụ"
        }}
      />
    </Stack.Navigator>
  );
};

export default RouterService;
