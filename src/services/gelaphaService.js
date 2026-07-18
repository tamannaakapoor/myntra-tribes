const supabase = require("../config/supabase");

// ==========================
// Submit Item
// ==========================
const submitItem = async (userId, itemData) => {
  const {
    itemName,
    category,
    description,
    imageUrl,
    frequencyUsed = 1,
  } = itemData;

  if (!itemName) throw new Error("Item name is required");
  if (!category) throw new Error("Category is required");
  if (!imageUrl) throw new Error("Image is required");

  const freq = Math.max(1, Number(frequencyUsed));

  // Reward formula
  const estimatedPoints = Math.max(80, 400 - freq * 40);

  const { data, error } = await supabase
    .from("gelapha_items")
    .insert({
      user_id: userId,
      item_name: itemName,
      category,
      description,
      frequency_used: freq,
      image_url: imageUrl,
      estimated_points: estimatedPoints,
      status: "Pending",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ==========================
// Get User History
// ==========================
const getHistory = async (userId) => {
  const { data, error } = await supabase
    .from("gelapha_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
};
// ==========================
// Get Thrift Vault
// ==========================
// const getVaultItems = async () => {
//   const { data, error } = await supabase
//     .from("gelapha_items")
//     .select("*")
//     .eq("status", "Approved")
//     .order("created_at", { ascending: false });

//   if (error) throw error;

//   return data;
// };
const getVaultItems = async () => {
  const { data, error } = await supabase
    .from("gelapha_items")
    .select("*")
    .eq("status", "Approved")
    .is("buyer_id", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};
// ==========================
// Purchase Item
// ==========================
// const purchaseItem = async (userId, itemId) => {
//   // Get item
//   const { data: item, error: itemError } = await supabase
//     .from("gelapha_items")
//     .select("*")
//     .eq("id", itemId)
//     .eq("status", "Approved")
//     .single();

//   if (itemError || !item) {
//     throw new Error("Item not found");
//   }

//   // Get user points
//   const { data: profile, error: profileError } = await supabase
//     .from("profiles")
//     .select("tribe_points")
//     .eq("id", userId)
//     .single();

//   if (profileError) throw profileError;

//   if (profile.tribe_points < item.estimated_points) {
//     throw new Error("Insufficient Tribe Points");
//   }

//   const remainingPoints =
//     profile.tribe_points - item.estimated_points;

//   // Update user points
//   const { error: updateError } = await supabase
//     .from("profiles")
//     .update({
//       tribe_points: remainingPoints,
//     })
//     .eq("id", userId);

//   if (updateError) throw updateError;

//   // Save purchase
//   const { error: purchaseError } = await supabase
//     .from("gelapha_purchases")
//     .insert({
//       user_id: userId,
//       item_id: item.id,
//       points_spent: item.estimated_points,
//     });

//   if (purchaseError) throw purchaseError;

//   return {
//     purchasedItem: item,
//     remainingPoints,
//   };
// };
const purchaseItem = async (userId, itemId) => {
  // Get item
  const { data: item, error: itemError } = await supabase
    .from("gelapha_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (itemError || !item) {
    throw new Error("Item not found");
  }

  if (item.status !== "Approved") {
    throw new Error("Item is no longer available");
  }

  // Prevent buying your own item
  if (item.user_id === userId) {
    throw new Error("You cannot purchase your own item");
  }

  // Fetch buyer points
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tribe_points")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;

  if (profile.tribe_points < item.estimated_points) {
    throw new Error("Insufficient Tribe Points");
  }

  const remainingPoints =
    profile.tribe_points - item.estimated_points;

  // Deduct points
  const { error: updatePointsError } = await supabase
    .from("profiles")
    .update({
      tribe_points: remainingPoints,
    })
    .eq("id", userId);

  if (updatePointsError) throw updatePointsError;

  // Mark item sold
  const { error: soldError } = await supabase
    .from("gelapha_items")
    .update({
      status: "Sold",
      buyer_id: userId,
      sold_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("status", "Approved");

  if (soldError) throw soldError;

  // Record purchase history
  const { error: purchaseError } = await supabase
    .from("gelapha_purchases")
    .insert({
      user_id: userId,
      item_id: itemId,
      points_spent: item.estimated_points,
    });

  if (purchaseError) throw purchaseError;

  return {
    purchasedItem: item,
    remainingPoints,
  };
};
module.exports = {
  submitItem,
  getHistory,
  getVaultItems,
  purchaseItem,
};