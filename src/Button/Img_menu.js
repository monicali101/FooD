import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

class Img_menu extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[{
          padding: 11
        }]}
        onPress={this.props.onPress}
      >
        <Image
          style={[{
            height: 26,
            width: 26,
            justifyContent: 'center',
            margin: 7
          }]}
          source={require('../../assets/icons/menu.png')}
        />
      </TouchableOpacity>
    );
  }
}

export default Img_menu;
