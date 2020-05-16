import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';

class Btn_Menu extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[{
          marginTop: 7,
          marginBottom: 7,
          flexDirection: 'row',
          padding: 7,
          underlayColor:"#ffffff00"
        }]}
      >
        <View style={[{
          alignItems: 'flex-start',
          flex: 2,
          flexDirection: 'row',
        }]}>
          <Image source={this.props.source} style={[{
            height: 27,
            width: 27,
          }]} />
          <Text style={[{
            fontSize: 18,
            marginLeft: 12,
            marginTop: 4,
          }]}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Btn_Menu;
