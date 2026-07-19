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
// const submitItem = async (req, res) => {
//   try {
//     const item = await submitItemService(
//       req.user.id,
//       req.body
//     );

//     // return res.status(201).json({
//     //   success: true,
//     //   message: "Item submitted successfully",
//     //   item,
//     // });
//     return res.status(201).json({
//   success: true,
//   message: "Item submitted successfully",
//   data: item,
// });
//   } catch (err) {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const submitItem = async (req, res) => {
  try {
    const data = await submitItemService(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Item submitted successfully",
      data,
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
// const getHistory = async (req, res) => {
//   try {
//     const items = await getHistoryService(req.user.id);

//     // return res.json({
//     //   success: true,
//     //   items,
//     // });
//     return res.status(200).json({
//   success: true,
//   data: items,
// });
//   } catch (err) {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const getHistory = async (req, res) => {
  try {
    const data = await getHistoryService(req.user.id);

    return res.status(200).json({
      success: true,
      data,
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
// const getVault = async (req, res) => {
//   try {
//     const items = await getVaultItems();

//     // return res.json({
//     //   success: true,
//     //   items,
//     // });
//     return res.status(200).json({
//   success: true,
//   data: items,
// });
//   } catch (err) {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const getVault = async (req, res) => {
  try {
    const data = await getVaultItems();

    return res.status(200).json({
      success: true,
      data,
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
// const checkoutCart = async (req, res) => {
//   try {
//     const { itemId } = req.body;

//     if (!itemId) {
//       return res.status(400).json({
//         success: false,
//         message: "Item ID is required",
//       });
//     }

//     const result = await purchaseItem(
//       req.user.id,
//       itemId
//     );

//     // return res.json({
//     //   success: true,
//     //   message: "Purchase successful",
//     //   ...result,
//     // });
//     return res.status(200).json({
//   success: true,
//   message: "Purchase successful",
//   data: result,
// });
//   } catch (err) {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const checkoutCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const data = await purchaseItem(
      req.user.id,
      itemId
    );

    return res.status(200).json({
      success: true,
      message: "Purchase successful",
      data,
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