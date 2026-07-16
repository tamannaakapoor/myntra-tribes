// const scoringMatrix = {
//   weekend: {
//     "Rooftop rave in Tokyo": {
//       "Neon Static": 5,
//       "Golden Hour": 1,
//       "Vault Heir": 0,
//     },
//     "Cozy café morning": {
//       "Golden Hour": 5,
//       "Vault Heir": 2,
//       "Neon Static": 0,
//     },
//     "Country club brunch": {
//       "Vault Heir": 5,
//       "Golden Hour": 1,
//       "Neon Static": 0,
//     },
//   },

//   colors: {
//     "Electric Purple & Chrome": {
//       "Neon Static": 5,
//     },
//     "Cream & Sage": {
//       "Golden Hour": 5,
//     },
//     "Navy & Camel": {
//       "Vault Heir": 5,
//     },
//   },

//   shoes: {
//     "Chunky Sneakers": {
//       "Neon Static": 5,
//     },
//     "Canvas Sandals": {
//       "Golden Hour": 5,
//     },
//     "Leather Loafers": {
//       "Vault Heir": 5,
//     },
//   },

//   vacation: {
//     "Seoul Nightlife": {
//       "Neon Static": 5,
//     },
//     "Swiss Countryside": {
//       "Golden Hour": 5,
//     },
//     "Italian Riviera": {
//       "Vault Heir": 5,
//     },
//   },

//   room: {
//     "RGB Lights": {
//       "Neon Static": 5,
//     },
//     "Vintage Books": {
//       "Golden Hour": 5,
//     },
//     "Luxury Hotel": {
//       "Vault Heir": 5,
//     },
//   },

//   accessory: {
//     "Layered Chains": {
//       "Neon Static": 5,
//     },
//     "Floral Earrings": {
//       "Golden Hour": 5,
//     },
//     "Classic Watch": {
//       "Vault Heir": 5,
//     },
//   },
// };

// function assignTribe(answers) {
//   const scores = {
//     "Neon Static": 0,
//     "Golden Hour": 0,
//     "Vault Heir": 0,
//   };

//   for (const question in answers) {
//     const answer = answers[question];

//     const mapping = scoringMatrix[question]?.[answer];

//     if (!mapping) continue;

//     for (const tribe in mapping) {
//       scores[tribe] += mapping[tribe];
//     }
//   }

//   let assigned = "";
//   let maxScore = -1;

//   for (const tribe in scores) {
//     if (scores[tribe] > maxScore) {
//       maxScore = scores[tribe];
//       assigned = tribe;
//     }
//   }

//   return {
//     assigned,
//     scores,
//   };
// }

// module.exports = assignTribe;

const scoringMatrix = {
  weekend: {
    "Rooftop rave in Tokyo": {
      "Neon Static": 5,
      "Golden Hour": 1,
      "Vault Heir": 0,
    },
    "Cozy café morning": {
      "Golden Hour": 5,
      "Vault Heir": 2,
      "Neon Static": 0,
    },
    "Country club brunch": {
      "Vault Heir": 5,
      "Golden Hour": 1,
      "Neon Static": 0,
    },
  },

  colors: {
    "Electric Purple & Chrome": {
      "Neon Static": 5,
    },
    "Cream & Sage": {
      "Golden Hour": 5,
    },
    "Navy & Camel": {
      "Vault Heir": 5,
    },
  },

  shoes: {
    "Chunky Sneakers": {
      "Neon Static": 5,
    },
    "Canvas Sandals": {
      "Golden Hour": 5,
    },
    "Leather Loafers": {
      "Vault Heir": 5,
    },
  },

  vacation: {
    "Seoul Nightlife": {
      "Neon Static": 5,
    },
    "Swiss Countryside": {
      "Golden Hour": 5,
    },
    "Italian Riviera": {
      "Vault Heir": 5,
    },
  },

  room: {
    "RGB Lights": {
      "Neon Static": 5,
    },
    "Vintage Books": {
      "Golden Hour": 5,
    },
    "Luxury Hotel": {
      "Vault Heir": 5,
    },
  },

  accessory: {
    "Layered Chains": {
      "Neon Static": 5,
    },
    "Floral Earrings": {
      "Golden Hour": 5,
    },
    "Classic Watch": {
      "Vault Heir": 5,
    },
  },
};

function assignTribe(answers) {
  const scores = {
    "Neon Static": 0,
    "Golden Hour": 0,
    "Vault Heir": 0,
  };

  for (const question in answers) {
    const answer = answers[question];

    const mapping = scoringMatrix[question]?.[answer];

    if (!mapping) continue;

    for (const tribe in mapping) {
      scores[tribe] += mapping[tribe];
    }
  }

  let assigned = "";
  let maxScore = -1;

  for (const tribe in scores) {
    if (scores[tribe] > maxScore) {
      maxScore = scores[tribe];
      assigned = tribe;
    }
  }

  return {
    assigned,
    scores,
  };
}

module.exports = assignTribe;