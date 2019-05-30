import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import {
  Badge,
  Container,
  Thumbnail,
  Header,
  Left,
  Right,
  Body,
  Icon,
  Button,
  Card,
  CardItem,
  Spinner,
  Content,
  ListItem
} from 'native-base';

import { GlobalContext, ThemeContext } from '../../../GlobalContext';
import { baseurl, endurl } from '../../../baseurl';
import { PulseIndicator } from 'react-native-indicators';

export default class TestCategory extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      online_tests: [],
      online_tests_loading: true
    };
  }

  handleCategoryClick = test => {
    this.props.navigation.navigate('TestSwiper', { test: test });
  };

  refresh_list = () => {
    this.setState({ online_tests_loading: true });
    fetch(`${baseurl}tests/fetch_offline_tests/${endurl}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ online_tests: data, online_tests_loading: false });
      })
      .catch(err => {
        console.log(err);
        alert('Technical Error. Please Try Again');
      });
  };

  componentDidMount() {
    fetch(`${baseurl}tests/fetch_offline_tests/${endurl}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ online_tests: data, online_tests_loading: false });
      })
      .catch(err => {
        console.log(err);
        alert('Technical Error. Please Try Again');
      });
  }

  makeCategories = button_background_color => {
    return this.state.online_tests.map((test, index) => {
      return (
        <Card key={test._id}>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={require('../../../assets/test.jpg')} />
            </Left>
            <Body>
              <Text style={{ fontSize: 20 }}>{test.english_title}</Text>
            </Body>
          </ListItem>
          <CardItem>
            <Body>
              <Text> </Text>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  this.handleCategoryClick(test);
                }}
              >
                <Text style={{ color: 'blue' }}> Start Now </Text>
                <Icon active name='arrow-round-forward' size={18} />
              </Button>
            </Right>
          </CardItem>
        </Card>
      );
    });
  };

  componentDidUpdate() {}

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
                  <GlobalContext.Consumer>
                    {({ drawer_reference }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => drawer_reference.openDrawer()}
                          hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
                        >
                          <Icon
                            name='menu'
                            style={{ color: 'white', paddingLeft: '20%' }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  </GlobalContext.Consumer>
                </Left>
                <Body
                  style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{ color: 'white', fontSize: 19, paddingLeft: '26%' }}
                  >
                    OFFline Tests
                  </Text>
                </Body>
                <Right />
              </Header>
              <Content
                style={{ padding: '3%' }}
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={() => this.refresh_list()}
                  />
                }
              >
                {this.state.online_tests_loading ? (
                  <Spinner color={theme.spinner_color} />
                ) : (
                  this.makeCategories(theme.button_background_color)
                )}
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
