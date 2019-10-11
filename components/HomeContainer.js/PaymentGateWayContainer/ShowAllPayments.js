import React from 'react';

import { baseurl, endurl } from '../../../baseurl';

import { ThemeContext } from '../../../GlobalContext';

import {
  AsyncStorage,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Container,
  Icon,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Body,
  Right,
  Button,
  Spinner
} from 'native-base';

export default class ShowAllPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      loading: false
    };
  }

  getPack = pack_id => {
    switch (pack_id) {
      case 1:
        return 'Silver';
      case 2:
        return 'Platinum';
      case 3:
        return 'Gold';
    }
  };

  makePaymentList = theme => {
    return (
      <List>
        {this.state.payments.map((item, index) => {
          return (
            <ListItem avatar>
              <Left></Left>
              <Body>
                <Text style={{ color: 'white' }}>
                  {this.getPack(parseInt(item.payment_type))}
                </Text>
                <Text style={{ color: 'white' }} note>
                  Amount {item.amount}
                </Text>
              </Body>
              <Right>
                <Text style={{ color: 'white' }} note>
                  {item.payment_date}
                </Text>
              </Right>
            </ListItem>
          );
        })}
      </List>
    );
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    let { _id } = JSON.parse(await AsyncStorage.getItem('student'));
    console.log(`${baseurl}payment/showAllPayments/${_id}/${endurl}`);
    fetch(`${baseurl}payment/showAllPayments/${_id}/${endurl}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ payments: data, loading: false });
      })
      .catch(err => {
        alert('Technical Error ');
        console.log(err);
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
                    onPress={() => {
                      alert('Please Click Back Button  Below ');
                    }}
                    hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
                  >
                    <Icon
                      name='arrow-back'
                      style={{ color: 'white', paddingLeft: '20%' }}
                    />
                  </TouchableOpacity>
                </Left>
                <Body>
                  <Text style={{ color: 'white', fontSize: 19 }}>
                    All Payments{' '}
                  </Text>
                </Body>
                <Right />
              </Header>
              <Content
                style={{
                  paddingTop: '8%',
                  paddingLeft: '5%',
                  paddingRight: '5%'
                }}
              >
                {this.state.loading ? (
                  <Spinner color='white' />
                ) : (
                  this.makePaymentList(theme)
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
