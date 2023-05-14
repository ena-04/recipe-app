// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCF9g0aT_9h8XkUGV-rEECGr333ZFfh19c",
  authDomain: "recipe-app-a5d7b.firebaseapp.com",
  projectId: "recipe-app-a5d7b",
  storageBucket: "recipe-app-a5d7b.appspot.com",
  messagingSenderId: "817313204067",
  appId: "1:817313204067:web:23005595bd08b122b0f556"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
export const storage= getStorage(app);

export{db}