// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8iJsmoG7uHSDxZitMtGpp164CIqvOV6w",
  authDomain: "clothes-store-controller.firebaseapp.com",
  projectId: "clothes-store-controller",
  storageBucket: "clothes-store-controller.appspot.com",
  messagingSenderId: "84993316224",
  appId: "1:84993316224:web:7288d7da5750c12f111d65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set up security rules
const setupSecurityRules = async () => {
  try {
    // Firestore rules
    await db.settings({
      ignoreUndefinedProperties: true,
    });

    // Storage rules
    await storage.setCustomAuthDomain(`${firebaseConfig.projectId}.firebaseapp.com`);
  } catch (error) {
    console.error("Error setting up security rules:", error);
  }
};

setupSecurityRules();

export { app, auth, db, storage };
