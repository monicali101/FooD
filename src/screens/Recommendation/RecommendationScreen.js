import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Picker
} from "react-native";

import Img_menu from "../../Button/Img_menu";
import GLOBAL from "../../../globals";
import update from "immutability-helper";

import { Auth, API, graphqlOperation } from "aws-amplify";
import { updateUser, createUserClick } from "../../graphql/mutations.js";
import { createUser } from "../../graphql/mutations";
import { getUser } from "../../graphql/queries.js";
import { StyleSheet } from "react-native";

export default class RecommendationScreen extends Component {
  //was categories

  static navigationOptions = ({ navigation }) => ({
    title: "Home",
    headerLeft: (
      <Img_menu
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
    headerRight: (
      <View style={styles.filter}>
        <Text style={styles.filterText}>Diet</Text>
        <Picker
          style={{ height: 40, width: 40 }}
          onValueChange={navigation.getParam("filter")}
        >
          <Picker.Item label="" value="" />
          <Picker.Item label="None" value="" />
          <Picker.Item label="Gluten Free" value="GlutenFree" />
          <Picker.Item label="Ketogenic" value="Ketogenic" />
          <Picker.Item label="Vegetarian" value="Vegetarian" />
          <Picker.Item label="Vegan" value="Vegan" />
          <Picker.Item label="Pescetarian" value="Pescetarian" />
          <Picker.Item label="Paleo" value="Paleo" />
          <Picker.Item label="Whole30" value="Whole30" />
        </Picker>
      </View>
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
      number: 10,
      button: "Loading...",
      buttonColour: "#FFFFFF",
      filter: "None",
      userId: null, //default to null
      userPref: [],
      filter: "",
      filterHeight: -40,
      textColour: "#000000",
      offsetNum: 0,
      prefLoaded: false,
      likedFoods: []
    };
  }

  queryString = () => {
    let base =
      "https://api.spoonacular.com/recipes/complexSearch/?instructionsRequired=true&cuisine=";

    //let cuisine = "mexican";

    console.log("----- Calling queryString ----> ");

    let cuisine = this.state.userPref;
    let i = 0;
    let cuisineString = "";
    for (i = 0; i < cuisine.length; i++) {
      cuisineString = cuisineString + cuisine[i] + ",";
    }
    let results = "&number=" + this.state.number;
    let offset = "&offset=" + this.state.offsetNum;
    let diet = "&diet=" + this.state.filter;
    let key = GLOBAL.apiKey;
    let query = base + cuisineString + results + offset + diet + key;
    console.log("---- Response from Spoon API query --->");
    console.log(query);
    return query;
  };

  query = () => {
    console.log("adfadfadf", this.state.likedFoods);
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    //https://api.spoonacular.com/recipes/complexSearch/?query=pasta&maxFat=25&number=2&apiKey=41bb3ae188994435afba430de732b502
    fetch(this.queryString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        //Name

        let i = 0;
        let j = 0;

        let name = "";
        let url = "";
        let foodID = "";
        let numbering = 0;
        let likeIconState = "";

        this.setState({ result: [], cuisines: [], newResult: [] });

        for (i = 0; i < this.state.number; i++) {
          if (i != 0) {
            numbering = numbering + 1;
          }
          foodID = responseJson.results[i].id.toString();

          likeIconState = require("../../../assets/icons/heart.png");
          for (j = 0; j < this.state.likedFoods.length; j++) {
            if (this.state.likedFoods[j] == foodID) {
              likeIconState = require("../../../assets/icons/heartPink.png");
            }
          }

          name = JSON.stringify(responseJson.results[i].title);
          name = name.substring(1, name.length - 1);

          url = responseJson.results[i].id.toString();
          url =
            "https://spoonacular.com/recipeImages/" +
            url +
            "-480x360." +
            responseJson.results[i].imageType;

          this.setState(prevState => ({
            result: [
              ...prevState.result,
              {
                num: numbering,
                id: foodID,
                diet: this.state.filter,
                title: name,
                pictureURL: url,
                likeIcon: likeIconState
              }
            ]
          }));
        }
        this.setState(prevState => ({
          button: "Next page",
          buttonColour: "#2e2e2e",
          textColour: "#FFFFFF",
          offsetNum: this.state.offsetNum + 10
        }));
        console.log("aAAAAAAAAAAAAAAAA", this.state.result);
        //this.queryCuisine();
      })

      .catch(error => {
        console.error(error);
      });
  };

  _filter = diet => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    //Ensures that query() is called again after setState (setState is async
    //and does not guarantee state change of 'filter' unless done this way)
    if (diet == "") {
      //pop filter bar back up
      this.setState(
        {
          result: [],
          newResult: [],
          cuisines: [],
          filter: diet,
          filterHeight: -40,
          buttonColour: "#FFFFFF",
          button: "Loading...",
          textColour: "#000000"
        },
        () => {
          this.query();
        }
      );
    } else {
      this.setState(
        {
          result: [],
          newResult: [],
          cuisines: [],
          filter: diet,
          filterHeight: 0,
          buttonColour: "#FFFFFF",
          button: "Loading...",
          textColour: "#000000"
        },
        () => {
          this.query();
        }
      );
    }
  };

  ////////////////////////AWS Stuff////////////////////////

  updateFavourites = () => {
    var myArray = this.state.likedFoods;
    for (var item in this.state.likedFoods) {
      myArray[item] = this.state.likedFoods[item];
    }
    console.log("received favourite: ", myArray);

    //remove "<empty>" default value
    for (i = 0; i < myArray.length; i++) {
      if (myArray[i] == "<empty>") {
        myArray.splice(i, 1);
      }
    }

    var cognitoUser = Auth.currentUserInfo()
      .then(user => {
        console.log("user: ", user);
        var record = {
          id: user.attributes.sub,
          favourites: myArray
        };

        var newUser = API.graphql(
          graphqlOperation(updateUser, { input: record })
        ).then(response => {
          console.log("updated record: ", response);
        });
      })

      .catch(err => console.log(err));
  };

  createUser() {
    var cognitoUser = Auth.currentUserInfo().then(user => {
      this.setState({
        userId: user.attributes.sub
      });

      API.graphql(graphqlOperation(getUser, { id: user.attributes.sub })).then(
        response => {
          if (response.data.getUser == null) {
            //first time user
            var record = {
              id: user.attributes.sub,
              username: user.username,
              favourites: ["<empty>"],
              favouriteSearch: ["<empty>"],
              preferences: ["<empty>"],
              email: user.attributes.email,
              firstName: "<empty>",
              lastName: "<empty>",
              profilePic: "<empty>",
              myFriendEmails: ["<empty>"],
              myFriendUsernames: ["<empty>"],
              myFriendId: ["<empty>"],
              recommendDishes: ["empty"]
            };

            var newUser = API.graphql(
              graphqlOperation(createUser, { input: record })
            ).then(response =>
              console.log(
                "------ create user record response ------> ",
                response
              )
            );
            this.props.navigation.navigate("PreferencesNew");
            this.forceUpdate();
          } else {
            // not first time, don't create user record
            console.log("--------Not first time user ---------->");
            //this.props.navigation.navigate("Recommendation");
          }
        }
      );
    });

    return cognitoUser; //return a promise
  }

  fetchUserPref() {
    console.log("Getting preferences for userId: ", this.state.userId);

    var userPref = API.graphql(
      graphqlOperation(getUser, { id: this.state.userId })
    ).then(response => {
      console.log("userPref: ", response.data.getUser["preferences"]);
      this.setState({
        userPref: response.data.getUser["preferences"],
        likedFoods: response.data.getUser["favourites"]
      });
    });

    return userPref;
  }

  componentWillMount = () => {
    console.log(this.state.filter);
  };

  componentDidMount(prevState) {
    this.props.navigation.setParams({ filter: this._filter });

    //match sure API is called again when returned from Preferences survey
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.createUser()
        .then(response => {
          this.fetchUserPref()
            .then(userPref => {
              if (this.state.prefLoaded == false) {
                this.setState({ prefLoaded: true });
                this.query();
              }
            })
            .then(() => {
              this.setState({ loading: false });
            });
        })
        .catch(err => console.log(err));
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

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

  ////////////////////////Functions accessed by render////////////////////////

  goToTop = () => {
    this.setState(
      {
        result: [],
        newResult: [],
        cuisines: [],
        button: "Loading...",
        textColour: "#000000",
        buttonColour: "#FFFFFF"
      },
      () => {
        this.query();
      }
    );
  };

  changeLike = (id, num) => {
    let likeList = this.state.likedFoods;
    let i = 0;
    let found = false;

    //remove if they undoing the like
    for (i = 0; i < likeList.length; i++) {
      if (id == likeList[i]) {
        likeList.splice(i, 1);
        found = true;
      }
    }
    //add if liking
    if (found == false) {
      likeList.push(id);
    }

    if (
      this.state.result[num].likeIcon ==
      require("../../../assets/icons/heart.png")
    ) {
      this.setState({
        result: update(this.state.result, {
          [num]: {
            likeIcon: { $set: require("../../../assets/icons/heartPink.png") }
          }
        }),
        likedFoods: likeList
      });
    } else {
      this.setState({
        result: update(this.state.result, {
          [num]: {
            likeIcon: { $set: require("../../../assets/icons/heart.png") }
          }
        }),
        likedFoods: likeList
      });
    }
    console.log("Liked food array: ", this.state.likedFoods);
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
          onPress={() => this.changeLike(item.id, item.num)}
        >
          <Image style={styles.icon} source={item.likeIcon} />
        </TouchableHighlight>
        <Text style={styles.spacing}> </Text>
      </View>
    </TouchableHighlight>
  );

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <View>
          <Text>Fetching dishes based on your preferences...</Text>
        </View>
      );
    }

    return (
      <View>
        <View
          style={{
            color: "#FFFFFF",
            flexDirection: "row",
            justifyContent: "center", //Horizontally
            alignItems: "center", //Vertically,
            marginTop: this.state.filterHeight
          }}
        >
          <Image
            style={styles.filterIcon}
            source={require("../../../assets/icons/filter.png")}
          />
          <Text style={styles.filterText}> {this.state.filter}</Text>
        </View>
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
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center", //Horizontally
              alignItems: "stretch",
              paddingTop: 13,
              width: "100%",
              height: 90 + this.state.filterHeight,
              backgroundColor: this.state.buttonColour
            }}
            onPress={this.goToTop}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: this.state.textColour
              }}
            >
              {this.state.button}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    backgroundColor: "#FFFFFF",
    width: 100,
    height: 30,
    paddingBottom: 60,
    paddingTop: 30,
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically
  },

  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    flexDirection: "row",
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

  filterBox: {
    color: "#FFFFFF",
    flexDirection: "column",
    flexDirection: "row",
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically
  },

  filter: {
    flexDirection: "column",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    justifyContent: "center", //Horizontally
    alignItems: "center" //Vertically
  },

  filterIcon: {
    flexDirection: "column",
    height: 20,
    width: 20,
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

//Function not in use
queryCuisine = () => {
  let i = 0;
  console.log("what even");
  let key = GLOBAL.apiKey;
  for (i = 0; i < this.state.number; i++) {
    let query2 =
      "https://api.spoonacular.com/recipes/" +
      this.state.result[i].id +
      "/information?" +
      key;
    console.log(query2);
    let cuis = "";
    fetch(query2, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response2 => response2.json())
      .then(responseJson2 => {
        if (responseJson2.cuisines.length > 0) {
          let j = 0;
          for (j = 0; j < responseJson2.cuisines.length; j++) {
            cuis = responseJson2.cuisines[j] + " " + cuis;
          }
          this.setState(prevState => ({
            cuisines: [...prevState.cuisines, cuis],
            newResult: this.state.result,
            button: "Next page",
            buttonColour: "#2e2e2e",
            textColour: "#FFFFFF",
            offsetNum: this.state.offsetNum + 10
          }));
          console.log(this.state.cuisines);
        }
      })
      .catch(error => {
        console.error(error);
      });

    let j = 0;
    for (j = 0; j < 999999; j++) {
      let i = 0;
    }
  }
};
