import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AppNav from './Navigator';
import Welcomepage from '../screens/Welcomepage';

const MainNavigator = createStackNavigator(
    {

        Welcome: Welcomepage,
        AppNav: AppNav
    },
    {
        initialRouteName: 'Welcome',
        headerMode: 'none',
        defaulfNavigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                headerMode: 'none', top: 'never', bottom: 'never'
            }

        })
    },

);





export default AppContainer = createAppContainer(MainNavigator);

console.disableYellowBox = true;
