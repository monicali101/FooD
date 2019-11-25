/**
 *  Tutorial from "https://github.com/JenniferChengjr/Comp4920--FooD/blob/Sample/src/navigations/AppNavigation.js"
 */
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";

import RecommendationScreen from "../screens/Recommendation/RecommendationScreen";
import MyRecipe from "../screens/Recipes_Screen";
import MyDrawer from "../screens/MyDrawer";
import Mysearch1 from "../screens/Food_Search/Food_Search";
import MyIngred from "../screens/Ingred_Screen";
import Preferences from "../screens//Setting/Preferences";
import PreferencesNewUser from "../screens//Setting/PreferencesNewUser";
import SettingScreen from "../screens/Setting/SettingScreen";
import Mysearch2 from "../screens/Food_Search/Food_Search2";
import Welcomepage from "../screens/Welcomepage";
import LikedFoods from "../screens/LikedFoods";
import search_friend from "../screens/Share/search_friend";
import share_friend from "../screens/Share/share_friend";
import receive_friend from "../screens/Share/receive_friend";
import AccountDetail from "../screens//Setting/AccountDetail";
import GoogleMap from "../screens/Map/Map";
import ClickRecommendation from "../screens/ClickRecommendation";
import LoginNavigator from "../../App";


const myNavigator = createStackNavigator(
  {
    Home: RecommendationScreen,
    Recommendation: RecommendationScreen,
    Recipe: MyRecipe,
    mysearch1: Mysearch1,
    mysearch2: Mysearch2,
    MyIngredient: MyIngred,
    Preferences: Preferences,
    Welcome: Welcomepage,
    Liked: LikedFoods,
    PreferencesNew: {
      screen: PreferencesNewUser,
      headerMode: "float",
      navigationOptions: {
        header: null,
        headerMode: "float"
      }
    },
    Setting: SettingScreen,
    search_friend: search_friend,
    share_friend: share_friend,
    receive_friend: receive_friend,
    AccountDetail: AccountDetail,
    Map: GoogleMap //,
    // LoginNavigator: LoginNavigator
    Click: ClickRecommendation
  },
  {
    initialRouteName: "Home",

    defaulfNavigationOptions: ({ navigation }) => ({
      headerTitleStyle: {
        fontWeight: "bold",
        flex: 1,
        headerMode: "float",
        textAlign: "center",
        alignSelf: "center"
      }
    })
  }
);

const DrawerStack = createDrawerNavigator(
  {
    Main: myNavigator
  },
  {
    drawerWidth: 251,
    initialRouteName: "Main",
    drawerPosition: "left",
    contentComponent: MyDrawer
  }
);

export default AppContainer = createAppContainer(DrawerStack);

console.disableYellowBox = true;
