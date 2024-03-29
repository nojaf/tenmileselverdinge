// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
} from "firebase/firestore/lite";
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
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(store, "localhost", 6006);
}
export const ordersCollections = collection(store, "orders");

export const apiUrl =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5001/ten-miles-elverdinge-2023/europe-west1/createPaymentLink"
    : "https://createpaymentlink-otquim2qwa-ew.a.run.app";

export const dayRegistrationApiUrl =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5001/ten-miles-elverdinge-2023/europe-west1/createDayRegistration"
    : "https://createdayregistration-otquim2qwa-ew.a.run.app";

export const timeRegistrationApiUrl =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5001/ten-miles-elverdinge-2023/europe-west1/registerTime"
    : "https://registertime-otquim2qwa-ew.a.run.app";
