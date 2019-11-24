import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  FlatList
} from "react-native";

import Img_menu from "../Button/Img_menu";
import GLOBAL from "../../globals";

import { getUser } from "../graphql/queries.js";
import { updateUser, createUserClick } from "../graphql/mutations.js";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { StyleSheet } from "react-native";

export default class LikedFoods extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Favourites",
    headerLeft: (
      <Img_menu
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      result: [],
      newResult: [],
      value: "",
      data: [],
      cuisines: [],
      numberLiked: 4,
      likedFoods: [],
      fav: [],
      favSearch: [],
      fontColour: "#FFFFFF",
      prefLoaded: false
    };
  }

  queryString = id => {
    //https://api.spoonacular.com/recipes/716429/information?includeNutrition=false
    let baseStart = "https://api.spoonacular.com/recipes/";
    let baseEnd = "/information?includeNutrition=false";

    console.log("----- Calling queryString ----> ");

    let foodID = this.state.likedFoods[id];
    let key = GLOBAL.apiKey;
    let query = baseStart + foodID + baseEnd + key;
    console.log("---- Response from Spoon API query --->");
    console.log(query);
    return query;
  };

  query = () => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    let i = 0;
    this.setState({ result: [] });
    if ((this.state.likedFoods.length < 1) || (this.state.likedFoods[0] == "<empty>")) {
      this.setState({ fontColour: "#000000" });
    } else {
      for (i = 0; i < this.state.likedFoods.length; i++) {
        //iterate and pass index of liked list to queryString()
        fetch(this.queryString(i), {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(responseJson => {
            //Name

            let name = "";
            let url = "";
            let foodID = "";
            let type = "";
            console.log("error here", responseJson)
            foodID = JSON.stringify(responseJson.id);

            name = JSON.stringify(responseJson.title);
            name = name.substring(1, name.length - 1);



            if (responseJson.image != null) {
              type = responseJson.image.toString();
              type = type.substring(type.length - 3, type.length);
            } else {
              type = "jpg";
            }

            url = "https://spoonacular.com/recipeImages/" + foodID + "-480x360." + type;

            this.setState(prevState => ({
              result: [
                ...prevState.result,
                {
                  id: foodID,
                  title: name,
                  pictureURL: url,
                  likeIcon: require("../../assets/icons/delete.png")
                }
              ]
            }));
            console.log("aAAAAAAAAAAAAAAAA", this.state.result);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  componentDidMount = () => {
    //match sure API is called again when returned from Preferences survey
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.createUser()
        .then(response => {
          this.fetchUserLikes().then(userPref => {
            this.query();
          });
        })
        .catch(err => console.log(err));
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  createUser() {
    var cognitoUser = Auth.currentUserInfo().then(user => {
      this.setState({
        userId: user.attributes.sub
      });

      API.graphql(graphqlOperation(getUser, { id: user.attributes.sub })).then(
        response => {
          // not first time, don't create user record
          console.log("--------Not first time user ---------->");
        }
      );
    });

    return cognitoUser; //return a promise
  }

  fetchUserLikes() {
    console.log("Getting preferences for userId: ", this.state.userId);

    var userPref = API.graphql(
      graphqlOperation(getUser, { id: this.state.userId })
    ).then(response => {
      //Remove duplicates
      let Fav = response.data.getUser["favourites"].concat();
      let Fav2 = response.data.getUser["favouriteSearch"].concat();
      console.log("favouritesSearch: ", Fav2);
      console.log("favourites: ", Fav);
      //Concatenate the two arrays
      if (Fav[0] == "<empty>") {
        Fav = [];
      }

      if (Fav2[0] == "<empty>") {
        Fav2 = [];
      }

      let finalFav = Fav.concat(Fav2);
      let i, j = 0;
      for (i = 0; i < finalFav.length; ++i) {
        for (j = i + 1; j < finalFav.length; ++j) {
          if (finalFav[i] === finalFav[j]) {
            finalFav.splice(j--, 1);
          }
        }
      }
      console.log("concat favs ", finalFav);
      this.setState({
        likedFoods: finalFav,
        fav: Fav,
        favSearch: Fav2
      });
    });

    return userPref;
  }

  updateFavourites = () => {
    var myArray = this.state.fav;
    for (var item in this.state.fav) {
      myArray[item] = this.state.fav[item];
    }
    var myArray2 = this.state.favSearch;
    for (var item in this.state.favSearch) {
      myArray2[item] = this.state.favSearch[item];
    }

    var cognitoUser = Auth.currentUserInfo()
      .then(user => {
        console.log("user: ", user);
        var record = {
          id: user.attributes.sub,
          favourites: myArray,
          favouriteSearch: myArray2
        };

        console.log("-----updated user record ----> ", record);

        var newUser = API.graphql(
          graphqlOperation(updateUser, { input: record })
        ).then(response => {
          console.log("updated record: ", response);
        });
      })

      .catch(err => console.log(err));
    this.query();
  };

  onPressFood = item => {
    this.saveUserClick(item).then(() => {
      this.props.navigation.navigate("Recipe", { item });
    });
  };

  //////////////////////// Save clicks to AWS ///////////////////////////////
  saveUserClick(item) {
    console.log("Pressed item: ", item);
    var record = {
      dishName: item.title,
      dishId: item.id
    };

    var savedClick = API.graphql(
      graphqlOperation(createUserClick, { input: record })
    );

    return savedClick;
  }

  ////////////////////////Change Like ////////////////////////

  changeLike = id => {
    let i = 0;
    let likesShown = this.state.likedFoods;
    let likeList = this.state.fav;
    let likeListSearch = this.state.favSearch;
    //Match user tap with proper food (fetch returns out of order)
    //Remove ID from list of liked foods
    for (i = 0; i < this.state.likedFoods.length; i++) {
      if (this.state.likedFoods[i] == id) {
        likesShown.splice(i, 1);
        break;
      }
    }

    //remove from fav array if deleting
    for (i = 0; i < this.state.fav.length; i++) {
      if (this.state.fav[i] == id) {
        likeList.splice(i, 1);
        break;
      }
    }
    //remove from favSearch array if deleting
    for (i = 0; i < this.state.favSearch.length; i++) {
      if (this.state.favSearch[i] == id) {
        likeListSearch.splice(i, 1);
        break;
      }
    }

    this.setState({ likedFoods: likesShown, fav: likeList, favSearch: likeListSearch });
    this.updateFavourites();
  };

  renderFood = ({ item }) => (
    <TouchableHighlight
      underlayColor="#FFFFFF"
      onPress={() => this.onPressFood(item)}
    >
      <View style={styles.foodView}>
        <Image style={styles.foodPhoto} source={{ uri: item.pictureURL }} />
        <Text style={styles.foodName}>{item.title}</Text>
        <Text style={styles.spacing}> </Text>
        <TouchableHighlight
          style={styles.iconPressArea}
          underlayColor="#FFFFFF"
          onPress={() => this.changeLike(item.id)}
        >
          <Image style={styles.icon} source={item.likeIcon} />
        </TouchableHighlight>
        <Text style={styles.spacing}> </Text>
      </View>
    </TouchableHighlight>
  );

  render() {
    return (
      <ScrollView
        ref={c => {
          this.scroll = c;
        }}
      >
        <View
          style={{
            alignItems: "center" //Vertically,
          }}
        >
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={1}
            data={this.state.result}
            renderItem={this.renderFood}
          />
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            paddingBottom: 20,
            paddingTop: 20,
            color: this.state.fontColour,
            textAlign: "center"
          }}
        >
          No foods saved in Favourites :(
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: this.state.fontColour,
            textAlign: "center"
          }}
        >
          Not to worry! You can add them through Home or Search.
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  foodView: {
    flexDirection: "column",
    flex: 1,
    height: 313,
    width: 340,
    borderColor: "#cccccc",
    borderWidth: 0.5,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically
  },

  foodPhoto: {
    flexDirection: "column",
    justifyContent: "center", //Horizontally
    alignItems: "center", //Vertically
    height: 215,
    width: "100%",

    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "blue",
    shadowOffset: {
      height: 3,
      width: 0
    },
    shadowOpacity: 1.0,
    shadowRadius: 5
  },

  foodName: {
    flexDirection: "column",
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 14
  },

  foodCategory: {
    flexDirection: "column",
    marginTop: 1,
    marginBottom: 1
  },

  button: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: 100,
    height: 30,
    paddingBottom: 60,
    paddingTop: 30,
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically
  },

  filterText: {
    flexDirection: "column",
    paddingTop: 9,
    fontSize: 16,
    color: "#404040",
    height: 35,
    paddingTop: 6,
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically
  },

  icon: {
    flexDirection: "column",
    height: 25,
    width: 25,
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically,
  },

  iconPressArea: {
    flexDirection: "column",
    height: 25,
    width: 55,
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically,
  },

  spacing: {
    fontSize: 5,
    fontWeight: "bold",
    color: "#000000",
    flexDirection: "row",
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically
  }
});
