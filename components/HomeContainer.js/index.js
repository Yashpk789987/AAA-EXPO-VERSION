import {
  createDrawerNavigator,
  createAppContainer,
  DrawerItems,
  SafeAreaView
} from 'react-navigation';
import React from 'react';
import Home from './Home';
import {
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import PracticeSheetsContainer from './PracticeSheetsContainer';
import OnlineTestContainer from './OnlineTestContainer';
import PracticeSetContainer from './PracticeSetContainer.js';
import PdfContainer from './PdfContainer';
import Settings from './Settings';
import { ThemeContext } from '../../GlobalContext';
const { Permissions } = Expo;

import { Container, Header, Content, Body } from 'native-base';

var component_theme = ThemeContext._currentValue;

class CustomDrawer___L extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pic_uri: '',
      login_type: ''
    };
  }
  componentDidMount = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status === 'denied') {
      const { status, permissions } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
    }
    let student = JSON.parse(await AsyncStorage.getItem('student'));
    if (student.login_type === 'fb_login') {
      this.setState({
        name: student.name,
        pic_uri: student.fb_pic,
        login_type: student.login_type
      });
    } else if (student.login_type === 'custom_login') {
      this.setState({ name: student.name, login_type: student.login_type });
    } else if (student.login_type === 'google_login') {
      this.setState({
        name: student.name,
        pic_uri: student.google_pic,
        login_type: student.login_type
      });
    }
  };
  render() {
    var pic = null;
    if (
      this.state.login_type === 'custom_login' ||
      this.state.pic_uri === null ||
      this.state.pic_uri === 'null'
    ) {
      pic = null;
    } else {
      pic = this.state.pic_uri;
    }

    return (
      <ThemeContext.Consumer>
        {theme => {
          component_theme = theme;
          return (
            <Container style={{ backgroundColor: theme.background }}>
              <Content>
                <Header
                  style={[
                    styles.androidHeader,
                    { backgroundColor: theme.header_background_color }
                  ]}
                >
                  <Body>
                    <Text style={{ fontSize: 20, color: 'white' }}>
                      {' '}
                      Hello, {this.state.name}
                    </Text>
                  </Body>
                </Header>
                <TouchableOpacity>
                  {pic === null ? (
                    <Image
                      source={require('../../assets/profile.png')}
                      style={{
                        height: 200,
                        width: null,
                        marginTop: 10,
                        flex: 1
                      }}
                    />
                  ) : (
                    <Image
                      source={{ uri: pic }}
                      style={{
                        height: 200,
                        width: null,
                        marginTop: 10,
                        flex: 1
                      }}
                    />
                  )}
                </TouchableOpacity>

                <SafeAreaView
                  style={{ flex: 1 }}
                  forceInset={{ top: 'always', horizontal: 'never' }}
                >
                  <DrawerItems {...this.props} />
                </SafeAreaView>
              </Content>
            </Container>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const AppNavigator = createDrawerNavigator(
  {
    Home: {
      screen: Home
    },
    'Online WorkSheets': {
      screen: PracticeSheetsContainer
    },
    'Practice Sets': {
      screen: PracticeSetContainer
    },
    'Live  Tests': {
      screen: OnlineTestContainer
    },
    'Download Pdfs': {
      screen: PdfContainer
    },
    Settings: {
      screen: Settings
    }
  },
  {
    contentComponent: CustomDrawer___L,
    contentOptions: {
      inactiveTintColor: component_theme.name === 'dark' ? 'white' : 'black',
      activeBackgroundColor: component_theme.name === 'dark' ? 'white' : 'blue',
      activeTintColor: 'black'
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class __ extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <AppContainer
        screenProps={{
          toggleTheme: this.props.toggleTheme,
          makeLogOut: this.props.makeLogout
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  androidHeader: {
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  }
});
