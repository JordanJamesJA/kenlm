const functions = require("firebase-functions");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51QJL3IGjUyreWGVTsm3s2aaKsgfjtvcgInpk8ZknjZKugmuL8xRUg7obXRQ8bwz4pPjwIViyTXqJuR5gzHSNWZWb00mDmjv8zy"
);

const toursData = {
  ricksCafe: {
    name: "Rick’s Cafe, Negril",
    price: 10000, 
    currency: "usd",
  },
  dunnsRiver: {
    name: "Dunn’s River Falls, Ocho Rios",
    price: 8000, 
    currency: "usd",
  },
  ysFalls: {
    name: "Y’s Falls & Black River Safari, St. Elizabeth",
    price: 12000, 
    currency: "usd",
  },
  blueHole: {
    name: "Blue Hole, Ocho Rios",
    price: 9000, 
    currency: "usd",
  },
  bobMarleyMausoleum: {
    name: "Bob Marley Mausoleum, Nine Mile",
    price: 7000, 
    currency: "usd",
  },
  dolphinCove: {
    name: "Dolphin Cove, Ocho Rios",
    price: 15000, 
    currency: "usd",
  },
  luminousLagoon: {
    name: "Luminous Lagoon, Falmouth",
    price: 5000, 
    currency: "usd",
  },
  raftingMarthaBrae: {
    name: "Rafting on the Martha Brae River, Falmouth",
    price: 6000, 
    currency: "usd",
  },
  devonHouse: {
    name: "Devon House, Kingston",
    price: 4000, 
    currency: "usd",
  },
  rocklandBirdSanctuary: {
    name: "Rockland Bird Sanctuary, St. James",
    price: 4500, 
    currency: "usd",
  },
};

const app = require("express")();
const corsOptions = {
  origin: true, 
};
app.use(cors(corsOptions));


app.post("/create-checkout-session", async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:5000"; 

  try {
    
    const { selectedTours } = req.body;

    if (
      !selectedTours ||
      !Array.isArray(selectedTours) ||
      selectedTours.length === 0
    ) {
      return res.status(400).json({ error: "No tours selected" });
    }

    
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