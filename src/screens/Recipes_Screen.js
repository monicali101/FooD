import React from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import BackButton from '../Button/Btn_back';
import ViewIngredientsButton from '../Button/Btn_ingred';
import GLOBAL from '../../globals';


class Recipes_Screen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTransparent: 'true',
      headerLeft: (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      result: [],
      mins: "Loading...",
      cuisineList: "",
    };
  }

  query = () => {
    let { navigation } = this.props;
    let item = navigation.getParam('item');

    let base = "https://api.spoonacular.com/recipes/";
    let id = item.id;///////////
    let baseEnd = "/analyzedInstructions/?stepBreakdown=true"
    let key = GLOBAL.apiKey;
    let query = base + id + baseEnd + key;

    let query2 = "https://api.spoonacular.com/recipes/" + id + "/information?" + key;

    fetch(query, {
      method: 'GET',
      headers: {
        'Content-Type': "application/json",
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        //Steps
        let i = 0;
        let j = 0;
        let step = "";
        let stepName = "";
        this.setState({ result: [] })

        for (j = 0; j < responseJson.length; j++) {
          stepName = JSON.stringify(responseJson[j].name);
          stepName = stepName.substring(1, stepName.length - 1);

          if (stepName.length > 0) {
            stepName = "~~" + stepName + "~~";
            this.setState(prevState => ({
              result: [...prevState.result, { steps: stepName }]
            }))
          }
          for (i = 0; i < responseJson[j].steps.length; i++) {
            step = JSON.stringify(responseJson[j].steps[i].step);
            step = step.substring(1, step.length - 1);
            step = (i + 1) + ". " + step;
            this.setState(prevState => ({
              result: [...prevState.result, { steps: step }]
            }))
          }
        }

        console.log(this.state.result)

      })
      .catch((error) => {
        console.error(error);
      });

    fetch(query2, {
      method: 'GET',
      headers: {
        'Content-Type': "application/json",
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        //Ready in minutes & cuisine & null recipe handling
        let minutes = responseJson.readyInMinutes + " minutes"
        let cuis = ""
        //if nothing in cuisine from prev page
        if (item.cuisine == null) {
          //if response contains array of cuisines - logic for commas
          if (responseJson.cuisines.length > 0) {
            if (responseJson.cuisines.length == 1) {
              cuis = responseJson.cuisines[0];
            } else {
              for (i = 0; i < responseJson.cuisines.length; i++) {
                if (i == 0) {
                  cuis = responseJson.cuisines[i];
                } else {
                  cuis = cuis + ", " + responseJson.cuisines[i]
                }
              }
            }

            //else will use what was searched
          } else {
            cuis = item.search;
          }
        } else {
          cuis = item.cuisine;
        }

        if (responseJson.instructions == null) {
          step = "Sorry, no recipe available 🤡";
          this.setState(prevState => ({
            result: [...prevState.result, { steps: step }]
          }))
        }

        this.setState(() => ({
          mins: minutes,
          cuisineList: cuis,
          foodID: id
        }))
      })
      .catch((error) => {
        console.error(error);
      });

  }

  componentDidMount = () => {
    this.query();
  };


  renderText = ({ item }) => (
    <Text style={[{
      fontSize: 16,
      textAlign: 'left',
      margin: 15,
      marginTop: 10,
    }]}>{item.steps}</Text>
  );

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');

    return (
      <ScrollView style={[{
        flex: 1,
        backgroundColor: 'white',
      }]}>

        <View >
          <View >
            <TouchableHighlight>
              <View style={[{
                flex: 1,
                width: VW,
                height: 250,
                justifyContent: 'center',
              }]}>
                <Image style={[{
                  ...StyleSheet.absoluteFillObject,
                  height: 250,
                  width: '100%',
                }]} source={{ uri: item.pictureURL }} />
              </View>
            </TouchableHighlight>
          </View>
        </View>

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 25,
          marginTop: 20,
        }}>

          {/* Triple Berry Smoothie */}
          <Text style={[{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 10,
            color: 'black',
          }]}>{item.title}</Text>

          {/* SMOOTHIES */}
          <View style={[{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center', //Horizontally
            textAlign: 'center',
            lineHeight: 26
          }]}>
            <Text style={[{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#2cd18a',
              margin: 10,
              textAlign: 'center',
              lineHeight: 26
            }]}>{this.state.cuisineList}</Text>
          </View>

          {/* 10 MINUTES */}
          <View style={[{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center', //Horizontally
            textAlign: 'center',
            lineHeight: 26
          }]}>
            <Image style={[{
              height: 20,
              width: 20,
              marginRight: 0
            }]} source={require('../../assets/icons/stopwatch.png')} />
            <Text style={[{
              fontSize: 14,
              fontWeight: 'bold',
              marginLeft: 5,
            }]}>{this.state.mins} </Text>
          </View>

          {/* View Ingredients */}
          <View style={[{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center', //Horizontally
            textAlign: 'center',
            lineHeight: 26
          }]}>
            <ViewIngredientsButton
              onPress={() => {
                this.props.navigation.navigate('MyIngredient', { item, id: this.state.foodID });
              }}
            />
          </View>
          {/* Instructions */}
          <View style={[{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center', //Horizontally
            textAlign: 'center',
            lineHeight: 26
          }]}>
            <Text style={[{
              fontSize: 6,
              textAlign: 'left',
              margin: 15,
              marginTop: 1,
            }]}> </Text>
          </View>
          <View style={[{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center', //Horizontally
            textAlign: 'center',
            lineHeight: 26
          }]}>
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              numColumns={1}
              data={this.state.result}
              renderItem={this.renderText}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Recipes_Screen;

const { width: VW } = Dimensions.get('window');
