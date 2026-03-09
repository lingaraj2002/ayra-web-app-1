const router = require("express").Router();
const controller = require("../controllers/product.controller");
const adminController = require("../controllers/admin.controller");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload.middleware");

// Admin login
router.post("/admin/login", adminController.adminLogin);
// Create product with image uploads (thumbnail and multiple images)
router.post(
  "/admin/products",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  controller.createProduct,
);

// Update product with optional image uploads
// router.put("/products/:id", adminAuth, upload, controller.updateProduct);

router.delete("/products/:id", adminAuth, controller.deleteProduct);
router.patch(
  "/products/:id/available",
  adminAuth,
  controller.updateAvailability,
);

module.exports = router;
