import React from 'react';
import { AsyncStorage } from 'react-native';

import Login from '../components/Login';

import HomeContainer from './HomeContainer.js';

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loggedIn: false
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    });
    this.setState({ loading: false });
  }

  componentDidMount = async () => {
    let student = await AsyncStorage.getItem('student');
    let language = await AsyncStorage.getItem('language');
    if (language === null) {
      await AsyncStorage.setItem('language', 'english');
    }
    if (student !== null) {
      this.setState({ loggedIn: true });
    }
  };

  makeLogout = async () => {
    await AsyncStorage.removeItem('student');
    this.setState({ loggedIn: false });
  };

  makeLogin = () => {
    this.setState({ loggedIn: true });
  };

  componentDidUpdate() {}

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    } else if (this.state.loggedIn) {
      return (
        <HomeContainer
          makeLogout={this.makeLogout}
          toggleTheme={this.props.toggleTheme}
        />
      );
    } else {
      return <Login makeLogin={this.makeLogin} />;
    }
  }
}

export default MainComponent;
