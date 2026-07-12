const assignTribe = require("../src/services/tribeAssignmentService");

const tests = [
  {
    name: "Neon Static",
    answers: {
      weekend: "Rooftop rave in Tokyo",
      colors: "Electric Purple & Chrome",
      shoes: "Chunky Sneakers",
      vacation: "Seoul Nightlife",
      room: "RGB Lights",
      accessory: "Layered Chains",
    },
  },
  {
    name: "Golden Hour",
    answers: {
      weekend: "Cozy café with a book",
      colors: "Cream & Sage",
      shoes: "Canvas Sandals",
      vacation: "Countryside Cottage",
      room: "Indoor Plants",
      accessory: "Delicate Necklace",
    },
  },
  {
    name: "Vault Heir",
    answers: {
      weekend: "Country Club Brunch",
      colors: "Navy & Camel",
      shoes: "Leather Loafers",
      vacation: "Swiss Alps Resort",
      room: "Minimal Luxury",
      accessory: "Luxury Watch",
    },
  },
];

for (const test of tests) {
  console.log(`\n${test.name}`);
  console.log(assignTribe(test.answers));
}