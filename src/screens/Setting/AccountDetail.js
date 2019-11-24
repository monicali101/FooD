// ## Some tutorial code from
// https://github.com/vikrantnegi/react-native-searchable-flatlist/blob/master/src/SearchableList.js
import React from "react";
import { View, ActivityIndicator, FlatList, Button, Alert } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import MenuImage from "../../Button/Img_menu";

import { Auth, API, graphqlOperation } from "aws-amplify";

class AccountDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Account Details"
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      ide: true,
      AWS_data: []
    };

    this.copy_array = [];
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.getMyDetails()
        .then(() => {
          this.requestAWS();
        })
        .catch(err => {
          console.log("err: ", err);
        });
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  getMyDetails() {
    var cognitoUser = Auth.currentUserInfo().then(user => {
      console.log("myId: ", user.attributes.sub);
      this.setState({
        myId: user.attributes.sub,
        myEmail: user.attributes.email,
        myUsername: user.username,
        ide: false
      });
    });

    return cognitoUser;
  }

  AlertFun = item => {
    Alert.alert("Your favorite food list has been shared to " + item + " !");
  };

  /**
      requestAWS = () => {
            const url = `https://randomuser.me/api/?&results=20`;
            this.setState({ ide: true });
            fetch(url)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        AWS_data: res.results,
                        error: res.error || null,
                        ide: false
                    });
                    this.copy_array = res.results;
                })
                .catch(error => {
                    this.setState({ error, ide: false });
                });
        };
     */
  requestAWS = () => {
    //this.timer = setInterval(() => this.requestAWS(), 100)
    this.setState({
      AWS_data: [
        {
          name: "Rita Dugong",
          email: "rita@gmail.com",
          unread: true
        }
      ],
      ide: false // if is loading or not
    });
  };

  render() {
    //const { navigate } = this.props.navigation;
    if (this.state.ide) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.AWS_data}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View>
                <ListItem
                  avatar={
                    <Avatar
                      rounded
                      overlayContainerStyle={{ backgroundColor: "burlywood" }}
                      large
                      title={
                        this.state.myUsername.length > 1
                          ? this.state.myUsername.charAt(0) + this.state.myUsername.charAt(1)
                          : this.state.myUsername.charAt(0)
                      }
                      height={20}
                      width={20}
                    />
                  }
                  title={`${this.state.myUsername}`}
                  subtitle={this.state.myEmail}
                  hideChevron
                />
                {/* <Button
                                    title={"Change password"}
                                    color={"red"}
                                //onPress={}
                                >
                                </Button> */}
              </View>
            )}
            keyExtractor={item => item.email}
          />
        </View>
      );
    }
  }
}

export default AccountDetail;
