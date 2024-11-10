// SHOW MENU
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggle.classList.toggle("show-icon");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  showMenu("nav-toggle", "nav-menu");

  // HERO SECTION ANIMATION
  animateElements();

  // Initial update of minimum dates
  updateMinDate(airportTransferDateInput);
  updateMinDate(tourDateInput);
});

// HIDDEN ELEMENTS
function animateElements() {
  var h1Element = document.querySelector(".back-drop h1");
  var pElements = document.querySelectorAll(".back-drop p");
  var buttonElements = document.querySelectorAll(".back-drop button");

  // Animation for h1
  setTimeout(function () {
    if (h1Element) {
      h1Element.style.opacity = "1";
      h1Element.style.transform = "translateY(0)";
    }
  }, 100);

  // Animation for paragraphs
  setTimeout(function () {
    pElements.forEach(function (pElement) {
      pElement.style.opacity = "1";
      pElement.style.transform = "translateY(0)";
    });
  }, 500);

  // Animation for buttons
  setTimeout(function () {
    buttonElements.forEach(function (buttonElement) {
      buttonElement.style.opacity = "1";
      buttonElement.style.transform = "translateY(0)";
    });
  }, 900);
}

// REVIEW SLIDER
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  grabCursor: true,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  speed: 1000,
});

// Booking Section (HERO)
const airportTransferTab = document.getElementById("airport-transfer-tab");
const tourTab = document.getElementById("tour-tab");
const airportTransferOptions = document.getElementById(
  "airport-transfer-options"
);
const tourOptions = document.getElementById("tour-options");
const airportTransferDateInput = document.getElementById(
  "airport-transfer-date"
);
const tourDateInput = document.getElementById("tour-date-input");

if (airportTransferTab && tourTab) {
  tourTab.addEventListener("click", function () {
    // Active class to tour options and remove from airport transfer options
    tourOptions.classList.add("active");
    airportTransferOptions.classList.remove("active");
    tourTab.classList.add("active");
    airportTransferTab.classList.remove("active");
  });

  airportTransferTab.addEventListener("click", function () {
    airportTransferOptions.classList.add("active");
    tourOptions.classList.remove("active");
    airportTransferTab.classList.add("active");
    tourTab.classList.remove("active");
  });
}

function updateMinDate(dateInput) {
  const currentDate = new Date();
  const minDate = new Date(currentDate);
  minDate.setDate(minDate.getDate() + 7);
  const year = minDate.getFullYear();
  const month = String(minDate.getMonth() + 1).padStart(2, "0");
  const day = String(minDate.getDate()).padStart(2, "0");
  const formattedMinDate = `${year}-${month}-${day}`;

  if (dateInput) {
    dateInput.min = formattedMinDate;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("airport-transfer-tab")
    ?.addEventListener("click", function () {
      updateMinDate(airportTransferDateInput);
    });

  document.getElementById("tour-tab")?.addEventListener("click", function () {
    updateMinDate(tourDateInput);
  });
});

function showForm(formId) {
  // Hide all forms
  document
    .querySelectorAll(".booking-form")
    .forEach((form) => form.classList.remove("active"));

  // Show the selected form
  document.getElementById(formId).classList.add("active");

  // Remove active class from all tabs
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));

  // Add active class to the clicked tab
  if (formId === "airport-transfer-options") {
    document.getElementById("airport-transfer-tab").classList.add("active");
  } else {
    document.getElementById("tour-booking-tab").classList.add("active");
  }
}

// Initially show the Airport Transfer form
document.getElementById("airport-transfer-tab").classList.add("active");
