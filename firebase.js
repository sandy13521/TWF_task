//Import Firebase Modules
const firebase = require("firebase");
require("firebase/database");
require("firebase/storage");
const firebaseConfig = {
    apiKey: "AIzaSyCHsITASb3qBq5lmq8zKWixehSwD8GYGEc",
    authDomain: "twf-task-99b49.firebaseapp.com",
    projectId: "twf-task-99b49",
    storageBucket: "twf-task-99b49.appspot.com",
    messagingSenderId: "1081018862012",
    appId: "1:1081018862012:web:ddfc82f553d2dd996c43b9",
    measurementId: "G-0PN5Q790DS"
};
firebase.initializeApp(firebaseConfig);
//Export Firebase
module.exports = firebase;