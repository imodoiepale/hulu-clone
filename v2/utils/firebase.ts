import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXxTAFt0nmeRb3l-38l6UZAjfNy2Wyz3M",
  authDomain: "moviezz-mania.firebaseapp.com",
  projectId: "moviezz-mania",
  storageBucket: "moviezz-mania.firebasestorage.app",
  messagingSenderId: "546749825581",
  appId: "1:546749825581:web:85d18b157bab13d3ddaea4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Add persistence
import { setPersistence, browserLocalPersistence } from "firebase/auth";
setPersistence(auth, browserLocalPersistence);