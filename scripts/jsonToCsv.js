const createCsvWriter =
require("csv-writer").createObjectCsvWriter;

const products =
require("./output/cleanProducts.json");

const csvWriter = createCsvWriter({

    path: "./scripts/output/products.csv",

    header: [

        { id: "myntra_id", title: "myntra_id" },

        { id: "brand", title: "brand" },

        { id: "name", title: "name" },

        { id: "full_name", title: "full_name" },

        { id: "price", title: "price" },

        { id: "rating", title: "rating" },

        { id: "discount", title: "discount" },

        { id: "image_url", title: "image_url" },

        { id: "product_url", title: "product_url" },

        { id: "category", title: "category" },

        { id: "slot", title: "slot" },

        { id: "gender", title: "gender" },

        { id: "color", title: "color" },

        { id: "primary_tribe_id", title: "primary_tribe_id" }

    ]

});

csvWriter.writeRecords(products)
.then(() => {

    console.log("CSV Created Successfully");

});