import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Chat() {
  const onFaceId = async () => {
    try {
      // Checking if device is compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync();
      
      if (!isCompatible) {
        throw new Error('Your device isn\'t compatible.')
      }

      // Checking if device has biometrics records
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!isEnrolled) {
        throw new Error('No Faces / Fingers found.')
      }

      // Authenticate user
      await LocalAuthentication.authenticateAsync();

      Alert.alert('Authenticated', 'Welcome back !')
    } catch (error) {
      Alert.alert('An error as occured', error?.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>That is a simple example on how to use Face ID / Touch ID on React Native!</Text>
      <Button title="Sign in with Face ID" onPress={onFaceId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  }
});