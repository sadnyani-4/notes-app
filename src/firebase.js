// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // We'll use this for authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore methods
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANcuVcFkkPq64Spl2yuZ9XVD-Tz57xBG4",
  authDomain: "notes-app-d7a49.firebaseapp.com",
  projectId: "notes-app-d7a49",
  storageBucket: "notes-app-d7a49.firebasestorage.app",
  messagingSenderId: "403892000231",
  appId: "1:403892000231:web:f3ff7fe54337f24a599942",
  measurementId: "G-4NWLKNNV63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// Initialize Firestore
const db = getFirestore(app); // Add this line

// Export the auth and db objects
export { auth, db }; // Ensure db is included in exports