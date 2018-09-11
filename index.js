/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from 'react-native-firebase';

AppRegistry.registerComponent(appName, () => App);

firebase.auth()
    .signInAnonymouslyAndRetrieveData()
    .then(credential => {
        if (credential) {
            console.log('default app user ->', credential.user.toJSON());
        }
    });
