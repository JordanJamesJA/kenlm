// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

const googleLoginBtn = document.getElementById("google-login-btn");
googleLoginBtn.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      window.location.href = "user-dashboard.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      alert("Signing In...");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    });
});
