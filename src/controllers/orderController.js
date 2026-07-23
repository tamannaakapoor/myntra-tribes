const supabase = require("../config/supabase");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      items,
      subtotal,
      discount,
      total,
      points_earned,
      points_used,
      payment_method,
      shipping_address,
    } = req.body;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        items,
        subtotal,
        discount,
        total,
        points_earned,
        points_used,
        payment_method,
        shipping_address,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Fetch current points
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    const currentPoints = profile.points || 0;

    const newPoints =
      currentPoints - points_used + points_earned;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        points: newPoints,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      new_points_balance: newPoints,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        items,
        total,
        points_earned,
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      orders: data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  createOrder,
    getUserOrders,

};