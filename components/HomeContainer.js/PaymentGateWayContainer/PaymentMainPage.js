import React from 'react';

import { baseurl, endurl } from '../../../baseurl';

import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  AsyncStorage,
  ToastAndroid
} from 'react-native';

import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation
} from 'react-native-popup-dialog';

import {
  Container,
  Header,
  Content,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Button,
  Spinner,
  Form,
  Label,
  Input,
  Item
} from 'native-base';

import { ThemeContext } from '../../../GlobalContext';
import ShowAllPayments from './ShowAllPayments';

export default class PaymentMainPage extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      package_selected: false,
      sample_id_of_package_selected: null,
      selectedbackgroundcolor: '',
      proceeding: false,
      open_dialog: false,
      mobile_number: '',
      email_id: '',
      message: '',
      payment_final_id: null,
      payment_done: false,
      student_id: null,
      posting_on_server: false
    };
  }

  componentDidMount = async () => {
    try {
      let student = JSON.parse(await AsyncStorage.getItem('student'));
      if (student.payment_status == 'true') {
        this.setState({ payment_done: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  setTransactionFinalId = trans_id => {
    this.setState({ payment_final_id: trans_id });
    this.submitPaymentOnServer(trans_id);
  };

  updateCache = async () => {
    try {
      let student = JSON.parse(await AsyncStorage.getItem('student'));
      student.payment_status = 'true';
      await AsyncStorage.setItem('student', JSON.stringify(student));
    } catch (err) {
      console.log(err);
    }
  };

  submitPaymentOnServer = trans_id => {
    this.setState({ posting_on_server: true });
    fetch(`https://www.instamojo.com/api/1.1/payment-requests/${trans_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': '~',
        'X-Auth-Token': '~'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Hii', data.payment_request.payments[0].status);
        if (data.payment_request.payments[0].status == 'Failed') {
          ToastAndroid.show(
            'Transaction Failed...\n PLease Try Again ',
            ToastAndroid.LONG
          );
          this.setState({ posting_on_server: false });
        } else {
          let student_id = this.state.student_id;
          let pack_id = this.state.sample_id_of_package_selected;
          data = Object.assign(data, {
            student_id: student_id,
            pack_id: pack_id
          });
          fetch(`${baseurl}payment/submit_payment_details/${endurl}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(res => {
              res.json();
            })
            .then(async data => {
              this.setState({ payment_done: true, posting_on_server: false });
              this.updateCache();
            })
            .catch(err => {
              alert('Technical Error');
            });
        }
      })
      .catch(function(error) {
        console.log('error', error);
      });
  };

  handleSelectPackage = sample_id_of_package_selected => {
    this.setState({
      sample_id_of_package_selected: sample_id_of_package_selected,
      package_selected: true
    });
  };

  handlePayment = async () => {
    if (this.state.sample_id_of_package_selected != null) {
      this.setState({ open_dialog: true });
    } else {
      alert('Please Choose Any One Pack');
    }
  };

  handleProceed = async () => {
    if (this.state.mobile_number === '' || this.state.email_id === '') {
      this.setState({ message: 'Please Fill All Fields' });
    } else if (this.state.mobile_number.length != 10) {
      this.setState({ message: 'Mobile Number Is Invalid ..' });
    } else {
      this.setState({ message: '', open_dialog: false, proceeding: true });
      let { name, _id } = JSON.parse(await AsyncStorage.getItem('student'));
      this.setState({ student_id: _id });
      fetch(`${baseurl}payment/payment_instamojo/${endurl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          _id: _id,
          email_id: this.state.email_id,
          mobile_number: this.state.mobile_number,
          pack_id: this.state.sample_id_of_package_selected
        })
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ proceeding: false });
          this.props.navigation.navigate('PaymentWebView', {
            payment_request: data.payment_request,
            student_id: _id,
            pack_id: this.state.sample_id_of_package_selected,
            setTransactionFinalId: this.setTransactionFinalId
          });
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    if (this.state.posting_on_server === true) {
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
                  <Body>
                    <Text style={{ color: 'white', fontSize: 19 }}>
                      Redirecting.....{' '}
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
                  <Spinner color='white' />
                </Content>
              </Container>
            );
          }}
        </ThemeContext.Consumer>
      );
    } else if (this.state.payment_done === true) {
      return <ShowAllPayments />;
    }
    return (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Container style={{ backgroundColor: theme.background }}>
              <Dialog
                width={1}
                height={0.6}
                dialogStyle={{ position: 'absolute', top: 0 }}
                visible={this.state.open_dialog}
                dialogTitle={<DialogTitle title='Contact Details' />}
                footer={
                  <DialogFooter>
                    <DialogButton
                      text='CANCEL'
                      onPress={() => {
                        this.setState({ open_dialog: false });
                      }}
                    />
                    <DialogButton
                      text='PROCEED'
                      onPress={() => {
                        this.handleProceed();
                      }}
                    />
                  </DialogFooter>
                }
                dialogAnimation={
                  new SlideAnimation({
                    slideFrom: 'top'
                  })
                }
              >
                <DialogContent style={{ paddingTop: '4%', height: '60%' }}>
                  <Form>
                    <Item stackedLabel>
                      <Label>Mobile Number </Label>
                      <Input
                        keyboardType={'numeric'}
                        onChangeText={text =>
                          this.setState({ mobile_number: text })
                        }
                      />
                    </Item>
                    <Item stackedLabel>
                      <Label>Email Id </Label>
                      <Input
                        keyboardType={'email-address'}
                        onChangeText={text => this.setState({ email_id: text })}
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
                <Body>
                  <Text style={{ color: 'white', fontSize: 19 }}>Payment </Text>
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
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingBottom: '5%'
                  }}
                >
                  Choose Pack
                </Text>
                <Button
                  onPress={() => this.handleSelectPackage(1)}
                  large
                  bordered
                  style={{
                    width: '100%',
                    marginTop: '5%',
                    textAlign: 'center',
                    borderColor: '#C0C0C0',
                    backgroundColor:
                      this.state.sample_id_of_package_selected === 1
                        ? 'orange'
                        : null
                  }}
                >
                  <Text style={{ color: '#C0C0C0' }}>
                    Silver{' '}
                    <Text style={{ color: '#C0C0C0', textAlign: 'right' }}>
                      {'                '}₹100 For Month
                    </Text>
                  </Text>
                </Button>
                <Button
                  onPress={() => this.handleSelectPackage(2)}
                  large
                  bordered
                  style={{
                    width: '100%',
                    marginTop: '5%',
                    textAlign: 'center',
                    borderColor: '#D4AF37',
                    backgroundColor:
                      this.state.sample_id_of_package_selected === 2
                        ? 'orange'
                        : null
                  }}
                >
                  <Text style={{ color: '#D4AF37' }}>
                    Gold{' '}
                    <Text style={{ color: '#D4AF37', textAlign: 'right' }}>
                      {'             '}₹300 For 4 Months
                    </Text>
                  </Text>
                </Button>
                <Button
                  onPress={() => this.handleSelectPackage(3)}
                  large
                  bordered
                  style={{
                    width: '100%',
                    marginTop: '5%',
                    textAlign: 'center',
                    borderColor: '#e5e4e2',
                    backgroundColor:
                      this.state.sample_id_of_package_selected === 3
                        ? 'orange'
                        : null
                  }}
                >
                  <Text style={{ color: '#e5e4e2' }}>
                    Platinum{''}
                    <Text style={{ color: '#e5e4e2', textAlign: 'right' }}>
                      {' '}
                      ₹500 for 6 Months
                    </Text>
                  </Text>
                </Button>
                <Button
                  onPress={this.state.proceeding ? null : this.handlePayment}
                  large
                  style={{
                    width: '100%',
                    marginTop: '20%',
                    textAlign: 'center',
                    paddingTop: '10%'
                  }}
                >
                  {this.state.proceeding === true ? (
                    <Text
                      style={{
                        color: '#e5e4e2',
                        fontSize: 15,
                        textAlign: 'center'
                      }}
                    >
                      Proceeding Please Wait ...
                    </Text>
                  ) : (
                    <Text style={{ color: '#e5e4e2', fontSize: 17 }}>
                      Proceed To Payment
                    </Text>
                  )}

                  {this.state.proceeding === true ? (
                    <Spinner color='white' style={{ paddingRight: '5%' }} />
                  ) : (
                    <Icon name='md-arrow-round-forward' />
                  )}
                </Button>
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

//let data = JSON.parse(JSON.stringify(response));
// console.log(data);
//console.log(data._bodyInit.payment_request.payments[0].status);
//   if (JSON.parse(data._bodyInit).payments[0] === false) {
//     ToastAndroid.show(
//       'Transaction Failed...\n PLease Try Again ',
//       ToastAndroid.LONG
//     );
//   } else {
//     let student_id = this.state.student_id;
//     let pack_id = this.state.sample_id_of_package_selected;
//     data = Object.assign(data, {
//       student_id: student_id,
//       pack_id: pack_id
//     });
//     fetch(`${baseurl}payment/submit_payment_details/${endurl}`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(res => {
//         res.json();
//       })
//       .then(async data => {
//         this.setState({ payment_done: true, posting_on_server: false });
//         this.updateCache();
//       })
//       .catch(err => {
//         alert('Technical Error');
//       });
//   }
// })
// .catch(function(error) {
//   console.log('error', error);
// });
