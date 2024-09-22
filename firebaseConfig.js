
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDF-Mtfdii7Opzoz-ywy5uFXxmpoDvuf24",
  authDomain: "movieintake.firebaseapp.com",
  projectId: "movieintake",
  storageBucket: "movieintake.appspot.com",
  messagingSenderId: "977409241525",
  appId: "1:977409241525:web:88769ae6fc7830f16369fc",
  measurementId: "G-86P9KC2KC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};