import React from 'react';
import { TouchableHighlight, Image } from 'react-native';


class Btn_back extends React.Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress} style={[{
        flex: 1,
        shadowOffset: {
          width: 0,
          height: 3
        },
        backgroundColor: 'white',
        shadowColor: '#000',
        padding: 9,
        margin: 11,
        shadowOpacity: 0.26,
        shadowRadius: 3.73,
        alignItems: 'center',
        borderRadius: 180,
        elevation: 4
      },]}>
        <Image source={require('../../assets/icons/backArrow.png')} style={[{
          height: 17,
          width: 17
        }]} />
      </TouchableHighlight>
    );
  }
}


export default Btn_back;
