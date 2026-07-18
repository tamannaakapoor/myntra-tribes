
const assignTribe = require("../services/tribeAssignmentService");
const supabase = require("../config/supabase");
const { addPoints } = require("../services/pointService");
// POST /api/tribes/assign
const assignUserTribe = async (req, res) => {
  try {
    // await addPoints(req.user.id, 50);
//     const answers = req.body;

//     // Validate required quiz fields
//     const requiredFields = [
//       "weekend",
//       "colors",
//       "shoes",
//       "vacation",
//       "room",
//       "accessory",
//     ];

   
//     const validOptions = {
//   weekend: [
//     "Rooftop rave in Tokyo",
//     "Cozy café with a book",
//     "Country Club Brunch"
//   ],

//   colors: [
//     "Electric Purple & Chrome",
//     "Cream & Sage",
//     "Navy & Camel"
//   ],

//   shoes: [
//     "Chunky Sneakers",
//     "Canvas Sandals",
//     "Leather Loafers"
//   ],

//   vacation: [
//     "Seoul Nightlife",
//     "Countryside Cottage",
//     "Swiss Alps Resort"
//   ],

//   room: [
//     "RGB Lights",
//     "Indoor Plants",
//     "Minimal Luxury"
//   ],

//   accessory: [
//     "Layered Chains",
//     "Delicate Necklace",
//     "Luxury Watch"
//   ]
// };

// for (const field of Object.keys(validOptions)) {

//     if (!validOptions[field].includes(answers[field])) {

//         return res.status(400).json({
//             success: false,
//             message: `Invalid value for ${field}`
//         });

//     }

// }
//     // Calculate tribe
//     const result = assignTribe(answers);
const answers = req.body;

// If frontend sends { answers: {...} }, unwrap it
const payload = answers.answers || answers;

const requiredFields = [
  "weekend",
  "colors",
  "shoes",
  "vacation",
  "room",
  "accessory",
];

for (const field of requiredFields) {
  if (!payload[field]) {
    return res.status(400).json({
      success: false,
      message: `Missing field: ${field}`,
    });
  }
}

// Normalize frontend values to backend values
const answerMap = {
  weekend: {
    "rooftop rave in tokyo": "Rooftop rave in Tokyo",
    "cozy café with a book": "Cozy café with a book",
    "cozy cafe with a book": "Cozy café with a book",
    "country club brunch": "Country Club Brunch",
  },

  colors: {
    "electric purple & chrome": "Electric Purple & Chrome",
    "cream & sage": "Cream & Sage",
    "navy & camel": "Navy & Camel",
  },

  shoes: {
    "chunky sneakers": "Chunky Sneakers",
    "canvas sandals": "Canvas Sandals",
    "leather loafers": "Leather Loafers",
  },

  vacation: {
    "seoul nightlife": "Seoul Nightlife",
    "countryside cottage": "Countryside Cottage",
    "swiss alps resort": "Swiss Alps Resort",
  },

  room: {
    "rgb lights": "RGB Lights",
    "indoor plants": "Indoor Plants",
    "minimal luxury": "Minimal Luxury",
  },

  accessory: {
    "layered chains": "Layered Chains",
    "delicate necklace": "Delicate Necklace",
    "luxury watch": "Luxury Watch",
  },
};

const normalizedAnswers = {};

for (const field of requiredFields) {
  const value = String(payload[field]).trim().toLowerCase();

  if (!answerMap[field][value]) {
    console.log("Received:", payload);

    return res.status(400).json({
      success: false,
      message: `Invalid value for ${field}`,
      received: payload[field],
      expected: Object.values(answerMap[field]),
    });
  }

  normalizedAnswers[field] = answerMap[field][value];
}

// Use normalized answers from here onwards
const result = assignTribe(normalizedAnswers);
    // Fetch tribe details
    const { data: tribeData, error } = await supabase
      .from("tribes")
      .select("*")
      .eq("name", result.assigned)
      .single();

    if (error || !tribeData) {
      return res.status(404).json({
        success: false,
        message: "Assigned tribe not found.",
      });
    }

    return res.status(200).json({

    success: true,

    message: "Tribe Assigned Successfully",

    onboarding: {

        tribe: {

            id: tribeData.id,

            name: tribeData.name,

            slug: tribeData.slug,

            description: tribeData.description

        },

        theme: tribeData.theme_config,

        colors: {

            primary: tribeData.primary_color,

            secondary: tribeData.secondary_color

        }

    },

    scores: result.scores

});

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// GET /api/tribes
const getAllTribes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tribes")
      .select("*")
      .order("name");

    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: data.length,
      tribes: data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tribes",
      error: err.message,
    });
  }
};

// GET /api/tribes/:slug
const getSingleTribe = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("tribes")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Tribe not found",
      });
    }

    return res.status(200).json({
      success: true,
      tribe: data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tribe",
      error: err.message,
    });
  }
};

// GET /api/tribes/:slug/products
const getTribeProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find tribe
    const { data: tribe, error: tribeError } = await supabase
      .from("tribes")
      .select("id,name")
      .eq("slug", slug)
      .single();

    if (tribeError || !tribe) {
      return res.status(404).json({
        success: false,
        message: "Tribe not found",
      });
    }

    // Fetch products
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("primary_tribe_id", tribe.id);

    if (productError) throw productError;

    return res.status(200).json({
      success: true,
      tribe: tribe.name,
      count: products.length,
      products,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

module.exports = {
  assignUserTribe,
  getAllTribes,
  getSingleTribe,
  getTribeProducts,
};