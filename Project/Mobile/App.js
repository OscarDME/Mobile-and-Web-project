import { NavigationContainer } from "@react-navigation/native";
import Login from "./src/screens/Inicio/login";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import MainRoot from "./src/navigators/navigationRoutes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Time from "./src/screens/Questionnarie/TimeAndDaysForm"
import Muscles from "./src/screens/Questionnarie/Muscles"

export default function App() {
  return <MainRoot />;
}
