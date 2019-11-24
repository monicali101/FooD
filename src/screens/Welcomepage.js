import React from "react";
import { SafeAreaView, TouchableHighlight, Dimensions, StyleSheet } from "react-native";
import { Video } from 'expo-av';


export default class Welcomepage extends React.Component {

    render() {
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView style={styles.container}>
                <TouchableHighlight
                    onPress={() => navigate('AppNav')}
                >
                    <Video
                        source={require("../../assets/2.mp4")}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={{ width: screenWidth, height: screenHeight }}
                        alignSelf='center'

                    />

                </TouchableHighlight>

            </SafeAreaView>

        );
    }

};

const screenWidth = Dimensions.get('window').width;
const screenHeight = screenWidth * 2.1;


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", resizeMode: "cover", alignSelf: 'center', width: screenWidth, height: screenHeight },
    button: {
        alignSelf: 'center' //Vertically
    },
    picture: {
        alignSelf: 'center', //Vertically
        borderRadius: 20,
        width: 100,
        height: 100,
        position: 'absolute',
    },
})

//SafeAreaView.setStatusBarHeight(0);
