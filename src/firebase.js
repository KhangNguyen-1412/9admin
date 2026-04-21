// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZherk8dHTOabrTfXAgSaCYW6ouwdHG7Q",
  authDomain: "admin-12e22.firebaseapp.com",
  projectId: "admin-12e22",
  storageBucket: "admin-12e22.firebasestorage.app",
  messagingSenderId: "581552531611",
  appId: "1:581552531611:web:cb8595982a0fdbb6d87e3e",
  measurementId: "G-5HLS560H1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
