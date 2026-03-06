const Product = require("../models/productModel");

// Get all products
exports.getAllProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(products);
    });
};

// Add a new product
exports.addProduct = (req, res) => {
    const data = req.body;
    if (req.file) {
        data.image_url = `/uploads/${req.file.filename}`;
    }
    // Assume created_by comes from the authenticated admin user if available, otherwise default it or leave null
    data.created_by = req.user ? req.user.id : null;

    Product.create(data, (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            require('fs').appendFileSync('db_err.txt', JSON.stringify(err) + '\n' + err.message + '\n');
            return res.status(500).json({ message: "DB error", error: err });
        }
        res.json({ message: "Product added successfully", id: result.insertId });
    });
};

// Update product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
        data.image_url = `/uploads/${req.file.filename}`;
    }
    data.created_by = req.user ? req.user.id : null; // Optionally update created_by or ignore

    Product.update(id, data, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Product updated successfully" });
    });
};

// Delete product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    Product.delete(id, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Product deleted successfully" });
    });
};
