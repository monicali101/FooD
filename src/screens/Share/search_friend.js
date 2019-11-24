import React from "react";
import {
  FlatList,
  Text,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Button
} from "react-native";

import { SearchBar } from "react-native-elements";
import MenuImage from "../../Button/Img_menu";
import { Auth, API, graphqlOperation } from "aws-amplify";
import {
  getUser,
  checkFriendEmail,
  checkFriendUsername
} from "../../graphql/queries.js";
import { updateUser, createSharing } from "../../graphql/mutations";
import { createShareHistory } from "../../graphql/mutations";

class search_friend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      button: "",
      buttonColour: "#FFFFFF",
      search: "",
      textColour: "#FFFFFF",
      UserNameArray: [],
      UserEmailArray: [],
      myUsername: "",
      myEmail: "",
      myId: "",
      //   myFavourites: [],
      //   friendIdArray: [],
      myFriendUsernameArray: [],
      myFriendEmailArray: [],
      //   friendFirstnameArray: [],
      //   friendLastnameArray: [],
      //   profilePicArray: []
      searchResultArray: []
    };
  }

  componentDidMount() {
    this.getMyDetails().then(() => {
      this.scroll.scrollTo({ x: 0, y: 0, animated: true });
      const { navigation } = this.props;
      navigation.setParams({
        handleSearch: this.handleSearch
      });
    });
  }

  /// Helper functions ///
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

  getMyUserRecord() {
    console.log("<--------------- Getting my user record --------------->");

    var cognitoUser = Auth.currentUserInfo()
      .then(user => {
        console.log("myId: ", user.attributes.sub);
        this.setState({
          myId: user.attributes.sub
        });

        API.graphql(graphqlOperation(getUser, { id: this.state.myId })).then(
          response => {
            console.log("favourites: ", response.data.getUser["favourites"]);
            console.log(
              "favouriteSearch: ",
              response.data.getUser["favouriteSearch"]
            );

            combinedFavourites = this.removeEmpty(
              response.data.getUser["favourites"]
            ).concat(
              this.removeEmpty(response.data.getUser["favouriteSearch"])
            );

            console.log("combinedFavourites: ", combinedFavourites);

            this.setState({
              myFavourites: combinedFavourites,
              myFriendEmailArray: response.data.getUser["myFriendEmails"],
              myFriendUsernameArray: response.data.getUser["myFriendUsernames"]
            });
          }
        );
      })
      .catch(err => {
        console.log(err);
      });

    return cognitoUser;
  }

  checkFriendEmail(friendEmail) {
    console.log("------- Typed email ------", friendEmail.toLowerCase());

    // var friendDetails = API.graphql(
    //   graphqlOperation(checkFriendEmail, {
    //     friendEmail: friendEmail.toLowerCase()
    //   }) //convert to lower case first
    // ).then(response => {
    //   console.log("------- Search friend result -------", response);
    //   this.setState({
    //     searchResultArray: response.data.checkFriendEmail.items
    //   });
    // });

    var friendDetails = API.graphql(
      graphqlOperation(checkFriendUsername, {
        friendUsername: friendEmail
      }) //convert to lower case first
    ).then(response => {
      console.log("------- Search friend result -------", response);
      this.setState({
        searchResultArray: response.data.checkFriendUsername.items
      });
    });

    return friendDetails;
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

  addFriend(newFriendUsername, newFriendEmail) {
    console.log("<--------------- Getting my user record --------------->");

    var newFriend = API.graphql(
      graphqlOperation(getUser, { id: this.state.myId })
    ).then(response => {
      console.log("favourites: ", response.data.getUser["favourites"]);
      console.log(
        "favouriteSearch: ",
        response.data.getUser["favouriteSearch"]
      );

      combinedFavourites = this.arrayUnique(
        this.removeEmpty(response.data.getUser["favourites"]).concat(
          this.removeEmpty(response.data.getUser["favouriteSearch"])
        )
      );

      console.log("combinedFavourites: ", combinedFavourites);

      console.log(
        "----------- New friend --------: " +
        newFriendUsername +
        ", " +
        newFriendEmail
      );

      var newFriendEmailArray = response.data.getUser["myFriendEmails"].concat(
        newFriendEmail
      );
      var newFriendUsernameArray = response.data.getUser[
        "myFriendUsernames"
      ].concat(newFriendUsername);

      console.log("-------------- New friend array ------------");
      console.log("newFriendEmailArray: ", newFriendEmailArray);

      console.log("newFriendUsernameArray: ", newFriendUsernameArray);

      var record = {
        id: this.state.myId,
        myFriendEmails: newFriendEmailArray,
        myFriendUsernames: newFriendUsernameArray
      };

      API.graphql(graphqlOperation(updateUser, { input: record })).then(
        response => {
          //   console.log(response);
        }
      );

      this.setState({
        myFriendEmailArray: newFriendEmailArray,
        myFriendUsernameArray: newFriendUsernameArray,
        myFavourites: combinedFavourites
      });

      console.log("------- Added Friend. Updated user record:  -------> ");
    });

    return newFriend;
  }

  shareFavourites(friendUsername, friendEmail) {
    if (
      Array.isArray(this.state.myFavourites) &&
      this.state.myFavourites.length == 0
    ) {
      //empty array
      //   var record = {
      //     myId: this.state.myId,
      //     myEmail: this.state.myEmail,
      //     myUserName: this.state.myUsername,
      //     friendEmail: friendEmail,
      //     friendUsername: friendUsername,
      //     favourites: ["<empty>"],
      //     unread: true
      //   };
      // } else {
      //   var record = {
      //     myId: this.state.myId,
      //     myEmail: this.state.myEmail,
      //     myUserName: this.state.myUsername,
      //     friendEmail: friendEmail,
      //     friendUsername: friendUsername,
      //     favourites: this.state.myFavourites,
      //     unread: true
      //   };

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

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  // ADD
  AlertFun = (item, key1) => {
    this.addFriend(item, key1).then(newFriend => {
      const { navigation } = this.props;
      Alert.alert("Success!", item + " has been added to your friend list.");
      navigation.navigate("share_friend");
    });
  };

  // ADD AND SHARE
  AlertFun1 = (item, key1) => {
    this.addFriend(item, key1).then(newFriend => {
      this.shareFavourites(item, key1).then(response => {
        const { navigation } = this.props;
        Alert.alert("Success!", "Your favourites list has been shared with " + item + ".");
        navigation.navigate("share_friend");
      });
    });
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: (
        <SearchBar
          containerStyle={{
            flex: 1,
            backgroundColor: "transparent",
            borderTopColor: "transparent",
            borderBottomColor: "transparent"
          }}
          inputContainerStyle={{
            backgroundColor: "#EDEDED"
          }}
          inputStyle={{
            width: "85%",
            color: "black",
            backgroundColor: "#EDEDED",
            borderRadius: 10,
            justifyContent: "center"
          }}
          searchIcond
          round
          onSubmitEditing={event => params.handleSearch(event.nativeEvent.text)} //text => params.handleSearch(text)}
          placeholder="Enter Foo(D) account username"
          value={params.data}
        />
      )
    };
  };

  handleSearch = text => {
    this.setState(
      {
        button: "Loading...",
        buttonColour: "#FFFFFF",
        textColour: "#000000",
        search: text,
        result: []
      },
      () => {
        this.next(text);
      }
    );
  };

  next = text => {
    if (text == "") {
      this.setState(prevState => ({
        UserNameArray: [],
        UserEmailArray: [],
        result: [...prevState.result, {}]
      }));
    } else {
      // modify this if the query sendback array is empty (no result in AWS)
      console.log("--------- Checking email -----------", text.toLowerCase());
      this.checkFriendEmail(text).then(response => {
        if (
          Array.isArray(this.state.searchResultArray) &&
          this.state.searchResultArray.length != 0
        ) {
          //   console.log("--------- State after check ---------", this.state);

          //build array for display
          var UserNameArray = [];
          var UserEmailArray = [];
          for (var item in this.state.searchResultArray) {
            //console.log("item: ", this.state.searchResultArray[item]);
            UserNameArray.push(this.state.searchResultArray[item]["username"]);
            UserEmailArray.push(this.state.searchResultArray[item]["email"]);
          }

          console.log("UserNameArray: ", UserNameArray);
          console.log("UserEmailArray: ", UserEmailArray);

          this.setState(prevState => ({
            //-----------------------------------------------------------------------------------------------------
            //Add AWS query function here, this will call ur aws function and send query
            //-----------------------------------------------------------------------------------------------------

            // I need the query send the user inputed search text and fecth back the friend result

            //-----------------------------------------------------------------------------------------------------
            // UserNameArray: ["Carter", "Rita", "Monica"],
            // UserEmailArray: [
            //   "chinesecarter@gmail.com",
            //   "Rita@gmail.com",
            //   "Monica@gmail.com"
            // ],
            UserNameArray: UserNameArray,
            UserEmailArray: UserEmailArray,

            result: [...prevState.result, {}]
          }));
        } else {
          Alert.alert(
            "No search result",
            "Please check if you have entered the correct username",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );

          this.setState({
            button: "No results",
            buttonColour: "#FFFFFF",
            textColour: "#000000"
          });
        }
      });
    }
  };

  /**
        onPressFood = item => {
            this.props.navigation.navigate("Recipe", { item });
        };
     */
  renderFood = () => (
    <View
      style={{
        flex: 1,
        height: 150 * this.state.UserNameArray.length,
        width: Dimensions.get("window").width,
        alignSelf: "center",
        backgroundColor: "#dcdcdc"
      }}
    >
      {this.state.UserNameArray.map((item, key1) => (
        <View
          key={Math.random().toString()}
          style={{
            flex: 1,
            height: 150 * this.state.UserNameArray.length,
            width: Dimensions.get("window").width,
            alignSelf: "center",
            borderBottomWidth: 1
          }}
        >
          <Text

            style={[
              {
                flex: 1,
                fontSize: 15,
                fontWeight: "bold",
                color: "#333333",
                textAlignVertical: "center",
                textAlign: "center",
                lineHeight: 15
              }
            ]}
          >
            {item} {"\n\n"}
            {this.state.UserEmailArray[key1]}
          </Text>
          <Button
            style={{ height: 60 }}
            title="Share my favourites"
            color="#2e2e2e"
            onPress={this.AlertFun1.bind(
              this,
              item,
              this.state.UserEmailArray[key1]
            )}
          ></Button>
        </View>
      ))}
    </View>
  );

  render() {
    return (
      <View>
        <ScrollView
          ref={c => {
            this.scroll = c;
          }}
        >
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={1}
            data={this.state.result}
            renderItem={this.renderFood}
            key={Math.random().toString()}
          />
        </ScrollView>
      </View>
    );
  }
}

console.disableYellowBox = true;
export default search_friend;
