/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import firebase from 'react-native-firebase';

type Props = {};
export default class App extends Component<Props> {
  constructor() {
      super();
      this.ref = firebase.firestore().collection('initialdata');
      console.warn(this.ref)
      this.ref.add({data: 'hello'})
  }

  uploadData() {
      this.ref.add({data: 'hello ' + Math.random()})
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Integration with firebase</Text>
        <Button onPress={this.uploadData} title={'Click me'}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
