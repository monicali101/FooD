import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from "react-native";

import MenuImage from '../../Button/Img_menu';


class SettingScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Account Settings',
        headerLeft: (
            <MenuImage
                onPress={() => {
                    navigation.openDrawer();
                }}
            />
        )
    });
    constructor(props) {
        super(props);
        this.state = {
            list: "",
        };
    }

    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('AccountDetail')}
                >
                    <View style={styles.container}>
                        <Image style={styles.icon} source={require('../../../assets/icons/account.jpg')} />
                        <Text style={styles.Text}> Account Details </Text>
                    </View>

                </TouchableOpacity>

                <Text style={styles.Text1}>  </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Preferences')}
                >
                    <View style={styles.container}>
                        <Image style={styles.icon} source={require('../../../assets/icons/cuisine.png')} />
                        <Text style={styles.Text}> Cuisine Preferences </Text>
                    </View>

                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingTop: 30,
        backgroundColor: '#FFFFFF',
    },
    button: {
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        width: 240,
        height: 60,
    },
    Text: {
        fontSize: 19,
        color: '#000000',
        paddingLeft: 10,
    },
    Text1: {
        paddingTop: 30,
        paddingBottom: 30
    },

    icon: {
        width: 42,
        height: 42,

    }
})

export default SettingScreen;
