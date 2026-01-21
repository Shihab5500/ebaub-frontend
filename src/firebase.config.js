import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// তোমার দেওয়া কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyD2QjPLfmbdJl8ZyDFt-say7lbTS1qP6OQ",
  authDomain: "ebaub-fun-hub.firebaseapp.com",
  projectId: "ebaub-fun-hub",
  storageBucket: "ebaub-fun-hub.firebasestorage.app",
  messagingSenderId: "927134164477",
  appId: "1:927134164477:web:0e9587514e6da31be8e594"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // এটা এক্সপোর্ট করা জরুরি