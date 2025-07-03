import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwG-LgtZiuH9KweUVQ4r5cNwHDYRkajHQ",
  authDomain: "shivam-acdb8.firebaseapp.com",
  projectId: "shivam-acdb8",
  storageBucket: "shivam-acdb8.firebasestorage.app",
  messagingSenderId: "24560763815",
  appId: "1:24560763815:web:46ed3b86f846d2234c2c82",
  measurementId: "G-XFHWDKY1FW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;
