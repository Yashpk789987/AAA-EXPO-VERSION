import React from 'react';

import MainComponent from './components/MainComponent';
import { AsyncStorage, WebView } from 'react-native';
import { themes, ThemeContext } from './GlobalContext';
import { Container, Header, Text, Body } from 'native-base';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.dark
    };
  }

  componentDidMount = async () => {};

  componentDidUpdate() {}

  toggleTheme = () => {
    this.setState(state => ({
      theme: state.theme === themes.dark ? themes.light : themes.dark
    }));
  };

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Text>Share</Text>
          </Body>
        </Header>
        <WebView
          source={{
            uri:
              'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fshare-dialog%2F&display=popup&ref=plugin&src=like&kid_directed_site=0&app_id=113869198637480'
          }}
        />
      </Container>
      // <ThemeContext.Provider value={this.state.theme}>
      //   <MainComponent toggleTheme={this.toggleTheme} />
      // </ThemeContext.Provider>
    );
  }
}
