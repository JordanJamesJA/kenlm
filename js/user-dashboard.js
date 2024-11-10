// SHOW MENU

const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  toggle.addEventListener("click", () => {
    nav.classList.toggle("show-menu");
    toggle.classList.toggle("show-icon");
  });
};

showMenu("nav-toggle", "nav-menu");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6epvUkkaZAExM6kbf9wb6oBjUs9-iKv0",
  authDomain: "kenlm-2865d.firebaseapp.com",
  projectId: "kenlm-2865d",
  storageBucket: "kenlm-2865d",
  messagingSenderId: "656603726681",
  appId: "1:656603726681:web:a29985d806118c879e0248",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let isLoggingOut = false;

// Inactivity timeout setup
let inactivityTimer;
const inactivityTime = () => {
  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onkeypress = resetTimer;

  function logout() {
    signOut(auth).then(() => {
      window.location.href = "login.html"; // Redirect to login on sign out
    });
  }

  function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logout, 300000); // 5 minutes
  }
};

// Start inactivity timer
inactivityTime();

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    updateUserProfile(user);
    updateProfileIcon(user);
    loadUserBookings(user); // Load bookings when user is signed in
  } else {
    console.log("No user is signed in.");
    if (!isLoggingOut) {
      window.location.href = "/register.html"; // Redirect to register if not logged in
    }
  }
});

// Function to update user profile information in the DOM
function updateUserProfile(user) {
  const userName = user.displayName || "User";
  const userEmail = user.email || "No email available";
  const userProfilePicture = user.photoURL || "./assets/account-icon.png"; // Default profile picture

  console.log("Updating user profile:", {
    userName,
    userEmail,
    userProfilePicture,
  });

  // Update profile information in the DOM
  const welcomeUserNameElement = document.getElementById("welcomeUserName");
  const userNameElement = document.getElementById("userName");
  const userEmailElement = document.getElementById("userEmail");
  const userProfilePictureElement =
    document.getElementById("userProfilePicture");

  if (welcomeUserNameElement) welcomeUserNameElement.textContent = userName;
  if (userNameElement) userNameElement.textContent = userName;
  if (userEmailElement) userEmailElement.textContent = userEmail;
  if (userProfilePictureElement)
    userProfilePictureElement.src = userProfilePicture;
}

// Function to update the profile icon with user's photo URL
function updateProfileIcon(user) {
  const profileLinkElement = document.getElementById("profileLink");
  const profilePhotoUrl = user.photoURL || "./assets/account-icon.png"; // Use default if no photo is set

  if (profileLinkElement) {
    const profileIconImage = profileLinkElement.querySelector("img");
    if (profileIconImage) {
      profileIconImage.src = profilePhotoUrl; // Update profile icon to user's picture
    }
  }
}

//base trip cost

// Price per person
const adultPrice = 50;
const childPrice = 30;
const infantPrice = 0;

// Function to load user bookings from Firestore
async function loadUserBookings(user) {
  const bookingsContainer = document.getElementById("bookingsContainer");
  bookingsContainer.innerHTML = `<h2>Recent Bookings</h2>`; // Clear container and add header

  console.log("Loading bookings for user:", user.uid); // Log current user UID

  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    const bookings = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log("All Bookings Retrieved:", bookings); // Log all retrieved bookings

    // Filter bookings for the current user
    const userBookings = bookings.filter((booking) => booking.uid === user.uid);
    console.log("Filtered User Bookings:", userBookings); // Log the filtered bookings

    if (userBookings.length === 0) {
      bookingsContainer.innerHTML += "<p>No previous bookings made</p>";
      return;
    }

    // Display each user's booking in a card format
    userBookings.forEach((booking) => {
      console.log("Rendering Booking:", booking);

      const totalPrice = parseFloat(booking.totalPrice) || 0;

      const paymentStatus = booking.paymentStatus || "Incomplete";
      const isPaymentIncomplete = paymentStatus === "Incomplete";
      const phone = booking.phone || "N/A";
      const formattedPhone = phone.replace(/\D/g, ""); // Remove non-digit characters

      const displayNumber =
        formattedPhone.length === 10
          ? `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
              3,
              6
            )}-${formattedPhone.slice(6)}`
          : "N/A";

      const bookingCard = document.createElement("div");
      bookingCard.classList.add("booking-card", "booking-item");
      bookingCard.innerHTML = `
    <p><strong>Transfer Type:</strong> ${booking.transferType || "N/A"}</p>
    <p><strong>Name:</strong> ${booking.name || "N/A"}</p>
   <p><strong>Number:</strong> ${displayNumber}</p>
    <p><strong>Arrival Date:</strong> ${booking.arrivalDate || "N/A"}</p>
    <p><strong>Number of Guests:</strong> ${
      parseInt(booking.adults) +
      parseInt(booking.children) +
      parseInt(booking.infants)
    }</p>
    <p><strong>Destination:</strong> ${booking.hotel || "N/A"}</p>
    <p><strong>Total Cost:</strong> $${totalPrice.toFixed(2)}</p>
    <div class="progress-tracker">
        <p>Status: <strong>${booking.status || "N/A"}</strong></p>
        <p>Payment Status: <strong>${paymentStatus}</strong></p>
    </div>
    <div class="booking-actions">
  ${
    isPaymentIncomplete
      ? '<button id = "checkout-button" class="btn pay-now">Pay Now</button>'
      : ""
  }
  <button class="btn see-details">See Details</button>
</div>
          `;

      bookingsContainer.appendChild(bookingCard);
    });
  } catch (error) {
    console.error("Error loading bookings:", error);
    bookingsContainer.innerHTML =
      "<p>Error loading bookings. Please try again later.</p>";
  }
}

// Initialize Stripe with your public key
const stripe = Stripe(
  "pk_test_51QJL3IGjUyreWGVT0aJnfSGBQGvF9fH2ovnx9baa8c3vBFCV8YypVM4HuPPYijjjEsLj3HECILOL2cPKSeSMWBvW00gWGgkYzL"
); // Replace with your Stripe publishable key

async function loadIncompletePayments(user) {
  const paymentContainer = document.getElementById("paymentContainer");
  paymentContainer.innerHTML = `<h2>Incomplete Payments</h2>`; // Clear container and add header

  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    const bookings = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Filter only bookings with incomplete payment status and for the current user
    const incompletePayments = bookings.filter(
      (booking) =>
        booking.uid === user.uid && booking.paymentStatus === "Incomplete"
    );

    if (incompletePayments.length === 0) {
      paymentContainer.innerHTML += "<p>No incomplete payments found.</p>";
      return;
    }

    // Display each incomplete payment in a card format
    incompletePayments.forEach((booking) => {
      const totalPrice = parseFloat(booking.totalPrice) || 0;

      const paymentCard = document.createElement("div");
      paymentCard.classList.add("booking-card", "booking-item");

      paymentCard.innerHTML = `
        <p><strong>Transfer Type:</strong> ${booking.transferType || "N/A"}</p>
        <p><strong>Name:</strong> ${booking.name || "N/A"}</p>
        <p><strong>Arrival Date:</strong> ${booking.arrivalDate || "N/A"}</p>
        <p><strong>Total Cost:</strong> $${totalPrice.toFixed(2)}</p>
        <div class="progress-tracker">
          <p>Payment Status: <strong>Incomplete</strong></p>
        </div>
        <div class="booking-actions">
          <button id="checkout-button" class="btn pay-now" data-booking-id="${
            booking.id
          }" data-price="${totalPrice}">Pay Now</button>
        </div>
      `;

      paymentContainer.appendChild(paymentCard);
    });

    // Add event listener for "Pay Now" buttons
    const payNowButtons = document.querySelectorAll(".pay-now");
    payNowButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const bookingId = event.target.dataset.bookingId;
        const price = event.target.dataset.price;

        try {
          // Call your server to create a Stripe Checkout session
          const response = await fetch(
            "http://localhost:5000/create-checkout-session", // Ensure this URL is correct
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ price, bookingId }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to create checkout session");
          }

          const { id } = await response.json();

          // Redirect to Stripe Checkout
          const { error } = await stripe.redirectToCheckout({ sessionId: id });
          if (error) {
            console.error("Stripe checkout error:", error.message);
          }
        } catch (error) {
          console.error("Error initiating payment:", error);
        }
      });
    });
  } catch (error) {
    console.error("Error loading incomplete payments:", error);
    paymentContainer.innerHTML =
      "<p>Error loading incomplete payments. Please try again later.</p>";
  }
}

// Payment processing function
const createCheckoutSession = async (price, bookingId) => {
  try {
    const response = await fetch(
      "https://your-cloud-function-url/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price, bookingId }), // Pass price and booking ID
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const { id } = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: id });
    if (error) {
      console.error("Stripe checkout error:", error.message);
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
  }
};

// Use this function to show incomplete payments when the sidebar link is clicked
const paymentLink = document.getElementById("paymentLink");
if (paymentLink && !paymentLink.dataset.initialized) {
  paymentLink.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(paymentSection); // Show the payment section
    loadIncompletePayments(auth.currentUser); // Load incomplete payments for the current user
  });
  paymentLink.dataset.initialized = "true"; // Prevent duplicate listeners
}

// Logout functionality
const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", () => {
    isLoggingOut = true;
    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.innerHTML = '<div class="spinner"></div><p>Logging out...</p>';
    document.body.appendChild(overlay);

    signOut(auth)
      .then(() => {
        setTimeout(() => {
          overlay.remove();
          window.location.href = "login.html";
        }, 1000);
      })
      .catch(() => {
        overlay.remove();
        isLoggingOut = false;
      });
  });
}

// Profile icon click event
document.addEventListener("DOMContentLoaded", function () {
  const profileLinkElement = document.getElementById("profileLink");

  profileLinkElement.addEventListener("click", function (event) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      event.preventDefault();
      window.location.href = "user-dashboard.html";
    } else {
      window.location.href = "login.html";
    }
  });
});

// Sidebar toggle functionality
const sidebar = document.querySelector(".sidebar");
const toggleButton = document.getElementById("sidebarToggle");
if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

// Section visibility management
const bookingsSection = document.getElementById("bookingsContainer");
const accountSection = document.querySelector(".section:nth-of-type(1)"); // Account Info section
const paymentSection = document.querySelector(".section:nth-of-type(3)"); // Payment section
const settingsSection = document.querySelector(".section:nth-of-type(4)"); // Settings section

// Hide all sections by default except for Account Info
function hideAllSections() {
  accountSection.style.display = "none";
  bookingsSection.style.display = "none";
  paymentSection.style.display = "none";
  // settingsSection.style.display = "none";
}

// Show the specified section
function showSection(section) {
  hideAllSections(); // Hide all other sections
  section.style.display = ""; // Show the specified section
}

// Event listener for the Bookings link in the sidebar
const bookingsLink = document.getElementById("bookingsLink");
if (bookingsLink) {
  bookingsLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default anchor behavior
    showSection(bookingsSection); // Show the bookings section
    loadUserBookings(auth.currentUser); // Load bookings for the user
  });
}

// Event listener for the Account link in the sidebar
const accountLink = document.getElementById("accountLink"); // Modify as necessary if the link has a specific ID
if (accountLink) {
  accountLink.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(accountSection); // Show the account section
  });
}

// Event listener for the Payment link in the sidebar
if (paymentLink) {
  paymentLink.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Payment link clicked");
    showSection(paymentSection); // Show the payment section
  });
}

// Initial state: Show account section on page load
hideAllSections();
showSection(accountSection);

const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const mess = document.getElementById("message");

function sendEmail() {
  const bodyMessage = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Message: ${mess.value}`;
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "jj2903780@gmail.com",
    Password: "5D6059E51D44BCFF161AF157424847D81FCD",
    To: "jordan.jsjames@gmail.com",
    From: "jj2903780@gmail.com",
    Subject: subject.value,
    Body: bodyMessage,
  }).then((message) => {
    if (message === "OK") {
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully!",
        icon: "success",
      });
      fullName.value = "";
      email.value = "";
      mess.value = "";
      subject.value = "";
    } else {
      fullName.style.borderColor = "red";
      email.style.borderColor = "red";
      mess.style.borderColor = "red";
      subject.style.borderColor = "red";
    }
  });
}

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   sendEmail();
// });
