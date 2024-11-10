import { db } from "./firebaseConfig.js"; // Adjust the path as needed
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"; // Import getAuth

// Initialize Firebase Auth
const auth = getAuth(); // Create an instance of auth

// Define hotel pricing data
const hotelPrices = {
  "Azul Beach Resort Negril by Karisma": { base: 90, additional: 20 },
  "Bahia Principe": { base: 40, additional: 10 },
  "Breathless Montego Bay Resort & Spa": { base: 50, additional: 10 },
  "Couples Negril": { base: 70, additional: 15 },
  "Couples Tower Isle": { base: 70, additional: 15 },
  "Excellence Oyster Bay": { base: 90, additional: 20 },
  "Glistening Waters": { base: 80, additional: 20 },
  "Grand Lido Negril Au Naturel All-Suite-Resort": {
    base: 110,
    additional: 25,
  },
  "Grand Palladium Lady Hamilton Resort & Spa": { base: 50, additional: 15 },
  "Half Moon, A RockResort": { base: 40, additional: 10 },
  "Hedonism II": { base: 70, additional: 15 },
  "Hilton Rose Hall Resort & Spa": { base: 50, additional: 15 },
  "Iberostar Grand Rose Hall": { base: 50, additional: 15 },
  "Jamaica Inn": { base: 60, additional: 15 },
  "Jewel Dunn's River Beach Resort & Spa": { base: 70, additional: 15 },
  "Kaz Kreol Beach Lodge & Wellness Retreat": { base: 80, additional: 20 },
  "Melia Bracco": { base: 90, additional: 20 },
  "Moon Palace Jamaica": { base: 100, additional: 25 },
  "Mystic Ridge Resort": { base: 80, additional: 20 },
  "Ocean Coral Spring": { base: 90, additional: 23 },
  "Ocean Eden Bay": { base: 90, additional: 23 },
  "Pipers Cove Resort": { base: 70, additional: 15 },
  "Riu Palace Tropical Bay": { base: 90, additional: 20 },
  "RIU Ocho Rios": { base: 80, additional: 20 },
  "Rockhouse Hotel": { base: 70, additional: 15 },
  "Royal Decameron Club Caribbean": { base: 60, additional: 15 },
  "Royal Plantation": { base: 90, additional: 20 },
  "Royalton Blue Waters Montego Bay": { base: 80, additional: 20 },
  "Royalton Negril Resort & Spa": { base: 80, additional: 20 },
  "Sandals Negril Beach Resort & Spa": { base: 90, additional: 20 },
  "Sandals Montego Bay": { base: 40, additional: 10 },
  "Sandals Ochi Beach Resort": { base: 50, additional: 10 },
  "Sandals White House": { base: 160, additional: 40 },
  "Sandcastles Resorts": { base: 60, additional: 15 },
  "Shaw Park Beach Hotel & Spa": { base: 70, additional: 15 },
  "Silver Seas Hotel": { base: 50, additional: 10 },
  "Sky Castles": { base: 50, additional: 10 },
  "Sunset at the Palms Resort": { base: 90, additional: 20 },
  "Turtle Beach Towers": { base: 80, additional: 20 },
  Tryall: { base: 90, additional: 20 },
};

// Prices for hotels without specific rates
const negrilPrice = { base: 110, additional: 28 }; // Same for all Negril hotels
const runAwayBayPrice = { base: 100, additional: 25 }; // Same for all Runaway Bay hotels
const ochiRiosPrice = { base: 120, additional: 30 }; // Same for all Ochi Rios hotels

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Function to validate dates
  const validateDates = (arrivalDate, departureDate) => {
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    if (arrival >= departure) {
      return false;
    }
    const minimumTime = 24 * 60 * 60 * 1000; // Minimum 1 day apart
    if (departure - arrival < minimumTime) {
      return false;
    }
    return true;
  };

  // Function to handle the disabling of fields based on the transfer type
  const updateDateFields = () => {
    const transferType = document.getElementById("transfer-type").value;
    const arrivalField = document.getElementById("arrival-date");
    const departureField = document.getElementById("departure-date");

    // Enable both fields initially
    arrivalField.disabled = false;
    departureField.disabled = false;

    if (transferType === "To Hotel") {
      departureField.disabled = true; // Disable departure date
    } else if (transferType === "To Airport") {
      arrivalField.disabled = true; // Disable arrival date
    }
  };

  // Call the updateDateFields function on page load
  updateDateFields(); // Ensure fields are set correctly on load

  // Call the updateDateFields function when the transfer type changes
  document
    .getElementById("transfer-type")
    .addEventListener("change", updateDateFields);

  // Function to calculate the total price based on hotel and number of persons
  const calculatePrice = (hotel, adults, children) => {
    const totalAdults = adults + children; // Treat children as adults in terms of pricing

    if (hotelPrices[hotel]) {
      const { base, additional } = hotelPrices[hotel];
      return totalAdults <= 4 ? base : base + (totalAdults - 4) * additional;
    } else if (hotel === "Negril") {
      return negrilPrice.base + (totalAdults - 4) * negrilPrice.additional;
    } else if (hotel === "Runaway Bay") {
      return (
        runAwayBayPrice.base + (totalAdults - 4) * runAwayBayPrice.additional
      );
    } else if (hotel === "Ochi Rios") {
      return ochiRiosPrice.base + (totalAdults - 4) * ochiRiosPrice.additional;
    }
    return 0; // Fallback
  };

  // Function to handle booking for airport transfers or tours
  document.querySelectorAll(".booking-form .book-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();

      console.log("Book Now button clicked"); // Check if the event is firing

      const isTransferForm =
        button.closest("#airport-transfer-options") !== null;
      console.log("Is Airport Transfer Form:", isTransferForm); // Check if this part is working

      const formData = isTransferForm
        ? {
            type: "Airport Transfer",
            transferType: document.getElementById("transfer-type").value,
            adults: parseInt(document.getElementById("adults").value),
            children: parseInt(document.getElementById("children").value),
            infants: parseInt(document.getElementById("infants").value),
            hotel: document.getElementById("hotel").value,
            arrivalDate: document.getElementById("arrival-date").value,
            departureDate: document.getElementById("departure-date").value,
            airport: document.getElementById("airport").value,
            name: document.getElementById("name-tour").value, // Corrected ID
            phone: document.getElementById("phone-tour").value, // Corrected ID
            email: "", // Placeholder for email until user is authenticated
            totalPrice: 0, // Placeholder for price
          }
        : {
            type: "Tour",
            tour: document.getElementById("tour").value,
            tourDate: document.getElementById("tour-date").value,
            adults: document.getElementById("tour-adults").value,
            children: document.getElementById("tour-children").value,
            infants: document.getElementById("tour-infants").value,
            name: document.getElementById("name-tour").value, // Corrected ID
            phone: document.getElementById("phone-tour").value, // Corrected ID
            email: "", // Placeholder for email
          };

      // Check if required fields are filled
      if (!formData.name || !formData.phone) {
        alert("Please fill in all required fields.");
        return; // Prevent further processing
      }

      if (isTransferForm) {
        const { arrivalDate, departureDate, adults, hotel } = formData;

        // Validate dates if it's an airport transfer
        if (!validateDates(arrivalDate, departureDate)) {
          alert(
            "Please ensure that the arrival date is before the departure date and they are at least one day apart."
          );
          return;
        }

        // Calculate total price
        formData.totalPrice = calculatePrice(hotel, adults, formData.children);
      }

      console.log("Form Data:", formData); // Log the form data to check

      // Check if user is logged in
      const user = auth.currentUser;
      if (!user) {
        // User is not logged in, store data in localStorage and redirect
        localStorage.setItem("tempBooking", JSON.stringify(formData));
        alert("Please log in to continue with your booking.");
        window.location.href = "login.html"; // Redirect to your login page
      } else {
        // Save booking to Firestore
        try {
          await addDoc(collection(db, "bookings"), {
            uid: user.uid,
            ...formData,
            email: user.email, // Add user email
            createdAt: serverTimestamp(), // Add timestamp
            paymentStatus: "Incomplete", // Add paymentStatus to track payment
          });
          alert("Booking successfully created!");
          // Optionally redirect to a confirmation page or dashboard
        } catch (error) {
          console.error("Error saving booking: ", error);
        }
      }
    });
  });

  // Function to handle login (to be placed on your login page)
  const loginButton = document.getElementById("login-btn");
  if (loginButton) {
    loginButton.addEventListener("click", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const tempBooking = localStorage.getItem("tempBooking");
          if (tempBooking) {
            const bookingData = JSON.parse(tempBooking);
            try {
              await addDoc(collection(db, "bookings"), {
                uid: user.uid,
                ...bookingData,
                email: user.email, // Add user email
                createdAt: serverTimestamp(), // Add timestamp
                paymentStatus: "Incomplete", // Add paymentStatus to track payment
              });
              alert("Booking successfully restored!");
              localStorage.removeItem("tempBooking");
            } catch (error) {
              console.error("Error saving booking: ", error);
            }
          }
          window.location.href = "user-dashboard.html"; // Redirect to dashboard
        })
        .catch((error) => {
          console.error("Error logging in: ", error);
        });
    });
  }

  // Load bookings in the user dashboard
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const q = query(collection(db, "bookings"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log("Booking:", doc.data());
        // Display booking data on dashboard, including the createdAt field
      });
    }
  });
});

 // Handle form submission
 tourBookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Collect form data
  const formData = {
    tourName: tourNameDiv.value,
    tourDate: document.getElementById("tourDate").value,
    adults: parseInt(document.getElementById("adults").value),
    children: parseInt(document.getElementById("children").value),
    infants: parseInt(document.getElementById("infants").value),
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    specialRequests: document.getElementById("specialRequests").value,
    pickupLocation: document.getElementById("pickupLocation").value,
    timeSlot: document.getElementById("timeSlot").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    timestamp: new Date().toISOString(),
  };

  try {
    // Save data to Firebase (replace with your Firebase code if different)
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      await firebase
        .firestore()
        .collection("tourBookings")
        .add({
          userId,
          ...formData,
        });

      alert("Tour booked successfully!");
      modal.style.display = "none";
      tourBookingForm.reset(); // Reset form after submission
    } else {
      alert("Please log in to complete your booking.");
      // Redirect to login page or implement a login flow
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Error booking tour:", error);
    alert("Failed to book tour. Please try again later.");
  }
});