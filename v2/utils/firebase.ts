import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAXxTAFt0nmeRb3l-38l6UZAjfNy2Wyz3M",
  authDomain: "moviezz-mania.firebaseapp.com",
  projectId: "moviezz-mania",
  storageBucket: "moviezz-mania.firebasestorage.app",
  messagingSenderId: "546749825581",
  appId: "1:546749825581:web:85d18b157bab13d3ddaea4",
  measurementId: "G-2074WC02QM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

