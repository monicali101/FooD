import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';

class Btn_ingred extends React.Component {
  render() {
    return (
      <TouchableHighlight underlayColor='rgba(73,182,77,1.0)' onPress={this.props.onPress}>
        <View style={[{
          flex: 1,
          borderColor: '#2cd18a',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 21,
          marginLeft: 11,
          marginRight: 11,
          borderRadius: 101,
          height: 51,
          width: 271,
        }]}>
          <Text style={[{
            fontSize: 15,
            color: '#2cd18b'
          }]}>Ingredients</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default Btn_ingred;
