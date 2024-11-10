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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  sendEmail();
});

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

