import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import PaymentMainPage from '../PaymentGateWayContainer/PaymentMainPage';
import PaymentWebView from '../PaymentGateWayContainer/PaymentWebView';

const AppNavigator = createStackNavigator({
  PaymentMainPage: {
    screen: PaymentMainPage
  },
  PaymentWebView: {
    screen: PaymentWebView
  }
});

const AppContainer = createAppContainer(AppNavigator);

export default class __ extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return <AppContainer />;
  }
}
