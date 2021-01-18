import firebase from 'firebase/app'
import 'firebase/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyAf_ivjYJyopuVVHN4WO1mAfU5Niiupvf4",
    authDomain: "tois-client.firebaseapp.com",
    projectId: "tois-client",
    storageBucket: "tois-client.appspot.com",
    messagingSenderId: "109732683477",
    appId: "1:109732683477:web:19e858c8b6822649a4cc5c",
    measurementId: "G-EY4CJS2353"
};

export const firebaseInit = firebase.initializeApp(firebaseConfig)

export const db = firebaseInit.firestore()