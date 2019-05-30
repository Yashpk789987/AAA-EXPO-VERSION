import React, { Component } from 'react';
import {
  Switch,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Button,
  Separator
} from 'native-base';
import { ThemeContext, LanguageContext } from '../../GlobalContext';

export default class Settings extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    switch_value: false,
    switching_language: false,
    present_selected_language: '',
    getting_language: true
  };

  handleSwitch = () => {
    this.setState(state => ({ switch_value: !state.switch_value }));
    this.props.screenProps.toggleTheme();
  };

  handleSwitchLanguage = async () => {
    let current_language =
      this.state.present_selected_language === 'english' ? 'hindi' : 'english';
    this.setState({
      switching_language: true,
      present_selected_language: current_language
    });
    await AsyncStorage.setItem('language', current_language);
    this.setState({
      switching_language: false,
      present_selected_language: current_language
    });
  };

  componentDidMount = async () => {
    let language = await AsyncStorage.getItem('language');
    this.setState({
      getting_language: false,
      present_selected_language: language
    });
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Container style={{ backgroundColor: theme.background }}>
              <Header
                style={[
                  styles.androidHeader,
                  { backgroundColor: theme.header_background_color }
                ]}
              >
                <Left>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
                  >
                    <Icon
                      name='arrow-back'
                      style={{ color: 'white', paddingLeft: '20%' }}
                    />
                  </TouchableOpacity>
                </Left>
                <Body
                  style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 19 }}>Settings</Text>
                </Body>
                <Right />
              </Header>
              <Content>
                <ListItem icon bordered>
                  <Left>
                    <Button
                      style={{ backgroundColor: theme.header_background_color }}
                    >
                      <Icon
                        active
                        name={theme.name === 'light' ? 'sunny' : 'moon'}
                      />
                    </Button>
                  </Left>
                  <Body>
                    <Text style={{ color: theme.text_color }}>
                      {theme.name === 'light'
                        ? 'Switch To Dark Theme'
                        : 'Switch To Light Theme'}
                    </Text>
                  </Body>
                  <Right>
                    <Switch
                      value={theme.name === 'dark' ? true : false}
                      trackColor={{ true: 'white', false: 'blue' }}
                      thumbColor={theme.name === 'dark' ? 'white' : 'blue'}
                      onValueChange={() => this.handleSwitch()}
                    />
                  </Right>
                </ListItem>
                <ListItem icon bordered>
                  <Left>
                    <Button
                      style={{ backgroundColor: theme.header_background_color }}
                    >
                      <Icon active name={'md-book'} />
                    </Button>
                  </Left>
                  <Body>
                    <Text style={{ color: theme.text_color }}>
                      {this.state.present_selected_language === 'english'
                        ? 'Switch To Hindi Language'
                        : 'Switch To English Language'}
                    </Text>
                  </Body>
                  <Right>
                    <Switch
                      value={
                        this.state.present_selected_language === 'english'
                          ? true
                          : false
                      }
                      trackColor={{ true: 'white', false: 'blue' }}
                      thumbColor={theme.name === 'dark' ? 'white' : 'blue'}
                      onValueChange={() => this.handleSwitchLanguage()}
                    />
                  </Right>
                </ListItem>
              </Content>
            </Container>
          );
        }}
      </ThemeContext.Consumer>
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
  },
  androidHeaderTitle: {
    ...Platform.select({
      android: {
        alignItems: 'flex-end'
      }
    })
  }
});
