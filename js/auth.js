import { auth } from './firebaseConfig.js'; // Adjust the path as needed
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
// Inactivity timeout setup
let inactivityTimer;
const inactivityTime = () => {
  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onkeypress = resetTimer;

  function logout() {
    console.log("Logging out due to inactivity");
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  }

  function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logout, 300000); // 5 minutes
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Start inactivity timer
  inactivityTime();

  // Handle profile icon click
  const profileIcon = document.querySelector("#profile-icon");
  if (profileIcon) {
    profileIcon.addEventListener("click", () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          window.location.href = "user-dashboard.html";
        } else {
          window.location.href = "login.html";
        }
      });
    });
  }

  // Handle sign-out logic
  const logoutButton = document.querySelector("#logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth).then(() => {
        localStorage.removeItem("isLoggedIn");
        console.log("User logged out");
        window.location.href = "login.html";
      });
    });
  }

  // Check authentication state
  onAuthStateChanged(auth, (user) => {
    const protectedRoutes = [
      "user-dashboard.html",
      "some-other-protected-page.html",
    ]; // Add more protected routes as needed
    const currentPage = window.location.pathname.split("/").pop();

    if (user) {
      console.log("User is logged in:", user.email);
      const profileLink = document.getElementById("profile-link");
      if (profileLink) {
        profileLink.href = "./user-dashboard.html";
      }

      // Update profile icon with user's photo URL
      const profilePhotoUrl = user.photoURL || "./assets/account-icon.png"; // Use a default image if no photo is set
      if (profileIcon) {
        const profileImg = profileIcon.querySelector("img");
        if (profileImg) {
          profileImg.src = profilePhotoUrl;
          console.log("Profile icon updated with:", profilePhotoUrl);
        }
      }

      // Update user profile information in the DOM
      const welcomeUserNameElement = document.getElementById("welcomeUserName");
      const userNameElement = document.getElementById("userName");
      const userEmailElement = document.getElementById("userEmail");

      if (welcomeUserNameElement) welcomeUserNameElement.textContent = user.displayName || "User";
      if (userNameElement) userNameElement.textContent = user.displayName || "User";
      if (userEmailElement) userEmailElement.textContent = user.email || "No email available";

    } else {
      console.log("User is not logged in");
      const profileLink = document.getElementById("profile-link");
      if (profileLink) {
        profileLink.href = "./login.html";
      }

      // Set profile icon to a default image
      if (profileIcon) {
        const profileImg = profileIcon.querySelector("img");
        if (profileImg) {
          profileImg.src = "./assets/account-icon.png"; // Default profile picture
          console.log("Profile icon set to default");
        }
      }

      // Redirect if the user is trying to access a protected route
      if (protectedRoutes.includes(currentPage)) {
        console.log("Redirecting to login from protected route");
        window.location.href = "./login.html"; // Redirect to login
      }
    }
  });
});
