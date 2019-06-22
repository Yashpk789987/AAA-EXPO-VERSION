import React from 'react';
import {
  Linking,
  Dimensions,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Text,
  Card,
  CardItem,
  Button,
  Thumbnail,
  Content,
  ListItem
} from 'native-base';
import { ThemeContext } from '../../GlobalContext';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import Swiper from 'react-native-swiper';
import SocialShare from '../SocialShare';

class MainComponent extends React.Component {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  phonecall = () => {
    Linking.openURL(`tel:+917566642636`);
  };

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      share_dialog_visible: false
    };
  }

  fbShare = async () => {
    this.setState({ share_dialog_visible: true });
  };

  componentDidMount() {}
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
                    onPress={() => this.props.navigation.openDrawer()}
                  >
                    <Icon
                      name='menu'
                      style={{ paddingLeft: '20%', color: 'white' }}
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
                  <Text
                    style={{ color: 'white', fontSize: 19, paddingLeft: '26%' }}
                  >
                    AAA ACADEMY
                  </Text>
                </Body>
                <Right>
                  <Menu
                    ref={this.setMenuRef}
                    style={{ width: '50%', height: '20%' }}
                    button={
                      <Button
                        bordered
                        style={{
                          backgroundColor: theme.header_background_color,
                          borderColor: theme.header_background_color
                        }}
                        onPress={this.showMenu}
                      >
                        <Icon
                          name='more'
                          style={{ fontSize: 32, color: 'white' }}
                        />
                      </Button>
                    }
                  >
                    <MenuItem
                      onPress={() => {
                        this.hideMenu();
                        this.props.navigation.navigate('Settings');
                      }}
                    >
                      Settings
                    </MenuItem>
                    <MenuItem
                      onPress={() => {
                        ToastAndroid.show(
                          'Successfully Logged Out ',
                          ToastAndroid.SHORT
                        );
                        this.hideMenu();
                        this.props.screenProps.makeLogOut();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </Right>
              </Header>
              <Content style={{ padding: '4%' }}>
                <Container
                  style={{
                    backgroundColor: theme.background,
                    height: Dimensions.get('window').height * 0.4
                  }}
                >
                  <Swiper autoplay={true} activeDotColor='white'>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD6.jpg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD9.jpg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD5.jpg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD7.jpg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD8.jpg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/add4.jpeg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/add6.jpeg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD1.jpg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD2.jpg')}
                      />
                    </Container>
                  </Swiper>
                </Container>
                <Card style={{ height: Dimensions.get('window').height * 0.7 }}>
                  <CardItem>
                    <Left>
                      <Thumbnail
                        source={{
                          uri:
                            'https://scontent.fbho1-1.fna.fbcdn.net/v/t1.0-9/31939617_625223027816553_3358383972697505792_n.jpg?_nc_cat=106&_nc_ht=scontent.fbho1-1.fna&oh=b82993ec6f7c850bd8ef1b8b51b9289a&oe=5D247810'
                        }}
                      />
                      <Body>
                        <Text>AAA ACADEMY</Text>
                        <Text note>ER. ASHISH AGRAWAL</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Body>
                      <ListItem icon style={{ padding: '5%' }}>
                        <Left style={{ paddingLeft: '5%' }}>
                          <Button
                            style={{ backgroundColor: 'green' }}
                            onPress={() => this.phonecall()}
                          >
                            <Icon name='call' />
                          </Button>
                        </Left>
                        <Right>
                          <Text>{'7000072790,\n7566642636'}</Text>
                        </Right>
                      </ListItem>
                      <ListItem icon style={{ padding: '5%' }}>
                        <Left style={{ paddingLeft: '5%' }}>
                          <Button
                            style={{ backgroundColor: 'blue' }}
                            onPress={() => Linking.openURL('sms:7000072790')}
                          >
                            <Icon name='mail' />
                          </Button>
                        </Left>
                        <Right>
                          <Text>{'7000072790'}</Text>
                        </Right>
                      </ListItem>
                      <ListItem icon style={{ padding: '5%' }}>
                        <Left style={{ paddingLeft: '5%' }}>
                          <Button
                            style={{ backgroundColor: 'red' }}
                            onPress={() =>
                              Linking.openURL('mailto: shshagrawal05@gmail.com')
                            }
                          >
                            <Icon name='mail' />
                          </Button>
                        </Left>
                        <Right>
                          <Text>{'shshagrawal05@gmail.com'}</Text>
                        </Right>
                      </ListItem>
                      <ListItem
                        icon
                        style={{ padding: '5%' }}
                        itemDivider={false}
                      >
                        <Left style={{ paddingLeft: '5%' }}>
                          <Button
                            style={{ backgroundColor: 'blue' }}
                            onPress={() =>
                              Linking.openURL('geo:26.214471, 78.202699')
                            }
                          >
                            <Icon name='md-navigate' />
                          </Button>
                        </Left>
                        <Right style={{ paddingTop: '4%' }}>
                          <Text>
                            {
                              'Sundaram Apartment , \nVivekananda Chauraha, \n Thatipur , Gwalior'
                            }
                          </Text>
                        </Right>
                      </ListItem>
                    </Body>
                  </CardItem>
                  <CardItem style={{ marginTop: '15%' }}>
                    <SocialShare />
                  </CardItem>
                </Card>
                <Container
                  style={{
                    backgroundColor: theme.background,
                    height: Dimensions.get('window').height * 0.44
                  }}
                >
                  <Swiper autoplay={true} activeDotColor='white'>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD3.jpg')}
                      />
                    </Container>
                    <Container
                      style={{
                        margin: '2%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: 'contain',
                          aspectRatio: 1.5
                        }}
                        source={require('../../assets/NADD10.jpg')}
                      />
                    </Container>
                  </Swiper>
                </Container>
                <Container
                  style={{
                    backgroundColor: theme.background,
                    height: Dimensions.get('window').height * 0.05
                  }}
                />
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
export default MainComponent;

// default Dimensions of image is 384 * 272
