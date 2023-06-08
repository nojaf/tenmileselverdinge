// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore/lite";
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhZgXXsHJ1VHv3bSjdjJGqpDruLEwHZHQ",
  authDomain: "ten-miles-elverdinge-2023.firebaseapp.com",
  projectId: "ten-miles-elverdinge-2023",
  storageBucket: "ten-miles-elverdinge-2023.appspot.com",
  messagingSenderId: "368456272852",
  appId: "1:368456272852:web:7c076c81da55a8cd956441",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
await signInAnonymously(auth);

// Initialize store
export const store = getFirestore(app);
export const ordersCollections = collection(store, "orders");
