// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth }         from "firebase/auth";
import { getFirestore }    from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBKldmxK2WpTC72mgQtMDVuBJpdB_DT0EI",
  authDomain: "tezbharatnetwork.firebaseapp.com",
  projectId: "tezbharatnetwork",
  storageBucket: "tezbharatnetwork.firebasestorage.app",
  messagingSenderId: "333895426917",
  appId: "1:333895426917:web:3be17766967f1eba2b378c",
  measurementId: "G-H0D9Q04B29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
const analytics = getAnalytics(app);