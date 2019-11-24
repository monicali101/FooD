import React from 'react';

import {
  FlatList,
  Dimensions,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

import GLOBAL from '../../globals';

class Ingred_Screen extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
  }

  componentDidMount = () => {
    this.query();
  };

  query = () => {
    let { navigation } = this.props;
    let foodID = navigation.getParam('id');
    let base = "https://api.spoonacular.com/recipes/";
    let baseEnd = "/ingredientWidget.json?"
    let key = GLOBAL.apiKey;
    let query = base + foodID + baseEnd + key;

    fetch(query, {
      method: 'GET',
      headers: {
        'Content-Type': "application/json",
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("--------------------------------------------------");
        console.log(responseJson);
        console.log("--------------------------------------------------");
        //Ingredients

        let i = 0;
        let url = "";
        let amount = "";
        this.setState({ result: [] })

        for (i = 0; i < responseJson.ingredients.length; i++) {
          name = responseJson.ingredients[i].name.toString();
          let name = name.charAt(0).toUpperCase() + name.substring(1, name.length);

          amount = responseJson.ingredients[i].amount.metric.value.toString();
          amount = amount + " " + responseJson.ingredients[i].amount.metric.unit.toString();

          url = responseJson.ingredients[i].image.toString();
          url = "https://spoonacular.com/cdn/ingredients_500x500/" + url;

          this.setState(prevState => ({
            result: [...prevState.result, { title: name, quantity: amount, pictureURL: url }]
          }))
        }
      })

      .catch((error) => {
        console.error(error);
      });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
      headerTitleStyle: {
        fontSize: 17
      }
    };
  };

  renderIngredient = ({ item }) => (
    <TouchableHighlight underlayColor='rgba(73,182,77,1.0)'>
      <View style={[{
        flex: 1,
        width: (SW - 20) / 3 - 10,
        height: 100 + 60,
        alignItems: 'center',
        margin: 10,
        marginTop: 30,
        marginLeft: 10,

      }]}>
        <Image style={[{
          width: (SW - 20) / 3 - 10,
          height: 100,
          borderRadius: 60
        }]} source={{ uri: item.pictureURL }} />
        <Text style={[{
          fontSize: 13,
          color: 'black',
          textAlign: 'center',
          margin: 10,
          marginBottom: 5,
        }]}>{item.title}</Text>
        <Text style={{ color: 'grey' }}>{item.quantity}</Text>
      </View>
    </TouchableHighlight>
  );

  render() {

    return (
      <View>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={3}
          data={this.state.result}
          renderItem={this.renderIngredient}
        />
      </View>
    );
  }
}

const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

const SW = ((w < h ? w : h) - 10);
export default Ingred_Screen;
