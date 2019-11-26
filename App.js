import React, { Component } from "react";
import Amplify from "@aws-amplify/core";
import { Analytics } from "aws-amplify";
import awsmobile from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import HomeNav from "./src/navigator/HomeNav";
import NetInfo from "@react-native-community/netinfo";
import { Text } from "react-native-elements";

Amplify.configure(awsmobile);
Analytics.configure({ disabled: true });
global.offset = 0;

//const App = () => <Routes />;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connect: true
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectionChange
    );

    NetInfo.isConnected.fetch().done(isConnected => {
      this.setState({ connect: isConnected });
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectionChange
    );
  }

  handleConnectionChange = isConnected => {
    this.setState({ connect: isConnected });
  };

  render() {
    // Check for network connectivity
    if (this.state.connect) {
      return <HomeNav screenProps={{ ...this.props }} />;
      // renders the App component after a successful user sign-in,
      // and it prevents non-sign-in users interact with your app.
    } else {
      return (
        <Text
          style={[
            {
              flex: 1,
              fontSize: 25,
              fontWeight: "bold",
              color: "#333333",
              textAlignVertical: "center",
              textAlign: "center",
              lineHeight: 15
            }
          ]}
        >
          Please connect to Internet!
        </Text>
      );
    }
  }
}
export default withAuthenticator(App, {
  signUpConfig: {
    hiddenDefaults: ["phone_number"]
  }
});
//export default (App);
// removes extra space at top of header on android

// Disable all warning
console.error = error => error.apply;
console.disableYellowBox = true;
console._errorOriginal = console.error.bind(console);
console.reportErrorsAsExceptions = false;
