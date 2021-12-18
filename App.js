import React from 'react';
import FlashMessage from "react-native-flash-message";

import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/Navigation/Tabs'
import store from './src/slice/store';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer >
        <Tabs />
        <FlashMessage position="top" />
        {/* <QRCode /> */}
      </NavigationContainer>
    </Provider>
  );
}
