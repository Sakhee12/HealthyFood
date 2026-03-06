const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// All routes here are protected by adminMiddleware
router.use(adminMiddleware);

// User Management
router.get("/users", getAllUsers);
router.put("/update-role", updateUserRole);
router.delete("/delete-user/:id", deleteUser);

// Category Management
router.get("/categories", getAllCategories);
router.post("/categories/add", upload.single('image'), addCategory);
router.put("/categories/update/:id", upload.single('image'), updateCategory);
router.delete("/categories/delete/:id", deleteCategory);

// Order Management (Placeholders)
router.get("/orders", (req, res) => res.json([]));
router.put("/orders/update-status", (req, res) => res.json({ message: "Order status updated" }));

module.exports = router;
