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
import update from "immutability-helper";
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
      ingredientsButtonColour: "#f5f5f5",
      ingredientsButtonTextColour: "#8f8f8f"
    };
  }


  listCategories = () => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    let buttonColourArray = [];
    let buttonTextColourArray = [];
    let categories = ["Dairy", "Vegetable", "Fruits", "Baking & Grains", "Sweeteners", "Spices", "Meats", 
    "Fish", "Seafood", "Condiments", "Oils", "Seasoning", "Sauces", "Legumes", "Alcohol",
    "Nuts", "Dairy Alternatives", "Desserts & Snacks", "Beverages"];

    for (i = 0; i < 19; i++) {
      let categoryName = categories[i];
      let ingredientsList = ["blahhh"];
      if (i == 0) {
        ingredientsList = ["butter", "egg", "milk", "parmesan", "cheddar", "american cheese", "sour cream", 
                           "cream cheese", "mozarella", "yogurt ", "cream ", "feta", "whipped cream", "condensed milk",
                           "cottage cheese", "ice cream", "swiss cheese", "buttermilk", "ricotta", "provolone",
                           "italian cheese", "soft cheese", "gouda", "romano", "brie", "ghee", "creme fraiche",
                           "custard", "hard cheese", "mascarpone", "gloucester cheese"];
      } else if (i == 1) {
        ingredientsList = ["onion", "garlic", "tomato", "potato", "carrot", "bell pepper", "broccoli", "corn", "spinach",
                           "mushroom", "green beans", "ginger", "chili pepper", "celery", "rosemary", "red onion", 
                           "cucumber", "sweet potato", "pickle", "avocado", "zucchini", "cilantro", "olive", "asparagus",
                           "cabbage", "cauliflower", "dill", "kale", "pumpkin", "squash", "mint", "scallion", "shallot",
                           "sun dried tomato", "eggplant", "beet", "horseradish", "butternup squash", "leek", "caper",
                           "brussels sprout", "artichoke heart", "artichoke", " kimchi", "chia seeds", "radish", 
                           "sauerkraut", "sweet pepper", "arugula", "capsicum", "bok choy", "parsnip", "okra", "yam",
                           "fennel", "turnip", "snow peas", "bean sprouts", "seaweed", "chard", "collard", "pimiento",
                           "watercress", "tomatillo", "grape leaves", "rocket", "mustard greens", "bamboo shoot",
                           "canned tomato", "rutabaga", "endive", "broccoli rabe", "jicama", "kohlrabi", "hearts of palm",
                           "butternut", "celery root", "daikon", "radicchio", "porcini", "chinese broccoli", "cress",
                           "jerusalem artichoke", " water chestnut", "dulse", "micro greens", "burdock", "chayote",
                           "mixed vegetables", "portobello mushroom"];
      } else if (i == 2) {
        ingredientsList = ["lemon", "apple", "banana", "lime", "strawberry", "orange", "pineapple", "blueberry",
                           "raisin", "coconut", "grape", "peach", "raspberry", "cranberry", "mango", "pear", "blackberry", 
                           "cherry", "date", "watermelon", "berries", "kiwi", "grapefruit", "mandarin", "craisins", 
                           "cantaloupe", "plum", "apricot", "clementine", "prunes", "apple butter", "pomegranate", 
                           "nectarine", "fig", "tangerine", "papya", "rhubarb", "saltanas", "plantain", "currant", 
                           "passion fruit", "guava", "persimmons", "lychee", "lingonberry", "tangelos", "kumquat", 
                           "boysenberry", "star fruit", "durian", "quince", "honeydew", "crabapples",];
      } else if (i==3) {
        ingredientsList = ["rice", "pasta", "flour", "bread", "baking powder", "baking soda", "bread crumbs", 
                           "cornstarch", "cocoa", "wild rice", "rolled oats", "noodle", "rice noodles", "flour tortillas",
                           "pancake mix", "yeast", "cracker", "quinoa", "brown rice", "cornmeal", "self rising flour",
                           "saltines", "popcorn", "corn tortillas", "ramen", "cereal", "biscuits", "couscous",
                           "pie crust", "pie crust", "chips", "coconut flake", "bread flour", "croutons", "lasagne",
                           "pizza dough", "bagel", "puff pastry", "barley", "bun", "multigrain bread", "potato flakes",
                           "pretzel", "cornbread", "cornflour", "crescent roll dough", "cream of wheat", "coconut flour",
                           "pita", "risotto", "bicarbonate soda", "ravioli", "wheat", "rice flour", "polenta", 
                           "baguette", "gnocchi", "vermicelli", "semolina", "wheat germ", "buckwheat", "croissants",
                           "bread dough", "filo dough", "yeast flake", "pierogi", "matzo meal", "rye", "tapioca flour",
                           "shortcrust pastry", "potato starch", "breadsticks", "ciabatta", "spelt", "tapioca starch",
                           "starch", "whole wheat flour", "gram flour", "sourdough starter", "wafer", "bran", "challah",
                           "malt extract", "sorghum flour"];
      } else if (i==4) {
        ingredientsList = ["sugar", "brown sugar", "honey", "confectioners sugar", "maple syrup", "corn syrup", 
                           "molasses", "artificial sweetener", "agave nectar", "coconut sugar"];
      } else if (i==5) {
        ingredientsList = ["cinnamon", "vanilla", "garlic powder", "paprika", "oregano", "chili powder", "cumin", 
                           "red pepper flake", "cayenne", "italian seasoning", "thyme", "onion powder", "nutmeg",
                           "ground nutmeg", "curry powder", "bay leaf", "taco seasoning", "sage", "clove", "allspice",
                           "turmeric", "sumac", "chive", "peppercorn", "ground coriander", "cajun", "coriander",
                           "celery salt", "vanilla essence", "herbs", "steak seasoning", "pultry seasoning", "cardamom",
                           "chile powder", "italian herbs", "tarragon", "garam masala", "marjoram", "mustard seed",
                           "celery seed", "chinese five spice", "italian spice", "saffron", "onion flake", "chipotle",
                           "herbes de provence", "dill seed", "fennel seed", "caraway", "cacao", "star anise", "savory",
                           "chili paste", "tamarind", "aniseed", "fenugreek", "lavendar", "old bay seasoning", "lemon balm",];
      } else {
        ingredientsList = ["blah"];
      }

      for (j = 0; j<ingredientsList.length; j++) {
        buttonColourArray[j] = "#f5f5f5";  //default button not selected
        buttonTextColourArray[j] = "#8f8f8f";
      }

      this.setState(prevState => ({
        list: [
          ...prevState.list,
          {
            category: categoryName,
            ingredients: ingredientsList,
            buttonColour: buttonColourArray,
            buttonTextColour: buttonTextColourArray
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

  toggle = (item, indexIngr, indexCat) => {
    let ingredient = item;
    let categoryIndex = indexCat;
    let ingredientIndex = indexIngr;

    //Update button colour
    if (this.state.list[categoryIndex].buttonColour[ingredientIndex] == "#94d881") { //green
      console.log("is green change to white");
      this.setState({
        list: update(this.state.list, {
          [categoryIndex]: { 
            buttonColour:  {
              [ingredientIndex]: { $set: "#f5f5f5" },
            },
            buttonTextColour:  {
              [ingredientIndex]: { $set: "#8f8f8f" },
            }
          }
        }),
      });
    } else {
      console.log("is white change to green");
      this.setState({
        list: update(this.state.list, {
          [categoryIndex]: {
            buttonColour:  {
              [ingredientIndex]: { $set: "#94d881" },
            },
            buttonTextColour:  {
              [ingredientIndex]: { $set: "#ffffff" },
            }
            //buttonColour: { $set: "#94d881" },
            //buttonTextColour: { $set: "#ffffff" }
          }
        }),
      });
    }

    //console.log(ingredientsArray.findIndex(index));
    // if (this.state.ingredientsButtonColour == "#94d881") { //green. if selected, unselect
    //   this.setState({
    //     ingredientsButtonColour: update(this.state.ingredientsButtonColour, { $set: "#f5f5f5" }), // light grey
    //     ingredientsButtonTextColour: update(this.state.ingredientsButtonTextColour, { $set: "#8f8f8f" }), //dark grey
    //   });
    // } else  { //select
    //   this.setState({
    //     ingredientsButtonColour: update(this.state.ingredientsButtonColour, { $set: "#94d881" }), //green
    //     ingredientsButtonTextColour: update(this.state.ingredientsButtonTextColour, { $set: "#ffffff" }), //white
    //   });
    // }
    console.log("Button colour ", this.state.list[categoryIndex].buttonColour[ingredientIndex]);
    this.updateList();
  };

  updateList = () => {
    var colour = this.state.ingredientsButtonColour;
  }

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



  renderCategories = (item, indexCat) => (

    <View style={styles.categoryView}>
      <Text style={styles.categoryName}>{item.category}</Text>
      <Text style={styles.spacing}> </Text>
      <FlatList
          columnWrapperStyle={{              
            marginLeft: 15, 
            marginRight: 15,
            alignItems: "center", //Vertically,
            flexWrap: "wrap"
          }}
          numColumns={95}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          data={item.ingredients}
          //tells flatlist to listen to state change for ingredientsButtonColour
          extraData={this.state.list}
          renderItem={({item, index}) => this.renderIngredients(item, index, indexCat)}
      />
    </View>
  );

  renderIngredients = (item, indexIngr, indexCat) => (
    <TouchableHighlight
      style={{
        alignItems: "center",
        backgroundColor: this.state.list[indexCat].buttonColour[indexIngr],
        padding: 8,
        borderRadius: 6,
        margin: 5,
      }}
      underlayColor="#FFFFFF"
      onPress={() => {this.toggle(item, indexIngr, indexCat)}}
    >
    <Text style = {{color: this.state.list[indexCat].buttonTextColour[indexIngr]}}>{item}</Text>

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

              alignItems: "center", //Vertically,
              flexWrap: "wrap"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "left",
                lineHeight: 30,
                marginTop: 20,
                marginBottom: 20,
                marginLeft: 15,
              }}
            >
              Select the ingredients you have, and we'll find meals you can cook!
            </Text>

            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              numColumns={1}
              data={this.state.list}
              //tells flatlist to listen to state change for ingredientsButtonColour
              extraData={this.state.list}
              renderItem={({item, index}) => this.renderCategories(item, index)}
            />
          </View>

        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  ingredients: {
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    margin: 6,
  },
  categoryView: {
    flexDirection: "column",
    flex: 1,
    //height: 313,
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
