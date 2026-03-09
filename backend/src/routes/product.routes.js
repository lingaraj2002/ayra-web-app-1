const router = require("express").Router();
const controller = require("../controllers/product.controller");

router.get("/products", controller.getProducts);
router.get("/products/search", controller.getSearchProducts); // Must come before /products/:id
router.get("/product/:id", controller.getProductById);
router.get("/images/:id", controller.getImage); // Route to serve images from GridFS

module.exports = router;
