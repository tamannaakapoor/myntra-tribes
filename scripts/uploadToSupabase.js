require("dotenv").config();

const supabase =
require("../src/config/supabase");

const products =
require("./output/cleanProducts.json");

(async () => {

    console.log(`Uploading ${products.length} products...`);

    const { error } = await supabase
        .from("products")
        .insert(products);

    if (error) {

        console.log(error);

    } else {

        console.log("Upload Successful");

    }

})();