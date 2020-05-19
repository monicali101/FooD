import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  FlatList,
  ActivityIndicator
} from "react-native";

import Img_menu from "../Button/Img_menu";
import GLOBAL from "../../globals";

import { getUser } from "../graphql/queries.js";
import { updateUser, createUserClick } from "../graphql/mutations.js";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { StyleSheet } from "react-native";

export default class SimpleCookScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Simple Cook",
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
      list: [],
    };
  }


  listCategories = () => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    let categories = ["Dairy", "Vegetable", "Fruits", "Baking & Grains", "Sweeteners", "Spices", "Meats", 
    "Fish", "Seafood", "Condiments", "Oils", "Seasoning", "Sauces", "Legumes", "Alcohol",
    "Nuts", "Dairy Alternatives", "Desserts & Snacks", "Beverages"];

    for (i = 0; i < 19; i++) {
      let categoryName = categories[i];
      let ingredientsList = ["blahhh"];
      if (i == 0) {
        ingredientsList = ["butter", "egg", "milk", "parmesan", "butter", "egg", "milk", "parmesan", "butter", "egg ", "milk ", "parmesan "];
      } else if (i == 1) {
        ingredientsList = ["onion ", "garlic ", "tomato ", "potato "];
      } else {
        ingredientsList = ["blah"];
      }

      this.setState(prevState => ({
        list: [
          ...prevState.list,
          {
            category: categoryName,
            ingredients: ingredientsList,
          }
        ]
      }));
    }
  };

  componentDidMount = () => {
    //match sure API is called again when returned from Preferences survey
    this.listCategories();
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

  onPressCategory = item => {
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

  renderCategories = ({ item }) => (

    <View style={styles.categoryView}>
      <Text style={styles.categoryName}>{item.category}</Text>
      <FlatList
          numColumns={5}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          data={item.ingredients}
          renderItem={this.renderIngredients}
      />
    </View>
  );

  renderIngredients = ({ item }) => (
    <TouchableHighlight
      style={styles.ingredients}
      underlayColor="#FFFFFF"
      onPress={() => this.onPressFood(item)}
    >
        <Text>{item}</Text>

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
            <Text
              style={{
                fontSize: 18,
                textAlign: "left",
                lineHeight: 30,
                marginTop: 20,
                marginBottom: 20,
                marginLeft: 15
              }}
            >
              Select the ingredients you have, and we'll find meals you can cook!
            </Text>

            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              numColumns={1}
              data={this.state.list}
              renderItem={this.renderCategories}
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
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  ingredients: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 8,
    borderColor: "#cccccc",
    borderWidth: 1.5,
    borderRadius: 10,
    margin: 6,
  },
  categoryView: {
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

  categoryName: {
    flexDirection: "column",
    flex: 1,
    fontSize: 16,
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
