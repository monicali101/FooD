import React, { Component } from "react";
import Amplify from "@aws-amplify/core";
import { Analytics } from "aws-amplify";
import awsmobile from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import HomeNav from "./src/navigator/HomeNav";

Amplify.configure(awsmobile);
Analytics.configure({ disabled: true });
global.offset = 0;

//const App = () => <Routes />;

class App extends Component {
  render() {
    return <HomeNav screenProps={{ ...this.props }} />;
    // renders the App component after a successful user sign-in,
    // and it prevents non-sign-in users interact with your app.
  }
}
export default withAuthenticator(App, false);
//export default (App);
// removes extra space at top of header on android
