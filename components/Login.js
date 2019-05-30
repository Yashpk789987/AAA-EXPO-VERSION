import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  AsyncStorage,
  Modal,
  View
} from 'react-native';
import { Facebook, Google } from 'expo';
import { Container, Button, Form, Input, Item, Label } from 'native-base';
import { baseurl, endurl } from '../baseurl';
import { DotIndicator } from 'react-native-indicators';
const APP_ID = `2101839143230469`;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      facebook_id: '',
      name: '',
      fb_pic_uri: '',
      fb_login: false,
      google_login: false,
      google_pic_uri: '',
      google_id: '',
      login_type: '',
      loading: false
    };
  }

  handleLogIn = async () => {
    if (this.state.email === '') {
      alert('Please Enter Email Id');
    } else if (this.state.password === '') {
      alert('Please Enter Password');
    } else {
      let a = await this.setState({
        login_type: 'custom_login',
        loading: true
      });
    }
    fetch(`${baseurl}students/student_login/${endurl}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(async data => {
        if (data.code === 'success') {
          await AsyncStorage.setItem('student', JSON.stringify(data.student));
          this.setState({ loading: false });
          this.props.makeLogin();
        } else {
          alert(data.message);
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        alert('Technical Error');
        this.setState({ loading: false });
        console.log(err);
      });
  };

  fbLogIn = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync(APP_ID, {
        permissions: ['public_profile']
      });
      if (type === 'success') {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,picture.width(200).height(150)&access_token=${token}`
        );
        let res = await response.json();
        await this.setState({
          loading: true,
          login_type: 'fb',
          fb_login: true,
          facebook_id: res.id,
          name: res.name,
          fb_pic_uri: res.picture.data.url
        });
        fetch(`${baseurl}students/student_login/${endurl}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state)
        })
          .then(res => res.json())
          .then(async data => {
            await AsyncStorage.setItem('student', JSON.stringify(data));
            this.setState({ loading: false });
            this.props.makeLogin();
          })
          .catch(err => {
            alert('Technical Error');
            console.log(err);
            this.setState({ loading: false });
          });
      } else {
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      this.setState({ loading: false });
    }
  };

  googleLogIn = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          '770693742657-cfca0ckapu7rrm5o21te7hutkpdb2uaa.apps.googleusercontent.com',
        androidStandaloneAppClientId:
          '825054366160-uob259bt5tsbrkeklhu1m5la2qpbggff.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });
      if (result.type === 'success') {
        await this.setState({
          name: result.user.name,
          email: result.user.email,
          google_pic_uri: result.user.photoUrl,
          google_id: result.user.id,
          loading: true,
          login_type: 'google'
        });

        fetch(`${baseurl}students/student_login/${endurl}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state)
        })
          .then(res => res.json())
          .then(async data => {
            await AsyncStorage.setItem('student', JSON.stringify(data));
            this.setState({ loading: false });
            this.props.makeLogin();
          })
          .catch(err => {
            alert('Technical Error');
            console.log(err);
            this.setState({ loading: false });
          });
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <ImageBackground
        source={require('../assets/login.jpg')}
        style={styles.container}
      >
        <Form>
          <Item floatingLabel>
            <Label style={{ color: 'white' }}>Email Id </Label>
            <Input
              onChangeText={text => this.setState({ email: text })}
              keyboardType='email-address'
              selectionColor='white'
              style={{ color: 'white' }}
            />
          </Item>
          <Item floatingLabel>
            <Label style={{ color: 'white' }}>Password</Label>
            <Input
              onChangeText={text => this.setState({ password: text })}
              secureTextEntry={true}
              selectionColor='white'
              style={{ color: 'white' }}
            />
          </Item>
          <Button
            style={{
              borderRadius: 5,
              justifyContent: 'center',
              width: '95%',
              marginLeft: '5%',
              backgroundColor: 'white',
              marginTop: '7%'
            }}
            onPress={() => this.handleLogIn()}
          >
            <Text style={{ fontSize: 20 }}>Login</Text>
          </Button>
          <Button
            style={{
              borderRadius: 5,
              justifyContent: 'center',
              width: '95%',
              marginLeft: '5%',
              backgroundColor: '#3b5998',
              marginTop: '7%'
            }}
            onPress={() => this.fbLogIn()}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>Facebook Login</Text>
          </Button>
          <Button
            style={{
              borderRadius: 5,
              justifyContent: 'center',
              width: '95%',
              marginLeft: '5%',
              backgroundColor: '#DB4437',
              marginTop: '7%'
            }}
            onPress={() => this.googleLogIn()}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>Google Login</Text>
          </Button>
        </Form>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.loading}
          onRequestClose={() => alert('Closed')}
        >
          <View style={{ paddingTop: '40%' }}>
            <DotIndicator color='white' />
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    paddingTop: '40%',
    paddingRight: '10%'
  }
});
