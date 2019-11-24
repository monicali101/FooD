/**
 *  We learn the search-tutorial from https://github.com/JenniferChengjr/Comp4920--FooD/blob/Sample/src/screens/Search/SearchScreen.js
 */
import React from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Picker,
} from 'react-native';

import { SearchBar } from 'react-native-elements';
import MenuImage from '../../Button/Img_menu';
import GLOBAL from '../../../globals';
import update from 'immutability-helper';

import { StyleSheet } from 'react-native';

class Food_search2 extends React.Component {

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
            backgroundColor: 'transparent',
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
          }}
          inputContainerStyle={{
            backgroundColor: '#EDEDED',
          }}
          inputStyle={{
            width: "85%",
            color: 'black',
            backgroundColor: '#EDEDED',
            borderRadius: 10,
            justifyContent: 'center',
          }}
          searchIcond
          round
          onFocus={(event) => (params.handleSearch())}//text => params.handleSearch(text)}
          placeholder="Search"
          value={params.data}
        />
      ),
      headerRight: (
        <View style={styles.filter}>
          <Text style={styles.filterText}>Diet</Text>
          <Picker
            style={{ height: 40, width: 40 }}
            onValueChange={navigation.getParam('filter')}>
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
      value: '',
      data: [],
      number: 10,
      counter: 0,
      search: "",
      filter: this.props.navigation.getParam('diet', ''),
      offsetNum: 13,
      buttonColour: "#FFFFFF",
      button: "Loading...",
      textColour: "#000000",
      filterHeight: this.props.navigation.getParam('filterHeight', '0'),
      likedFoods: [],
    };
  }

  queryString = (text) => {
    //GET https://api.spoonacular.com/recipes/autocomplete?number=10&query=chick
    let base = "https://api.spoonacular.com/recipes/search?";
    let num = "number=" + this.state.number;
    let offset = "&offset=" + this.state.offsetNum;
    let queryString = "&query=" + text;
    let diet = "&diet=" + this.state.filter;
    let instr = "&instructionsRequired=true"
    let key = GLOBAL.apiKey;
    let query = base + num + offset + queryString + diet + instr + key;
    console.log(query);
    return query;
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleSearch: this.handleSearch,
      data: this.getValue,
      filter: this._filter
    });
    this.query();
  }

  query = () => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    let text = this.props.navigation.getParam('search', 'zz');

    this.setState({ search: text });
    console.log("lllllllllllllllll", text)
    if (text == '') {
      this.setState({
        value: text,
        data: []
      });
    } else {
      fetch(this.queryString(text), {
        method: 'GET',
        headers: {
          'Content-Type': "application/json",
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          //Name
          let i = 0;
          let name = "";
          let url = "";
          let type = "";
          let foodID = "";
          let numbering = 0;
          this.setState({ result: [] })
          if (responseJson.results.length >= 1) {
            for (i = 0; i < this.state.number; i++) {
              if (responseJson.results.length < this.state.number) {
                this.setState({
                  number: responseJson.results.length
                });
              }

              if (i != 0) {
                numbering = numbering + 1;
              }

              foodID = responseJson.results[i].id.toString();

              name = JSON.stringify(responseJson.results[i].title);
              name = name.substring(1, name.length - 1);

              if (responseJson.results[i].imageUrls.length > 0) {
                type = responseJson.results[i].imageUrls[0].toString();
                type = type.substring(type.length - 3, type.length);
              }
              console.log(type);
              url = responseJson.results[i].id.toString();
              url = "https://spoonacular.com/recipeImages/" + url + "-556x370." + type;

              this.setState(prevState => ({
                result: [...prevState.result, {
                  num: numbering,
                  id: foodID,
                  title: name,
                  pictureURL: url,
                  search: text,
                  likeIcon: require("../../../assets/icons/heart.png"),
                }]
              }))
            }
            this.setState({ buttonColour: "#2e2e2e", button: "Next page", textColour: "#FFFFFF" });
          } else {
            this.setState({ button: "No results", buttonColour: "#FFFFFF", textColour: "#000000" });
          }

          this.setState({ buttonColour: "#2e2e2e", button: "Next page", textColour: "#FFFFFF" });
        })

        .catch((error) => {
          console.error(error);
        });
    }
    this.setState({ offsetNum: this.state.offsetNum + 13 });
  }

  _filter = (diet) => {

    //Ensures that query() is called again after setState (setState is async
    //and does not guarantee state change of 'filter' unless done this way)
    if (diet == "") {
      //pop filter bar back up
      this.setState({
        results: [],
        filter: diet,
        filterHeight: -40,
        buttonColour: "#FFFFFF",
        button: "Loading...",
        textColour: "#000000",
      }, () => { this.query() })
    } else {
      this.setState({
        results: [],
        filter: diet,
        filterHeight: 0,
        buttonColour: "#FFFFFF",
        button: "Loading...",
        textColour: "#000000",
      }, () => { this.query() })

    }
  };
  handleSearch = () => {
    this.props.navigation.navigate('mysearch1')
  };

  getValue = () => {
    return this.state.value;
  };

  onPressFood = item => {
    this.props.navigation.navigate('Recipe', { item });
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

    if (this.state.result[num].likeIcon == require("../../../assets/icons/heart.png")) {
      this.setState({
        result: update(this.state.result, { [num]: { likeIcon: { $set: require("../../../assets/icons/heartPink.png") } } }),
        likedFoods: likeList
      })
    } else {
      this.setState({
        result: update(this.state.result, { [num]: { likeIcon: { $set: require("../../../assets/icons/heart.png") } } }),
        likedFoods: likeList
      })
    }
    console.log(this.state.likedFoods);

  }

  renderFood = ({ item }) => (
    <TouchableHighlight underlayColor='rgba(73,182,77,1.0)' onPress={() => this.onPressFood(item)}>
      <View style={styles.foodView}>
        <Image style={styles.foodPhoto} source={{ uri: item.pictureURL }} />
        <Text style={styles.foodName}>{item.title}</Text>
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

  goToTop = () => {
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    this.setState({ result: [], button: "Loading...", textColour: "#000000", buttonColour: "#FFFFFF" });
    this.componentDidMount();
  }

  render() {
    return (
      <View>
        <View style={{
          color: '#FFFFFF',
          flexDirection: 'row',
          justifyContent: 'center', //Horizontally
          alignItems: 'center', //Vertically,
          marginTop: this.state.filterHeight
        }}>
          <Image style={styles.filterIcon} source={require('../../../assets/icons/filter.png')} />
          <Text style={styles.filterText}>   {this.state.filter}</Text>
        </View>
        <ScrollView ref={(c) => { this.scroll = c }} style={styles.scrollView} >
          <View style={{
            alignItems: 'center', //Vertically,
          }}>
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
              flexDirection: 'row',
              justifyContent: 'center', //Horizontally
              alignItems: 'stretch',
              paddingTop: 13,
              width: "100%",
              height: 90 + this.state.filterHeight,
              backgroundColor: this.state.buttonColour
            }}
            onPress={this.goToTop}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: this.state.textColour,
            }}>{this.state.button}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

console.disableYellowBox = true;
export default Food_search2;
const styles = StyleSheet.create({
  foodView: {
    flex: 1,
    height: 313,
    width: 340,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
    margin: 10,
  },

  foodPhoto: {
    height: 215,
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 20,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1.0,
    shadowRadius: 5,
  },

  foodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: 2
  },

  view: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexWrap: 'wrap-reverse'
  },

  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  filterText: {
    paddingTop: 9,
    fontSize: 16,
    color: '#404040',
    height: 35,
    paddingTop: 6
  },

  filterBox: {
    color: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center', //Horizontally
    alignItems: 'center', //Vertically,
    height: 20
  },

  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 4
  },

  filterIcon: {
    height: 20,
    width: 20,
  },

  icon: {
    flexDirection: 'column',
    height: 25,
    width: 25,
    justifyContent: 'center', //Horizontally
    alignItems: 'center', //Vertically,
  },

  iconPressArea: {
    flexDirection: 'column',
    height: 25,
    width: 55,
    justifyContent: 'center', //Horizontally
    alignItems: 'center', //Vertically,

  },

  spacing: {
    fontSize: 5,
    fontWeight: 'bold',
    color: '#000000',
    flexDirection: 'row',
    justifyContent: 'center', //Horizontally
    alignItems: 'center' //Vertically
  },

});
