
// ## Some tutorial code from
// https://github.com/vikrantnegi/react-native-searchable-flatlist/blob/master/src/SearchableList.js
import React from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  Button,
  Alert,
  Image,
  Text
} from 'react-native';
import StarRating from 'react-native-star-rating';
import { SearchBar, Avatar, ListItem } from 'react-native-elements';
import MenuImage from "../../Button/Img_menu";
import getDirections from 'react-native-google-maps-directions'
import { getDistance, getPreciseDistance } from 'geolib';
class share_friend extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Find Nearby Restaurants",
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
            width: "90%",
            color: "black",
            backgroundColor: "#EDEDED",
            borderRadius: 10,
            justifyContent: "center"
          }}
          searchIcond
          round
          onSubmitEditing={event =>
            params.requestGoogle(event.nativeEvent.text)
          }
          placeholder="Search by cuisine or name"
          value={params.data}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      posGet: false,
      ide: false,
      latitude: -33.9378,
      longitude: 151.24,
      restaurant: [],
      currLoc: [],
      search: ""
    };

    this.copy_array = [];
  }
  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      requestGoogle: this.requestGoogle,
    });
    this.getUserPos();

  }


  getUserPos = () => {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          posGet: true,
          currLoc: `location=` + position.coords.latitude + `,` + position.coords.longitude
        });
        this.requestGoogle('');
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

  };

  requestGoogle = (search) => {
    const googlePlace = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;

    const type = `&type=restaurant`; // Carter
    const keyword = (search.length > 0 || search == undefined) ? ('&keyword=' + search) : '';
    const language = `&language=en-AU`;
    const rankby = `&rankby=distance`;
    const key = `&key=AIzaSyCNGvlimsdIoO2Jg1k0NeCPrSTpHhfoFT0`;

    const url = googlePlace + this.state.currLoc.toString() + type + keyword + language + rankby + key;

    this.setState({ ide: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          restaurant: res.results,

        });
        this.copy_array = res.results;
        this.setState({ ide: false });
      })
      .catch(error => {
        Alert.alert(error.message)
      });
  };

  GoogleMap = (dstLat, dstLong) => {
    const data = {

      destination: {
        latitude: dstLat,
        longitude: dstLong
      }
    }
    getDirections(data)
  }

  render() {


    const { navigate } = this.props.navigation;
    if (this.state.ide) {
      console.log(this.state.restaurant.length + "Here1");
      //console.log(this.state)
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      console.log(this.state.restaurant.length + "Here2");
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.restaurant}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (

              < View >
                <Image style={{
                  flexDirection: "column",
                  justifyContent: "center", //Horizontally
                  alignItems: "center", //Vertically
                  height: 215,
                  width: "100%",
                  marginTop: 10

                }} source={{
                  uri: (item.photos == undefined || item.photos.length == 0) ? ('') : (photorequest + item.photos[0].photo_reference + googleKey)
                  //uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAzJnhOTxKZW5QnRfpcP5-_QavVaAxFdCigXr-kGy7ND6OZPg5M8HzcukO-DqQmP482CJ9BXO1UyCTpEHzuIurQUlOigf_Wq2lAoCDxYjAUKFZyQgFalRhBqOjNlAeFoAnEhCFFotfoNay27kpsgZas1lnGhQikJwMqX1I09H-okC_WLSgCB-_mw&key=AIzaSyCNGvlimsdIoO2Jg1k0NeCPrSTpHhfoFT0'
                }} />
                <ListItem
                  //avatar={<Avatar rounded overlayContainerStyle={{ backgroundColor: 'burlywood' }} large title={item.name.split(" ")[0][0] + item.name.split(" ")[1][0]} height={20} width={20} />}
                  title={`${item.name} `}
                  subtitle={

                    <View style={{
                      flexDirection: "column",
                      justifyContent: "flex-start", //Horizontally
                      alignItems: "flex-start", //Vertically
                      height: (item.vicinity.length > 50) ? 90 : 80,
                      width: "100%",
                    }}>
                      <Text style={{
                        paddingLeft: 5
                      }}> {item.vicinity}
                      </Text>
                      <Text style={{
                        paddingLeft: 5,
                      }}> {(getPreciseDistance(
                        { latitude: this.state.latitude, longitude: this.state.longitude },
                        { latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }
                      ) / 1000).toFixed(1) + 'km'}
                      </Text>
                      <Text style={{
                        paddingLeft: 5,
                        color: ((item.opening_hours == undefined) ? ("black") : ((item.opening_hours.open_now) ? "green" : "red")),
                      }}> {((item.opening_hours == undefined) ? ("") : ((item.opening_hours.open_now) ? "Open" : "Close"))}
                      </Text>


                      <View style={{
                        flexDirection: "column",
                        justifyContent: "flex-start", //Horizontally
                        alignItems: "flex-start", //Vertically
                        paddingLeft: 5
                      }}>
                        <StarRating
                          disabled={false}
                          emptyStar={'ios-star-outline'}
                          fullStar={'ios-star'}
                          halfStar={'ios-star-half'}
                          iconSet={'Ionicons'}
                          maxStars={5}
                          rating={(item.rating == undefined) ? (0) : (item.rating)}
                          starSize={20}
                          halfStarEnabled
                          fullStarColor={"#ff8c00"}
                        />
                      </View>
                    </View>}
                  hideChevron

                />

                <Button
                  title={"Open in Google Maps"}
                  color={"#20b2aa"}
                  onPress={() => this.GoogleMap(item.geometry.location.lat, item.geometry.location.lng)}
                >
                </Button>

              </View>
            )}
            keyExtractor={item => item.name}
          />

        </View>


      );
    }

  }
}
const photorequest = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=`;
const googleKey = `&key=AIzaSyCNGvlimsdIoO2Jg1k0NeCPrSTpHhfoFT0`
export default share_friend;
