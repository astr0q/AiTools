// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAll2ZkF16He-lfcTvjCmalh-XBQ12qyjc",
  authDomain: "ai-features-29e59.firebaseapp.com",
  projectId: "ai-features-29e59",
  storageBucket: "ai-features-29e59.firebasestorage.app",
  messagingSenderId: "54220411401",
  appId: "1:54220411401:web:281631aa3101ae51ac5ed8",
  measurementId: "G-L3Z41ZFKLW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
