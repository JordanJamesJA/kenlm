
document.addEventListener("DOMContentLoaded", () => {
  const tourCards = document.querySelectorAll(".tour-card");
  const modal = document.getElementById("tourBookingModal");
  const closeButton = document.querySelector(".close-button");
  const tourNameDiv = document.getElementById("tourName");
  const tourDescriptionDiv = document.getElementById("tourDescription"); 
  const tourPriceDiv = document.getElementById("tourPrice"); 
  const tourBookingForm = document.getElementById("tourBookingForm");

  
  const toursData = {
    ricksCafe: {
      name: "Rick’s Cafe, Negril",
      description:
        "Immerse yourself in the vibrant heart of Negril at Rick’s Cafe, a world-renowned spot famous for its breathtaking sunsets, thrilling cliff diving, and laid-back Caribbean vibe. Situated atop the stunning West End cliffs, Rick’s Cafe offers an unforgettable view of the shimmering blue waters, perfect for a sunset experience that you won’t want to miss. Whether you're diving into the crystal-clear waters or enjoying live reggae music with a refreshing cocktail in hand, Rick’s Cafe promises an exhilarating adventure followed by the calming serenity of the Caribbean night.",
      price: "$100 per person",
    },
    dunnsRiver: {
      name: "Dunn’s River Falls, Ocho Rios",
      description:
        "Climb the world-famous waterfalls of Dunn’s River Falls, a must-do for any visitor to Jamaica. This iconic waterfall stretches 600 feet and cascades down to the sea, offering a thrilling adventure where you can hike, wade, and climb the natural limestone steps. Experience the beauty of tropical foliage and crystal-clear waters as you make your way to the refreshing pools below.",
      price: "$80 per person",
    },
    ysFalls: {
      name: "Y’s Falls & Black River Safari, St. Elizabeth",
      description:
        "Discover the natural beauty of Y's Falls and embark on a scenic Black River Safari. The tour begins with a visit to the tranquil Y’s Falls, where you can swim in cool, clear pools beneath seven cascading waterfalls. Then, enjoy a safari boat ride along the Black River, where you'll have the chance to spot crocodiles and diverse wildlife in their natural habitat.",
      price: "$120 per person",
    },
    blueHole: {
      name: "Blue Hole, Ocho Rios",
      description:
        "Dive into adventure at the Blue Hole, one of Jamaica's hidden gems. This natural wonder features pristine waterfalls and crystal-clear turquoise waters, perfect for swimming, cliff jumping, and exploring underwater caves. The surrounding tropical rainforest offers a serene backdrop for a day of outdoor fun and relaxation.",
      price: "$90 per person",
    },
    bobMarleyMausoleum: {
      name: "Bob Marley Mausoleum, Nine Mile",
      description:
        "Pay your respects to reggae icon Bob Marley at the Bob Marley Mausoleum in Nine Mile. This cultural and historical landmark offers a glimpse into Marley’s life, legacy, and the Rastafarian movement. Explore the mausoleum, his childhood home, and the beautiful surroundings that inspired his music.",
      price: "$70 per person",
    },
    dolphinCove: {
      name: "Dolphin Cove, Ocho Rios",
      description:
        "Swim with dolphins and interact with other marine life at Dolphin Cove. This family-friendly attraction allows you to get up close with dolphins, stingrays, and other sea creatures in a safe and fun environment. Enjoy a day of adventure with opportunities to snorkel, kayak, and explore the surrounding tropical jungle.",
      price: "$150 per person",
    },
    luminousLagoon: {
      name: "Luminous Lagoon, Falmouth",
      description:
        "Experience the magical Luminous Lagoon, where the waters glow with a bioluminescent light at night. Take a boat tour of the lagoon and witness this incredible natural phenomenon. You may even have the chance to swim in the glowing waters for a unique and unforgettable experience.",
      price: "$50 per person",
    },
    raftingMarthaBrae: {
      name: "Rafting on the Martha Brae River, Falmouth",
      description:
        "Take a peaceful bamboo raft ride along the Martha Brae River, one of Jamaica’s most scenic rivers. Float through lush greenery, listen to the sounds of nature, and enjoy the tranquility of the Jamaican countryside. This tour offers the perfect combination of relaxation and natural beauty.",
      price: "$60 per person",
    },
    devonHouse: {
      name: "Devon House, Kingston",
      description:
        "Step back in time with a visit to Devon House, a historic mansion in Kingston. Learn about the architectural beauty and history of the house, once the home of Jamaica’s first millionaire, George Stiebel. While there, indulge in some of the island’s best ice cream and enjoy the surrounding gardens.",
      price: "$40 per person",
    },
    rocklandBirdSanctuary: {
      name: "Rockland Bird Sanctuary, St. James",
      description:
        "Explore the lush beauty of the Rockland Bird Sanctuary, a haven for Jamaica’s native bird species. Hand-feed hummingbirds and enjoy a peaceful walk through the sanctuary, learning about the local wildlife and flora. This is a must-see for nature lovers and birdwatching enthusiasts.",
      price: "$45 per person",
    },
  };

  
  tourCards.forEach((card) => {
    card.addEventListener("click", () => {
      const tourName = card.querySelector("h2").textContent;
      console.log("Tour Name:", tourName);
      tourNameDiv.textContent = tourName;

      
      const tourKey = Object.keys(toursData).find(
        (key) => toursData[key].name === tourName
      );
      if (tourKey) {
        const tour = toursData[tourKey];
        tourDescriptionDiv.textContent = tour.description; 
        tourPriceDiv.textContent = tour.price; 
      }

      modal.style.display = "flex";
    });
  });

  
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
