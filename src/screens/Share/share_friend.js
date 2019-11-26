// ## Some tutorial code from
// https://github.com/vikrantnegi/react-native-searchable-flatlist/blob/master/src/SearchableList.js
import React from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  Button,
  Alert,
  StyleSheet
} from "react-native";
import { SearchBar, Avatar, ListItem } from "react-native-elements";
import MenuImage from "../../Button/Img_menu";
import { listReceivedSharedRecords, getUser } from "../../graphql/queries.js";
import {
  createShareHistory,
  updateReceivedShareRecord
} from "../../graphql/mutations.js";

import { Auth, API, graphqlOperation } from "aws-amplify";

class share_friend extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Share History",
      headerLeft: (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      ide: true,
      AWS_data: [],
      myUsername: "",
      myEmail: "",
      myId: ""
    };

    this.copy_array = [];
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.getMyDetails()
        .then(() => {
          //  this.requestAWS();
          this.getMyUserFavourites().then(() => {
            this.requestAWS2();
          });
        })
        .catch(err => {
          console.log("err");
        });
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  ///////////////////// Helper function ////////////////////
  //////////////////////////////////////////////////////////
  changeJSONKey(JSONString, originalKey, newKey) {
    JSONString = JSON.parse(
      JSON.stringify(JSONString)
        .split(`"${originalKey}":`)
        .join(`"${newKey}":`)
    );

    return JSONString;
  }

  arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
  }

  removeEmpty(myArray) {
    for (i = 0; i < myArray.length; i++) {
      if (myArray[i] == "<empty>") {
        myArray.splice(i, 1);
      }
    }
    return myArray;
  }

  //////////////////////////////     AWS    ////////////////////////////
  //////////////////////////////////////////////////////////////////////
  shareFavourites(friendUsername, friendEmail) {
    if (
      Array.isArray(this.state.myFavourites) &&
      this.state.myFavourites.length == 0
    ) {
      var record = {
        senderId: this.state.myId,
        senderEmail: this.state.myEmail,
        senderUsername: this.state.myUsername,
        receiverEmail: friendEmail,
        receiverUsername: friendUsername,
        favourites: ["<empty>"],
        unread: true
      };
    } else {
      var record = {
        senderId: this.state.myId,
        senderEmail: this.state.myEmail,
        senderUsername: this.state.myUsername,
        receiverEmail: friendEmail,
        receiverUsername: friendUsername,
        favourites: this.state.myFavourites,
        unread: true
      };
    }

    console.log("record: ", record);

    var shareRecord = API.graphql(
      graphqlOperation(createShareHistory, { input: record })
    ).then(response => {
      console.log("-------- Shared ------", response);
    });

    return shareRecord;
  }

  getMyUserFavourites() {
    console.log("<--------------- Getting my user record --------------->");

    var myFavourite = API.graphql(
      graphqlOperation(getUser, { id: this.state.myId })
    )
      .then(response => {
        console.log("favourites: ", response.data.getUser["favourites"]);
        console.log(
          "favouriteSearch: ",
          response.data.getUser["favouriteSearch"]
        );

        combinedFavourites = this.removeEmpty(
          response.data.getUser["favourites"]
        ).concat(this.removeEmpty(response.data.getUser["favouriteSearch"]));

        console.log("combinedFavourites: ", combinedFavourites);

        this.setState({
          myFavourites: combinedFavourites
        });
      })
      .catch(err => {
        console.log(err);
      });

    return myFavourite;
  }

  getMyDetails() {
    var cognitoUser = Auth.currentUserInfo().then(user => {
      console.log("myId: ", user.attributes.sub);
      this.setState({
        myId: user.attributes.sub,
        myEmail: user.attributes.email,
        myUsername: user.username
      });
    });

    return cognitoUser;
  }

  requestAWS2 = () => {
    API.graphql(graphqlOperation(listReceivedSharedRecords))
      .then(response => {
        console.log("response: ", response);
        var sharingData = response.data.listReceivedSharedRecords.items;

        sharingData = this.changeJSONKey(sharingData, "senderUsername", "name");
        sharingData = this.changeJSONKey(sharingData, "senderEmail", "email");
        //Ask me to help u later
        this.copy_array = sharingData; // Carter I add this sentences!!!!!!!!!It is very impoartant, need to keep it same as AWS_data every time query
        console.log("sharingData: ", sharingData);
        this.setState({
          AWS_data: sharingData,
          ide: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  convertToRead = item => {
    var record = {
      id: item.id,
      unread: false
    };

    var readRecord = API.graphql(
      graphqlOperation(updateReceivedShareRecord, { input: record })
    )
      .then(response => {
        console.log("response: ", response);
      })
      .catch(err => {
        console.log("err: ", err);
      });

    return readRecord;
  };

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

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
        },
        {
          name: "Carter Cheng",
          email: "chinesecarter@gmail.com",
          unread: false
        },
        {
          name: "Monica Li",
          email: "Monica@gmail.com",
          unread: false
        },
        {
          name: "Ryan Kosz",
          email: "Ryan@gmail.com",
          unread: false
        },
        {
          name: "Rita1 Dugong1",
          email: "rita1@gmail.com",
          unread: true
        },
        {
          name: "Carter1 Cheng1",
          email: "chinesecarter1@gmail.com",
          unread: false
        },
        {
          name: "Monica1 Li1",
          email: "Monica1@gmail.com",
          unread: false
        },
        {
          name: "Ryan1 Kosz1",
          email: "Ryan1@gmail.com",
          unread: false
        }
      ],
      ide: false // if is loading or not
    });

    this.copy_array = [
      {
        name: "Rita Dugong",
        email: "rita@gmail.com",
        unread: true
      },
      {
        name: "Carter Cheng",
        email: "chinesecarter@gmail.com",
        unread: false
      },
      {
        name: "Monica Li",
        email: "Monica@gmail.com",
        unread: false
      },
      {
        name: "Ryan Kosz",
        email: "Ryan@gmail.com",
        unread: false
      },
      {
        name: "Rita1 Dugong1",
        email: "rita1@gmail.com",
        unread: true
      },
      {
        name: "Carter1 Cheng1",
        email: "chinesecarter1@gmail.com",
        unread: false
      },
      {
        name: "Monica1 Li1",
        email: "Monica1@gmail.com",
        unread: false
      },
      {
        name: "Ryan1 Kosz1",
        email: "Ryan1@gmail.com",
        unread: false
      }
    ];
  };

  AlertFun = (item, key1) => {
    console.log("++++++++++++++++++++" + item + key1);

    this.shareFavourites(item, key1)
      .then(response => {
        Alert.alert("Your favorites list has been shared to " + item + " !");
      })
      .catch(err => {
        console.log(err);
      });
  };

  calcTime(time, offset) {
    // create Date object for current location
    var d = new Date(time);

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + 3600000 * offset);

    console.log(nd);

    // return time as a string
    return `${nd.toLocaleDateString()} ${nd.toLocaleTimeString()}`;
  }

  render() {
    const { navigate } = this.props.navigation;
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
            // ListHeaderComponent={
            //   <SearchBar
            //     onChangeText={text => {
            //       const A = this.copy_array.filter(item => {
            //         const B = ` ${item.name.toUpperCase()} ${item.email.toUpperCase()} `;
            //         const C = text.toUpperCase();
            //         const result = B.indexOf(C) > -1;
            //         return result;
            //       });
            //       this.setState({
            //         AWS_data: A
            //       });
            //     }}
            //     placeholder="Search your friend"
            //     containerStyle={{
            //       flex: 1,
            //       backgroundColor: "transparent",
            //       borderTopColor: "transparent",
            //       borderBottomColor: "transparent"
            //     }}
            //     inputContainerStyle={{
            //       backgroundColor: "#EDEDED"
            //     }}
            //     inputStyle={{
            //       width: "100%",
            //       color: "black",
            //       backgroundColor: "#EDEDED",
            //       alignSelf: "center",
            //       textAlign: "center"
            //     }}
            //   />
            // }
            renderItem={({ item }) => (
              <View>
                <ListItem
                  avatar={
                    <Avatar
                      rounded
                      overlayContainerStyle={{ backgroundColor: "burlywood" }}
                      large
                      title={
                        item.name.length > 1
                          ? item.name.charAt(0) + item.name.charAt(1)
                          : item.name.charAt(0)
                        //item.name
                      }
                      height={20}
                      width={20}
                    />
                  }
                  title={`${item.name}`}
                  // subtitle={`${item.createdAt.split("T")[0]} ${
                  //   item.createdAt.split("T")[1].split(".")[0]
                  //   } `}
                  subtitle={this.calcTime(item.createdAt, 11)}
                  hideChevron
                />
                <Button
                  title={item.unread ? "Unread Message" : "View Again"}
                  color={item.unread ? "#eb6262" : "#5bbdb9"}
                  // onPress={
                  //   item.unread
                  //     ? () =>
                  //         this.convertToRead(item).then(() => {
                  //           navigate("receive_friend", {
                  //             friendName: item.name,
                  //             favourites: item.favourites
                  //           });
                  //         })
                  //     : this.AlertFun.bind(this, item.name, item.email)
                  // }

                  onPress={
                    item.unread
                      ? () =>
                          this.convertToRead(item).then(() => {
                            navigate("receive_friend", {
                              friendName: item.name,
                              favourites: item.favourites
                            });
                          })
                      : () =>
                          navigate("receive_friend", {
                            friendName: item.name,
                            favourites: item.favourites
                          })
                  }
                ></Button>
              </View>
            )}
            keyExtractor={item => item.email}
          />

          <View
            style={[
              {
                width: "70%",
                paddingTop: 20,
                paddingBottom: 20,
                alignSelf: "center" //Vertically
              }
            ]}
          >
            <Button
              style={styles.button}
              title="Share my favourites"
              color="#2e2e2e"
              onPress={() => navigate("search_friend")}
            />
          </View>
        </View>
      );
    }
  }
}

export default share_friend;

const styles = StyleSheet.create({
  button: {
    alignSelf: "center" //Vertically
  }
});
