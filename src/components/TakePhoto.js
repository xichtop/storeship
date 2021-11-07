import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  LogBox,
} from "react-native";
import uuid from "uuid";
import { Button } from 'react-native-elements'

const firebaseConfig = {
  apiKey: "AIzaSyDt_15WXxh2XJJCS6FkKHW7VjCwlay_jMk",
  authDomain: "yoloshop-c1d07.firebaseapp.com",
  projectId: "supership-36962",
  storageBucket: "yoloshop-c1d07.appspot.com",
  messagingSenderId: "756463689084",
  appId: "1:756463689084:web:e456999532f96ad76b98f9"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default class PhotoTake extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      image: 'https://static.thenounproject.com/png/396915-200.png',
      uploading: false,
    }
  }

  async componentDidMount() {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }

    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  }

  render() {
    let { image } = this.state;

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 5 }} />
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Button
            onPress={this._pickImage}
            title="Chọn ảnh"
            type="outline"
            style={{paddingRight: 5}}
            titleStyle={{fontSize: 10}}
            buttonStyle = {{width: 70}}
          />

          <Button
            onPress={this._takePhoto}
            title="Chụp ảnh"
            type="outline"
            titleStyle={{fontSize: 10}}
            buttonStyle = {{width: 70}}
          />
        </View>
        {this._maybeRenderUploadingOverlay()}
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(63, 114, 175, 0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
        this.props.handleGetImg(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref().child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}