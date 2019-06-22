import React from 'react';
import { Linking, StyleSheet, View, Text } from 'react-native';
import { Button, Icon } from 'native-base';
export default class SocialShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFacebookShare = () => {
    Linking.canOpenURL('fb://page/440691429603048')
      .then(supported => {
        if (!supported) {
          Linking.openURL('https://www.facebook.com/AAA.AcademyGwalior/');
        } else {
          Linking.openURL('fb://page/440691429603048');
        }
      })
      .catch(err => {
        Linking.openURL('https://www.facebook.com/AAA.AcademyGwalior/');
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            style={{ backgroundColor: '#3b5998' }}
            title='Button 1'
            onPress={() => this.handleFacebookShare()}
          >
            <Icon name='logo-facebook' />
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={{ backgroundColor: '#25D366' }} title='Button 1'>
            <Icon name='logo-whatsapp' />
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={{ backgroundColor: '#E1306C' }} title='Button 1'>
            <Icon name='logo-instagram' />
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={{ backgroundColor: '#00acee' }} title='Button 1'>
            <Icon name='logo-twitter' />
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginLeft: '5%'
  },
  buttonContainer: {
    flex: 1
  }
});
