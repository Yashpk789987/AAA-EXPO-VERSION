import React from 'react';
import { AsyncStorage, TouchableOpacity } from 'react-native';
import { Badge, Text } from 'native-base';
import Login from '../components/Login';

import HomeContainer from './HomeContainer.js';
import Wins from './Wins.js';

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
        // <Wins />
        // <TouchableOpacity
        //   style={{
        //     paddingTop: '10%',
        //     paddingLeft: '40%',
        //     paddingBottom: '10%'
        //   }}
        //   onPress={() => {
        //     this.props.Jump(data.index - 1);
        //   }}
        // >
        //   <Badge primary>
        //     <Text style={{ color: 'white', paddingTop: 1, width: null }}>
        //       {100}
        //     </Text>
        //   </Badge>
        // </TouchableOpacity>
      );
    } else {
      return <Login makeLogin={this.makeLogin} />;
    }
  }
}

export default MainComponent;
