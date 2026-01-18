import { initializeApp } from "firebase/app";
import { getDatabase, } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAwxhjNebHgxthBHkHsmnl-dhORs9RR7DE",
    authDomain: "app-chat-b324d.firebaseapp.com",
    databaseURL: "https://app-chat-b324d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "app-chat-b324d",
    storageBucket: "app-chat-b324d.firebasestorage.app",
    messagingSenderId: "191846296260",
    appId: "1:191846296260:web:cbacceb4c1e51ee397b791",
    measurementId: "G-YWJPY5CCKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase();