import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6epvUkkaZAExM6kbf9wb6oBjUs9-iKv0",
  authDomain: "kenlm-2865d.firebaseapp.com",
  projectId: "kenlm-2865d",
  storageBucket: "kenlm-2865d.appspot.com",
  messagingSenderId: "656603726681",
  appId: "1:656603726681:web:a29985d806118c879e0248",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
