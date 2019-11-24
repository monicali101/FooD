/**
 * Tutorial learning from "https://github.com/JenniferChengjr/Comp4920--FooD/blob/Sample/src/screens/DrawerContainer/DrawerContainer.js"
 */
import React from "react";
import Btn from "../Button/Btn_Menu";
import { View } from "react-native";
import { Auth } from "aws-amplify";

class MyDrawer extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View
        style={[
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: '#FFFFFF'
          }
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              alignItems: "flex-start",
              paddingHorizontal: 20,
              backgroundColor: '#FFFFFF'
            }
          ]}
        >
          <Btn
            title="Home"
            source={require("../../assets/icons/home.png")}
            onPress={() => {
              navigation.navigate("Recommendation");
              navigation.closeDrawer();
            }}
          />
          <Btn
            title="Search"
            source={require("../../assets/icons/search.png")}
            onPress={() => {
              navigation.navigate("mysearch1");
              navigation.closeDrawer();
            }}
          />
          <Btn
            title="Favourites"
            source={require("../../assets/icons/heartI.png")}
            onPress={() => {
              navigation.navigate("Liked");
              navigation.closeDrawer();
            }}
          />
          <Btn
            title="Share"
            source={require("../../assets/icons/share.png")}
            onPress={() => {
              navigation.navigate("share_friend");
              navigation.closeDrawer();
            }}
          />
          <Btn
            title="Nearby Restaurants"
            source={require("../../assets/icons/map.jpg")}
            onPress={() => {
              navigation.navigate("Map");
              navigation.closeDrawer();
            }}
          />
          <Btn
            title="Account Settings"
            source={require("../../assets/icons/setting.png")}
            onPress={() => {
              navigation.navigate("Setting");
              navigation.closeDrawer();
            }}
          />
          <Btn
            title="Logout"
            source={require("../../assets/icons/logout.png")}
            onPress={() => {
              Auth.signOut()
                .then(() => {
                  this.props.screenProps.onStateChange("signedOut", null);
                  navigation.navigate("Home");
                })
                .catch(err => console.log(err));
              // navigation.navigate("LoginNavigator");
              // navigation.closeDrawer();
            }}
          />
        </View>
      </View>
    );
  }
}
export default MyDrawer;
