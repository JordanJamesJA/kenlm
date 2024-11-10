const functions = require("firebase-functions");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51QJL3IGjUyreWGVTsm3s2aaKsgfjtvcgInpk8ZknjZKugmuL8xRUg7obXRQ8bwz4pPjwIViyTXqJuR5gzHSNWZWb00mDmjv8zy"
);

const toursData = {
  ricksCafe: {
    name: "Rick’s Cafe, Negril",
    price: 10000, // $100.00 in cents
    currency: "usd",
  },
  dunnsRiver: {
    name: "Dunn’s River Falls, Ocho Rios",
    price: 8000, // $80.00 in cents
    currency: "usd",
  },
  ysFalls: {
    name: "Y’s Falls & Black River Safari, St. Elizabeth",
    price: 12000, // $120.00 in cents
    currency: "usd",
  },
  blueHole: {
    name: "Blue Hole, Ocho Rios",
    price: 9000, // $90.00 in cents
    currency: "usd",
  },
  bobMarleyMausoleum: {
    name: "Bob Marley Mausoleum, Nine Mile",
    price: 7000, // $70.00 in cents
    currency: "usd",
  },
  dolphinCove: {
    name: "Dolphin Cove, Ocho Rios",
    price: 15000, // $150.00 in cents
    currency: "usd",
  },
  luminousLagoon: {
    name: "Luminous Lagoon, Falmouth",
    price: 5000, // $50.00 in cents
    currency: "usd",
  },
  raftingMarthaBrae: {
    name: "Rafting on the Martha Brae River, Falmouth",
    price: 6000, // $60.00 in cents
    currency: "usd",
  },
  devonHouse: {
    name: "Devon House, Kingston",
    price: 4000, // $40.00 in cents
    currency: "usd",
  },
  rocklandBirdSanctuary: {
    name: "Rockland Bird Sanctuary, St. James",
    price: 4500, // $45.00 in cents
    currency: "usd",
  },
};

const app = require("express")();
const corsOptions = {
  origin: true, // Allow all origins; you can specify a specific origin here
};
app.use(cors(corsOptions));

// Firebase Cloud Function to create a Stripe Checkout session
app.post("/create-checkout-session", async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:5000"; // Update this to your production URL

  try {
    // Extracting selected tours from the request body
    const { selectedTours } = req.body;

    if (
      !selectedTours ||
      !Array.isArray(selectedTours) ||
      selectedTours.length === 0
    ) {
      return res.status(400).json({ error: "No tours selected" });
    }

    // Map the selected tours to line items for Stripe
    const lineItems = selectedTours.map((tourKey) => {
      const tour = toursData[tourKey];

      if (!tour) {
        throw new Error(`Tour with key "${tourKey}" not found`);
      }

      return {
        price_data: {
          currency: tour.currency,
          product_data: {
            name: tour.name,
          },
          unit_amount: tour.price,
        },
        quantity: 1,
      };
    });

    // Create the checkout session with dynamic line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.createCheckoutSession = functions.https.onRequest(app)