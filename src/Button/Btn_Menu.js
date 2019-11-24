import React from 'react';
import { TouchableHighlight, Image, Text, View } from 'react-native';

class Btn_Menu extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={[{
          marginTop: 7,
          marginBottom: 7,
          flexDirection: 'row',
          padding: 7,
          backgroundColor: '#FFFFFF'
        }]}
      >
        <View style={[{
          alignItems: 'flex-start',
          flex: 2,
          flexDirection: 'row',
          backgroundColor: '#FFFFFF'
        }]}>
          <Image source={this.props.source} style={[{
            height: 27,
            width: 27,
            backgroundColor: '#FFFFFF'
          }]} />
          <Text style={[{
            fontSize: 18,
            marginLeft: 12,
            marginTop: 4,
            backgroundColor: '#FFFFFF'
          }]}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default Btn_Menu;
