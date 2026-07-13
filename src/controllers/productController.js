const productService = require("../services/productService");
const supabase = require("../config/supabase");

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      tribe,
      category,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    let result;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    if (tribe) {
      const { data: tribeData, error } = await supabase
        .from("tribes")
        .select("id")
        .eq("slug", tribe)
        .single();

      if (error || !tribeData) {
        return res.status(404).json({
          success: false,
          message: "Tribe not found",
        });
      }

      result = await productService.getProductsByTribe(
        tribeData.id,
        pageNumber,
        pageSize
      );
    }

    else if (category) {
      result = await productService.getProductsByCategory(
        category,
        pageNumber,
        pageSize
      );
    }

    else if (search) {
      result = await productService.searchProducts(
        search,
        pageNumber,
        pageSize
      );
    }

    else {
      result = await productService.getProducts(
        pageNumber,
        pageSize
      );
    }

    if (result.error) throw result.error;

    return res.status(200).json({
      success: true,

      page: pageNumber,

      limit: pageSize,

      totalProducts: result.count,

      totalPages: Math.ceil(result.count / pageSize),

      count: result.data.length,

      products: result.data,
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
  getProducts,
};