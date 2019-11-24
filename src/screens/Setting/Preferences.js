import React, { Component } from "react";
import {
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Button,
  Alert,
  TouchableHighlight
} from "react-native";

import { updateUser } from "../../graphql/mutations.js";
import { getUser } from "../../graphql/queries.js";
import { Auth, API, graphqlOperation } from "aws-amplify";

export default class Preferences extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
        title: "Cuisine Preferences",
    };
  };


  constructor(props) {
    super(props);
    this.state = {
      prefList: [],
      chineseP: false,
      mexicanP: false,
      indianP: false,
      frenchP: false,
      germanP: false,
      italianP: false,
      greekP: false,
      vietP: false,
      thaiP: false,
      koreanP: false,
      japP: false,
      spanishP: false,
      midEastP: false,
      jewP: false,
      africanP: false,
      medP: false,
      britP: false,
      caribbeanP: false,

      chinese: require("../../../assets/images/chinese.jpg"),
      mexican: require("../../../assets/images/mexican.jpg"),

      indian: require("../../../assets/images/indian.jpg"),
      french: require("../../../assets/images/french.jpg"),
      german: require("../../../assets/images/german.jpg"),
      italian: require("../../../assets/images/italian.jpg"),
      greek: require("../../../assets/images/greek.jpg"),
      viet: require("../../../assets/images/viet.jpg"),
      thai: require("../../../assets/images/thai.jpg"),
      korean: require("../../../assets/images/korean.jpg"),
      jap: require("../../../assets/images/jap.jpg"),
      spanish: require("../../../assets/images/spanish.jpg"),
      midEast: require("../../../assets/images/midEast.jpg"),
      jew: require("../../../assets/images/jewish.jpg"),
      african: require("../../../assets/images/african.jpg"),
      med: require("../../../assets/images/med.jpg"),
      brit: require("../../../assets/images/brit.jpg"),
      caribbean: require("../../../assets/images/caribbean.jpg")
    };
  }

  componentWillMount() {
    var cognitoUser = Auth.currentUserInfo().then(user => {
      this.setState({
        userId: user.attributes.sub
      });

      this.fetchUserPref().then(() => {
        var myArray = this.state.fetchedPrefList; //if use prefList it will append and create bug
        for (var item in myArray) {
          if (myArray[item].includes("chinese")) {
            this.setState({
              chineseP: true,
              chinese: require("../../../assets/images/chineseDarken.jpg")
            });
          }
          if (myArray[item].includes("mexican")) {
            this.setState({
              mexicanP: true,
              mexican: require("../../../assets/images/mexicanDarken.jpg")
            });
          }
          if (myArray[item].includes("indian")) {
            this.setState({
              indianP: true,
              indian: require("../../../assets/images/indianDarken.jpg")
            });
          }
          if (myArray[item].includes("french")) {
            this.setState({
              frenchP: true,
              french: require("../../../assets/images/frenchDarken.jpg")
            });
          }
          if (myArray[item].includes("german")) {
            this.setState({
              germanP: true,
              german: require("../../../assets/images/germanDarken.jpg")
            });
          }
          if (myArray[item].includes("italian")) {
            this.setState({
              italianP: true,
              italian: require("../../../assets/images/italianDarken.jpg")
            });
          }
          if (myArray[item].includes("greek")) {
            this.setState({
              greekP: true,
              greek: require("../../../assets/images/greekDarken.jpg")
            });
          }
          if (myArray[item].includes("viet")) {
            this.setState({
              vietP: true,
              viet: require("../../../assets/images/vietDarken.jpg")
            });
          }
          if (myArray[item].includes("thai")) {
            this.setState({
              thaiP: true,
              thai: require("../../../assets/images/thaiDarken.jpg")
            });
          }
          if (myArray[item].includes("korean")) {
            this.setState({
              koreanP: true,
              korean: require("../../../assets/images/koreanDarken.jpg")
            });
          }
          if (myArray[item].includes("jap")) {
            this.setState({
              japP: true,
              jap: require("../../../assets/images/japDarken.jpg")
            });
          }
          if (myArray[item].includes("spanish")) {
            this.setState({
              spanishP: true,
              spanish: require("../../../assets/images/spanishDarken.jpg")
            });
          }
          if (myArray[item].includes("midEast")) {
            this.setState({
              midEastP: true,
              midEast: require("../../../assets/images/midEastDarken.jpg")
            });
          }
          if (myArray[item].includes("jew")) {
            this.setState({
              jewP: true,
              jew: require("../../../assets/images/jewishDarken.jpg")
            });
          }
          if (myArray[item].includes("african")) {
            this.setState({
              africanP: true,
              african: require("../../../assets/images/africanDarken.jpg")
            });
          }
          if (myArray[item].includes("med")) {
            this.setState({
              medP: true,
              med: require("../../../assets/images/medDarken.jpg")
            });
          }
          if (myArray[item].includes("brit")) {
            this.setState({
              britP: true,
              brit: require("../../../assets/images/britDarken.jpg")
            });
          }
          if (myArray[item].includes("caribbean")) {
            this.setState({
              caribbeanP: true,
              caribbean: require("../../../assets/images/caribbeanDarken.jpg")
            });
          }
        }
      });
    });
  }

  fetchUserPref() {
    console.log("Getting preferences for userId: ", this.state.userId);

    var fetchedPrefList = API.graphql(
      graphqlOperation(getUser, { id: this.state.userId })
    ).then(response => {
      console.log("userPref: ", response.data.getUser["preferences"]);
      this.setState({
        fetchedPrefList: response.data.getUser["preferences"]
      });
    });

    return fetchedPrefList;
  }

  updateUserPref(prefList) {
    console.log("received prefList", prefList);
    var myArray = prefList;
    for (var item in prefList) {
      myArray[item] = prefList[item];
    }

    var record = {
      id: this.state.userId,
      preferences: myArray
    };

    console.log("-----updating user record ----> ", record);

    var newUser = API.graphql(graphqlOperation(updateUser, { input: record }))
      .then(response => {
        console.log("updated record: ", response);
      })

      .catch(err => console.log(err));
  }

  changePic2() {
    if (this.state.chinese == require("../../../assets/images/chinese.jpg")) {
      this.setState({
        chineseP: true,
        chinese: require("../../../assets/images/chineseDarken.jpg")
      });
    }

    if (
      this.state.chinese == require("../../../assets/images/chineseDarken.jpg")
    ) {
      this.setState({
        chineseP: false,
        chinese: require("../../../assets/images/chinese.jpg")
      });
    }
  }

  changeMexican() {
    if (this.state.mexican == require("../../../assets/images/mexican.jpg")) {
      this.setState({
        mexicanP: true,
        mexican: require("../../../assets/images/mexicanDarken.jpg")
      });
    }

    if (
      this.state.mexican == require("../../../assets/images/mexicanDarken.jpg")
    ) {
      this.setState({
        mexicanP: false,
        mexican: require("../../../assets/images/mexican.jpg")
      });
    }
  }

  changeIndian() {
    if (this.state.indian == require("../../../assets/images/indian.jpg")) {
      this.setState({
        indianP: true,
        indian: require("../../../assets/images/indianDarken.jpg")
      });
    }

    if (
      this.state.indian == require("../../../assets/images/indianDarken.jpg")
    ) {
      this.setState({
        indianP: false,
        indian: require("../../../assets/images/indian.jpg")
      });
    }
  }

  changeFrench() {
    if (this.state.french == require("../../../assets/images/french.jpg")) {
      this.setState({
        frenchP: true,
        french: require("../../../assets/images/frenchDarken.jpg")
      });
    }

    if (
      this.state.french == require("../../../assets/images/frenchDarken.jpg")
    ) {
      this.setState({
        frenchP: false,
        french: require("../../../assets/images/french.jpg")
      });
    }
  }
  changeGerman() {
    if (this.state.german == require("../../../assets/images/german.jpg")) {
      this.setState({
        germanP: true,
        german: require("../../../assets/images/germanDarken.jpg")
      });
    }

    if (
      this.state.german == require("../../../assets/images/germanDarken.jpg")
    ) {
      this.setState({
        germanP: false,
        german: require("../../../assets/images/german.jpg")
      });
    }
  }

  changeItalian() {
    if (this.state.italian == require("../../../assets/images/italian.jpg")) {
      this.setState({
        italianP: true,
        italian: require("../../../assets/images/italianDarken.jpg")
      });
    }

    if (
      this.state.italian == require("../../../assets/images/italianDarken.jpg")
    ) {
      this.setState({
        italianP: false,
        italian: require("../../../assets/images/italian.jpg")
      });
    }
  }

  changeGreek() {
    if (this.state.greek == require("../../../assets/images/greek.jpg")) {
      this.setState({
        greekP: true,
        greek: require("../../../assets/images/greekDarken.jpg")
      });
    }

    if (this.state.greek == require("../../../assets/images/greekDarken.jpg")) {
      this.setState({
        greekP: false,
        greek: require("../../../assets/images/greek.jpg")
      });
    }
  }
  changeViet() {
    if (this.state.viet == require("../../../assets/images/viet.jpg")) {
      this.setState({
        vietP: true,
        viet: require("../../../assets/images/vietDarken.jpg")
      });
    }

    if (this.state.viet == require("../../../assets/images/vietDarken.jpg")) {
      this.setState({
        vietP: false,
        viet: require("../../../assets/images/viet.jpg")
      });
    }
  }

  changeThai() {
    if (this.state.thai == require("../../../assets/images/thai.jpg")) {
      this.setState({
        thaiP: true,
        thai: require("../../../assets/images/thaiDarken.jpg")
      });
    }

    if (this.state.thai == require("../../../assets/images/thaiDarken.jpg")) {
      this.setState({
        thaiP: false,
        thai: require("../../../assets/images/thai.jpg")
      });
    }
  }
  changeKorean() {
    if (this.state.korean == require("../../../assets/images/korean.jpg")) {
      this.setState({
        koreanP: true,
        korean: require("../../../assets/images/koreanDarken.jpg")
      });
    }

    if (
      this.state.korean == require("../../../assets/images/koreanDarken.jpg")
    ) {
      this.setState({
        koreanP: false,
        korean: require("../../../assets/images/korean.jpg")
      });
    }
  }
  changeJap() {
    if (this.state.jap == require("../../../assets/images/jap.jpg")) {
      this.setState({
        japP: true,
        jap: require("../../../assets/images/japDarken.jpg")
      });
    }

    if (this.state.jap == require("../../../assets/images/japDarken.jpg")) {
      this.setState({
        japp: false,
        jap: require("../../../assets/images/jap.jpg")
      });
    }
  }
  changeSpanish() {
    if (this.state.spanish == require("../../../assets/images/spanish.jpg")) {
      this.setState({
        spanishP: true,
        spanish: require("../../../assets/images/spanishDarken.jpg")
      });
    }

    if (
      this.state.spanish == require("../../../assets/images/spanishDarken.jpg")
    ) {
      this.setState({
        spanishP: false,
        spanish: require("../../../assets/images/spanish.jpg")
      });
    }
  }
  changeMidEast() {
    if (this.state.midEast == require("../../../assets/images/midEast.jpg")) {
      this.setState({
        midEastP: true,
        midEast: require("../../../assets/images/midEastDarken.jpg")
      });
    }

    if (
      this.state.midEast == require("../../../assets/images/midEastDarken.jpg")
    ) {
      this.setState({
        midEastP: false,
        midEast: require("../../../assets/images/midEast.jpg")
      });
    }
  }
  changeJew() {
    if (this.state.jew == require("../../../assets/images/jewish.jpg")) {
      this.setState({
        jewP: true,
        jew: require("../../../assets/images/jewishDarken.jpg")
      });
    }

    if (this.state.jew == require("../../../assets/images/jewishDarken.jpg")) {
      this.setState({
        jewP: false,
        jew: require("../../../assets/images/jewish.jpg")
      });
    }
  }
  changeAfrican() {
    if (this.state.african == require("../../../assets/images/african.jpg")) {
      this.setState({
        africanP: true,
        african: require("../../../assets/images/africanDarken.jpg")
      });
    }

    if (
      this.state.african == require("../../../assets/images/africanDarken.jpg")
    ) {
      this.setState({
        africanP: false,
        african: require("../../../assets/images/african.jpg")
      });
    }
  }
  changeMed() {
    if (this.state.med == require("../../../assets/images/med.jpg")) {
      this.setState({
        medP: true,
        med: require("../../../assets/images/medDarken.jpg")
      });
    }

    if (this.state.med == require("../../../assets/images/medDarken.jpg")) {
      this.setState({
        medP: false,
        med: require("../../../assets/images/med.jpg")
      });
    }
  }
  changeBrit() {
    if (this.state.brit == require("../../../assets/images/brit.jpg")) {
      this.setState({
        britP: true,
        brit: require("../../../assets/images/britDarken.jpg")
      });
    }

    if (this.state.brit == require("../../../assets/images/britDarken.jpg")) {
      this.setState({
        britP: false,
        brit: require("../../../assets/images/brit.jpg")
      });
    }
  }
  changeCaribbean() {
    if (
      this.state.caribbean == require("../../../assets/images/caribbean.jpg")
    ) {
      this.setState({
        caribbeanP: true,
        caribbean: require("../../../assets/images/caribbeanDarken.jpg")
      });
    }

    if (
      this.state.caribbean ==
      require("../../../assets/images/caribbeanDarken.jpg")
    ) {
      this.setState({
        caribbeanP: false,
        caribbean: require("../../../assets/images/caribbean.jpg")
      });
    }
  }
  sendPrefList() {
    let prefList = [...this.state.prefList];

    if (this.state.chineseP == true) {
      prefList.push("chinese");
    }
    if (this.state.indianP == true) {
      prefList.push("indian");
    }
    if (this.state.mexicanP == true) {
      prefList.push("mexican");
    }
    if (this.state.frenchP == true) {
      prefList.push("french");
    }
    if (this.state.germanP == true) {
      prefList.push("german");
    }
    if (this.state.italianP == true) {
      prefList.push("italian");
    }
    if (this.state.greekP == true) {
      prefList.push("greek");
    }
    if (this.state.vietP == true) {
      prefList.push("viet");
    }
    if (this.state.thaiP == true) {
      prefList.push("thai");
    }
    if (this.state.koreanP == true) {
      prefList.push("korean");
    }
    if (this.state.japP == true) {
      prefList.push("jap");
    }
    if (this.state.spanishP == true) {
      prefList.push("spanish");
    }
    if (this.state.midEastP == true) {
      prefList.push("midEast");
    }
    if (this.state.jewP == true) {
      prefList.push("jewish");
    }
    if (this.state.africanP == true) {
      prefList.push("african");
    }
    if (this.state.medP == true) {
      prefList.push("mediterranean");
    }
    if (this.state.britP == true) {
      prefList.push("brit");
    }
    if (this.state.caribbeanP == true) {
      prefList.push("caribbean");
    }

    if (prefList.length < 1) {
      console.log("--- Show Dialog ---");
      this.setState({ showPopup: true });
      Alert.alert(
        "No cuisine selected",
        "Please select at least 1 cuisine",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      this.setState({ prefList });
      console.log(prefList);
      this.updateUserPref(prefList);
      this.props.navigation.navigate("Setting");
    }
  }
  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.main}>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              margin: 20,
              fontSize: 18,
              lineHeight: 30
            }}
          >
            Please input your cuisine preferences:
          </Text>
          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changePic2()}
            >
              <Image style={styles.picture} source={this.state.chinese} />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeIndian()}
            >
              <Image style={styles.picture} source={this.state.indian} />
            </TouchableHighlight>
          </View>

          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeMexican()}
            >
              <Image style={styles.picture} source={this.state.mexican} />
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeFrench()}
            >
              <Image style={styles.picture} source={this.state.french} />
            </TouchableHighlight>
          </View>
          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeGerman()}
            >
              <Image style={styles.picture} source={this.state.german} />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeItalian()}
            >
              <Image style={styles.picture} source={this.state.italian} />
            </TouchableHighlight>
          </View>
          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeGreek()}
            >
              <Image style={styles.picture} source={this.state.greek} />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeViet()}
            >
              <Image style={styles.picture} source={this.state.viet} />
            </TouchableHighlight>
          </View>
          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeThai()}
            >
              <Image style={styles.picture} source={this.state.thai} />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeKorean()}
            >
              <Image style={styles.picture} source={this.state.korean} />
            </TouchableHighlight>
          </View>
          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeMidEast()}
            >
              <Image style={styles.picture} source={this.state.midEast} />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeJew()}
            >
              <Image style={styles.picture} source={this.state.jew} />
            </TouchableHighlight>
          </View>

          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeAfrican()}
            >
              <Image style={styles.picture} source={this.state.african} />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeMed()}
            >
              <Image style={styles.picture} source={this.state.med} />
            </TouchableHighlight>
          </View>
          <View
            style={{
              flexDirection: "row",
              margin: 20,
              justifyContent: "space-around"
            }}
          >
            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeBrit()}
            >
              <Image style={styles.picture} source={this.state.brit} />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.picture}
              onPress={() => this.changeCaribbean()}
            >
              <Image style={styles.picture} source={this.state.caribbean} />
            </TouchableHighlight>
          </View>

          <View
            style={[
              {
                width: "70%",
                paddingTop: 20,
                paddingBottom: 20,
                alignSelf: "center" //Vertically
              }
            ]}
          >
            <Button
              style={styles.button}
              title="Save Preferences"
              color="#2e2e2e"
              onPress={() => this.sendPrefList()}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
const screenWidth = Math.round(Dimensions.get("window").width);
const pictureWidth = screenWidth / 2.4; // constant use for picture weight
const pictureHeight = pictureWidth * 1.2; // constant use for picture height, ratio is 1.2
const styles = StyleSheet.create({
  picture: {
    alignSelf: "center", //Vertically
    borderRadius: 20,
    width: pictureWidth,
    height: pictureHeight
  },
  button: {
    alignSelf: "center" //Vertically
  }
});
