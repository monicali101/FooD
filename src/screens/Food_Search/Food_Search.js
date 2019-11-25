/**
 *  We learn the search-tutorial from https://github.com/JenniferChengjr/Comp4920--FooD/blob/Sample/src/screens/Search/SearchScreen.js
 */

import React from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Picker
} from "react-native";

import { SearchBar } from "react-native-elements";
import MenuImage from "../../Button/Img_menu";
import GLOBAL from "../../../globals";
import { StyleSheet } from "react-native";
import update from "immutability-helper";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { updateUser, createUserClick } from "../../graphql/mutations.js";
import { getUser } from "../../graphql/queries.js";

class Food_search extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
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
          onSubmitEditing={event =>
            params.handleSearch(event.nativeEvent.text, true)
          } //text => params.handleSearch(text)}
          placeholder="Search"
          value={params.data}
        />
      ),
      headerRight: (
        <View style={styles.filter}>
          <Text style={styles.filterText}>Diet</Text>
          <Picker
            style={{ height: 40, width: 40 }}
            onValueChange={navigation.getParam("filter")}
          >
            <Picker.Item label=" " value="" />
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
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      result: [],
      value: "",
      data: [],
      number: 10,
      offsetNum: 0,
      button: "",
      buttonColour: "#FFFFFF",
      search: "",
      filter: "",
      filterHeight: -40,
      textColour: "#FFFFFF",
      likedFoods: [],
      likedFoodsSearch: []
    };
  }

  queryString = () => {
    //GET https://api.spoonacular.com/recipes/autocomplete?number=10&query=chick
    let base = "https://api.spoonacular.com/recipes/search?";
    let num = "number=" + this.state.number;
    let offset = "&offset=" + this.state.offsetNum;
    let queryString = "&query=" + this.state.search;
    let diet = "&diet=" + this.state.filter;
    let instr = "&instructionsRequired=true";
    let key = GLOBAL.apiKey;
    let query = base + num + offset + queryString + diet + instr + key;
    console.log(query);
    return query;
  };

  handleSearch = (text, newSearch) => {
    this.fetchUserFavourites();
    let text0 = text.toString();
    
    if (newSearch == true) {
      this.setState(
        {
          button: "Loading...",
          buttonColour: "#FFFFFF",
          textColour: "#000000",
          search: text0,
          result: [],
          offsetNum: 0
        },
        () => {
          this.next(text0);
        }
      );
    } else {
      this.setState(
        {
          button: "Loading...",
          buttonColour: "#FFFFFF",
          textColour: "#000000",
          search: text0,
          result: []
        },
        () => {
          this.next(text0);
        }
      );
    }
  };

  next = text => {
    if (text == "") {
      this.setState({
        value: text,
        data: []
      });
    } else {
      this.scroll.scrollTo({ x: 0, y: 0, animated: true });
      fetch(this.queryString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          //Update name & picture url
          let i = 0;
          let j = 0;
          let name = "";
          let url = "";
          let type = "";
          let foodID = "";
          let numbering = 0;

          this.setState({ result: [] });
          let numResults = responseJson.results.length;
          if (numResults >= 1) {
            //If less than 10 results
            if (numResults < this.state.number) {
              this.setState({
                number: responseJson.results.length
              });
            }
            for (i = 0; i < this.state.number; i++) {
              if (i != 0) {
                numbering = numbering + 1;
              }

              foodID = responseJson.results[i].id.toString();

              let likeIconState = require("../../../assets/icons/heart.png");
              for (j = 0; j < this.state.likedFoods.length; j++) {
                if (this.state.likedFoods[j] == foodID) {
                  likeIconState = require("../../../assets/icons/heartPink.png");
                }
              }

              name = JSON.stringify(responseJson.results[i].title);
              name = name.substring(1, name.length - 1);

              if (responseJson.results[i].imageUrls.length > 0) {
                type = responseJson.results[i].imageUrls[0].toString();
                type = type.substring(type.length - 3, type.length);
              } else {
                type = "jpg";
              }

              url = responseJson.results[i].id.toString();
              url =
                "https://spoonacular.com/recipeImages/" +
                url +
                "-556x370." +
                type;

              this.setState(prevState => ({
                result: [
                  ...prevState.result,
                  {
                    num: numbering,
                    id: foodID,
                    title: name,
                    pictureURL: url,
                    search: text,
                    likeIcon: likeIconState
                  }
                ]
              }));
            }
            console.log("broken", this.state.result);
            this.setState({
              button: "Next page",
              buttonColour: "#2e2e2e",
              textColour: "#FFFFFF"
            });
            //No results returned
          } else {
            this.setState({
              button: "No results",
              buttonColour: "#FFFFFF",
              textColour: "#000000"
            });
          }
        })

        .catch(error => {
          console.error(error);
        });
    }
    this.setState({ offsetNum: this.state.offsetNum + 11 });
  };

  _filter = diet => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    //Ensures that query() is called again after setState (setState is async
    //and does not guarantee state change of 'filter' unless done this way)
    if (diet == "") {
      //pop filter bar back up
      this.setState(
        {
          filter: diet,
          filterHeight: -40,
          buttonColour: "#FFFFFF",
          button: "Loading...",
          textColour: "#000000",
          offsetNum: 0
        },
        () => {
          this.handleSearch(this.state.search);
        }
      );
    } else {
      this.setState(
        {
          filter: diet,
          filterHeight: 0,
          buttonColour: "#FFFFFF",
          button: "Loading...",
          textColour: "#000000",
          offsetNum: 0
        },
        () => {
          this.handleSearch(this.state.search);
        }
      );
    }
  };

  ////////////////////////AWS Stuff////////////////////////

  updateFavourites = () => {
    var myArray = this.state.likedFoodsSearch;
    for (var item in this.state.likedFoodsSearch) {
      myArray[item] = this.state.likedFoodsSearch[item];
    }
    console.log("received favourite: ", myArray);

    //remove "<empty>" default value
    for (i = 0; i < myArray.length; i++) {
      if ((myArray[i] == "<empty>")) {
        myArray.splice(i, 1);
      }
    }

    var cognitoUser = Auth.currentUserInfo()
      .then(user => {
        console.log("user: ", user);
        var record = {
          id: user.attributes.sub,
          favouriteSearch: myArray
        };

        var newUser = API.graphql(
          graphqlOperation(updateUser, { input: record })
        ).then(response => {
          console.log("updated record: ", response);
        });
      })

      .catch(err => console.log(err));
  };

  fetchUserFavourites() {
    var cognitoUser = Auth.currentUserInfo().then(user => {
      this.setState({
        userId: user.attributes.sub
      });
      console.log("Getting favourites for userId: ", this.state.userId);

      var fetchedFavourites = API.graphql(
        graphqlOperation(getUser, { id: this.state.userId })
      ).then(response => {
        console.log(
          "favouriteSearch: ",
          response.data.getUser["favouriteSearch"]
        );
        let Fav2 = response.data.getUser["favouriteSearch"].concat();
        let Fav = response.data.getUser["favourites"].concat();
        if (Fav[0] == "<empty>") {
          Fav = [];
        }

        if (Fav2[0] == "<empty>") {
          Fav2 = [];
        }

        let finalFav = Fav.concat(Fav2);
        this.setState({
          likedFoods: finalFav,
          likedFoodsSearch: Fav2
        });

        return fetchedFavourites;
      });
    });
  }

  componentDidMount() {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    const { navigation } = this.props;
    navigation.setParams({
      handleSearch: this.handleSearch,
      data: this.getValue,
      filter: this._filter
    });
    this.fetchUserFavourites();
  }

  getValue = () => {
    return this.state.value;
  };

  ////////////////////////Functions accessed by render////////////////////////

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

  changeLike = (id, num) => {
    let likeList = this.state.likedFoodsSearch;
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
        likedFoodsSearch: likeList
      });
    } else {
      this.setState({
        result: update(this.state.result, {
          [num]: {
            likeIcon: { $set: require("../../../assets/icons/heart.png") }
          }
        }),
        likedFoodsSearch: likeList
      });
    }
    console.log("Liked food array: ", this.state.likedFoodsSearch);
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
          style={styles.scrollView}
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
              key={Math.random().toString()}
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
            onPress={this.next}
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

console.disableYellowBox = true;
export default Food_search;
const styles = StyleSheet.create({
  foodView: {
    flex: 1,
    height: 313,
    width: 340,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cccccc",
    borderWidth: 0.5,
    borderRadius: 20,
    margin: 10
  },

  foodPhoto: {
    height: 215,
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 20,
    shadowColor: "blue",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1.0,
    shadowRadius: 5
  },

  foodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
    textAlignVertical: "center",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 14
  },

  view: {
    backgroundColor: "white",
    justifyContent: "space-between",
    flexWrap: "wrap-reverse"
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF"
  },

  filterText: {
    paddingTop: 9,
    fontSize: 16,
    color: "#404040",
    height: 35,
    paddingTop: 6
  },

  filterBox: {
    color: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center", //Horizontally
    alignItems: "center", //Vertically,
    height: 20
  },

  filter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 4
  },

  filterIcon: {
    height: 20,
    width: 20
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
