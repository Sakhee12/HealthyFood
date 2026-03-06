const express = require("express");
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// All routes here are protected by adminMiddleware
router.use(adminMiddleware);

router.get("/", getAllProducts);
router.post("/add", upload.single('image'), addProduct);
router.put("/update/:id", upload.single('image'), updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
