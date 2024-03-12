// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy9nE7ttSuk0sK7HBUTkbYnxkiZptDqcw",
  authDomain: "fithub-15d88.firebaseapp.com",
  databaseURL: "https://fithub-15d88-default-rtdb.firebaseio.com",
  projectId: "fithub-15d88",
  storageBucket: "fithub-15d88.appspot.com",
  messagingSenderId: "1128794578",
  appId: "1:1128794578:web:1163117c7d2ce91f1c600b",
  measurementId: "G-FZQD1XHTZD"
};

// Initialize Firebase
console.log(firebaseConfig);
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const STORAGE_BUCKET = getStorage(FIREBASE_APP);
