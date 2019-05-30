import React from 'react';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation
} from 'react-native-popup-dialog';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  AsyncStorage,
  RefreshControl,
  Modal
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
  ListItem,
  Form,
  Input,
  Item,
  Label
} from 'native-base';

import { GlobalContext, ThemeContext } from '../../../GlobalContext';
import { baseurl, endurl } from '../../../baseurl';
import { PulseIndicator, DotIndicator } from 'react-native-indicators';

export default class TestCategory extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      online_tests: [],
      online_tests_loading: true,
      authorization_phase_starts: false,
      authorization_phase_ends: false,
      authorizing: false,
      test_code: '',
      password: '',
      selected_test: null,
      message: '',
      student_id: null
    };
  }

  handleCategoryClick = async test => {
    await this.setState({
      authorization_phase_starts: true,
      selected_test: test
    });
  };

  refresh_list = () => {
    this.setState({ online_tests_loading: true });
    fetch(
      `${baseurl}tests/fetch_online_tests/${this.state.student_id}/${endurl}`
    )
      .then(res => res.json())
      .then(data => {
        this.setState({ online_tests: data, online_tests_loading: false });
      })
      .catch(err => {
        console.log(err);
        alert('Technical Error. Please Try Again');
      });
  };

  componentDidMount = async () => {
    let student_id = JSON.parse(await AsyncStorage.getItem('student'))._id;
    this.setState({ student_id: student_id });
    fetch(`${baseurl}tests/fetch_online_tests/${student_id}/${endurl}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ online_tests: data, online_tests_loading: false });
      })
      .catch(err => {
        console.log(err);
        alert('Technical Error. Please Try Again');
      });
  };

  refresh_control = () => {
    return (
      <RefreshControl
        refreshing={this.state.online_tests_loading}
        onRefresh={() => this.refresh_list()}
      />
    );
  };

  handle_verify = () => {
    if (this.state.test_code === '' || this.state.password === '') {
      this.setState({ message: 'Please Fill Up All Fields' });
    } else {
      this.setState({ message: '', authorizing: true });
      fetch(`${baseurl}authorize/authorize/${endurl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            this.setState({
              authorization_phase_starts: false,
              authorizing: false
            });
            this.props.navigation.navigate('TestSwiper', {
              test: this.state.selected_test,
              refresh_list: this.refresh_list
            });
          } else {
            this.setState({
              message: 'Wrong Code/Password',
              authorizing: false
            });
          }
        })
        .catch(err => console.log(err));
    }
  };

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
            <Left>
              <PulseIndicator color='green' size={20} />
            </Left>
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
              <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.authorizing}
                onRequestClose={() => alert('Closed')}
              >
                <View style={{ paddingTop: '20%' }}>
                  <DotIndicator color='white' />
                </View>
              </Modal>
              <Dialog
                width={1}
                height={0.6}
                visible={this.state.authorization_phase_starts}
                dialogTitle={<DialogTitle title='Verfication' />}
                footer={
                  <DialogFooter>
                    <DialogButton
                      text='CANCEL'
                      onPress={() => {
                        this.setState({ authorization_phase_starts: false });
                      }}
                    />
                    <DialogButton
                      text='VERIFY'
                      onPress={() => this.handle_verify()}
                    />
                  </DialogFooter>
                }
                dialogAnimation={
                  new SlideAnimation({
                    slideFrom: 'bottom'
                  })
                }
              >
                <DialogContent style={{ paddingTop: '4%', height: '60%' }}>
                  <Form>
                    <Item stackedLabel>
                      <Label>Test Code</Label>
                      <Input
                        onChangeText={text =>
                          this.setState({ test_code: text })
                        }
                      />
                    </Item>
                    <Item stackedLabel>
                      <Label>Password</Label>
                      <Input
                        secureTextEntry={true}
                        onChangeText={text => this.setState({ password: text })}
                      />
                    </Item>
                  </Form>
                  <Text style={{ color: 'red', paddingLeft: '5%' }}>
                    {`\n`}
                    {this.state.message}
                  </Text>
                </DialogContent>
              </Dialog>
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
                    Online Tests
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
