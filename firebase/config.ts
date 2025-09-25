import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBqfbnv8Ew1xEfdHsgDim9TKK4Xd8XOx_s",
  authDomain: "pos-tech-27544.firebaseapp.com",
  projectId: "pos-tech-27544",
  storageBucket: "pos-tech-27544.firebasestorage.app",
  messagingSenderId: "914637121093",
  appId: "1:914637121093:web:9e3f9b4dc1eec80fe8a52c",
  measurementId: "G-GVXSVNET58"
};

let app: FirebaseApp
let auth: Auth

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    })

} else {
    app = getApp()
    auth = getAuth(app)
}

export { app, auth }
