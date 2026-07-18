// const {
//   submitItem,
//   getHistory,
//   getVaultItems,
//   purchaseItem,
// } = require("../services/gelaphaService");
const {
  submitItem: submitItemService,
  getHistory: getHistoryService,
  getVaultItems,
  purchaseItem,
} = require("../services/gelaphaService");
// ==========================
// Submit Item
// ==========================
const submitItem = async (req, res) => {
  try {
    const item = await submitItemService(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Item submitted successfully",
      item,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// Get History
// ==========================
const getHistory = async (req, res) => {
  try {
    const items = await getHistoryService(req.user.id);

    return res.json({
      success: true,
      items,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================
// Get Vault
// ==========================
const getVault = async (req, res) => {
  try {
    const items = await getVaultItems();

    return res.json({
      success: true,
      items,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// Purchase
// ==========================
const checkoutCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const result = await purchaseItem(
      req.user.id,
      itemId
    );

    return res.json({
      success: true,
      message: "Purchase successful",
      ...result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
    submitItem,
    getHistory,
    getVault,
    checkoutCart,
};