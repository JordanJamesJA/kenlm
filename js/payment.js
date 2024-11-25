const stripe = Stripe(
  "pk_test_51QJL3IGjUyreWGVT0aJnfSGBQGvF9fH2ovnx9baa8c3vBFCV8YypVM4HuPPYijjjEsLj3HECILOL2cPKSeSMWBvW00gWGgkYzL"
);
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");
