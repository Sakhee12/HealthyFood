const User = require("../models/userModel");
const Category = require("../models/categoryModel");

// Get all users
exports.getAllUsers = (req, res) => {
    User.getAll((err, users) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(users);
    });
};

// Update user role
// ... (existing code)

// Category Management
exports.getAllCategories = (req, res) => {
    Category.getAll((err, categories) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(categories);
    });
};

exports.addCategory = (req, res) => {
    const data = req.body;
    if (req.file) {
        data.image_url = `/uploads/${req.file.filename}`;
    }
    Category.create(data, (err, result) => {
        if (err) {
            console.error("Category DB Error:", err);
            require('fs').appendFileSync('db_err_category.txt', JSON.stringify(err) + '\n');
            return res.status(500).json({ message: "DB error", error: err });
        }
        res.json({ message: "Category added successfully", id: result.insertId });
    });
};

exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
        // If there's a new file, update image_url. If not, whatever is in data.image_url remains.
        data.image_url = `/uploads/${req.file.filename}`;
    }
    Category.update(id, data, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Category updated successfully" });
    });
};

exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    Category.delete(id, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Category deleted successfully" });
    });
};

// Update user role
exports.updateUserRole = (req, res) => {
    const { id, role } = req.body;
    const db = require("../config/db");

    db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: "DB error", error: err });
            res.json({ message: "User role updated successfully" });
        }
    );
};

// Delete user
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const db = require("../config/db");

    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "User deleted successfully" });
    });
};
