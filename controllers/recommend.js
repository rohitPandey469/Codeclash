const API_KEY = process.env.API_KEY;
const axios = require("axios");

const getPlaceDetails = async (placeName) => {
  try {
    const apiKey = API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      placeName
    )}&inputtype=textquery&fields=name,formatted_address,rating,price_level,user_ratings_total,photos,opening_hours&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    console.log("Response", response);
    if (response.data.status === "OK") {
      const placeDetails = response.data.candidates[0];
      console.log("Place Details", placeDetails);
      return {
        name: placeDetails?.name,
        address: placeDetails?.formatted_address,
        rating: placeDetails?.rating,
        priceLevel: placeDetails?.price_level,
        totalRatings: placeDetails?.user_ratings_total,
        openingHours: placeDetails?.opening_hours,
        photos: placeDetails?.photos,
      };
    } else if (response.data.status === "ZERO_RESULTS") {
      console.log("No place details found for", placeName);
      return null;
    } else {
      throw new Error("Place details not found");
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
};

const getRecommendations = async (req, res) => {
  console.log("Get recoomendations", req.body);
  const { persons, budget, days } = req.body;
  const maxi = budget / (persons * days);
  const places = [
    { name: "Washington", minBudget: 5000 },
    { name: "Mumbai", minBudget: 15000 },
    { name: "Goa", minBudget: 11000 },
    { name: "San Francisco", minBudget: 25000 },
    { name: "Kanpur", minBudget: 12000 },
    { name: "Kolkata", minBudget: 9000 },
    { name: "Hawaii", minBudget: 25000 },
    { name: "Pune", minBudget: 2000 },
  ];

  const filteredPlaces = places
    .filter((place) => maxi >= place.minBudget)
    .map(({ name }) => name);

  const result = [];
  for (const placeName of filteredPlaces) {
    const details = await getPlaceDetails(placeName);
    result.push(details);
  }

  res.status(200).json(result);
};

module.exports = {
  getRecommendations,
};
