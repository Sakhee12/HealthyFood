const db = require("../config/db");

const Product = {
    // Create product
    create: (data, callback) => {
        const sql = "INSERT INTO products (product_name, category_id, price, stock, description, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [
            data.product_name,
            data.category_id || null,
            data.price || 0.00,
            data.stock || 0,
            data.description || null,
            data.image_url || null,
            data.created_by || null
        ], callback);
    },

    // Get all products
    getAll: (callback) => {
        // Optional: Join with categories to get category name
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `;
        db.query(sql, callback);
    },

    // Update product
    update: (id, data, callback) => {
        const sql = "UPDATE products SET product_name = ?, category_id = ?, price = ?, stock = ?, description = ?, image_url = ?, created_by = ? WHERE id = ?";
        db.query(sql, [
            data.product_name,
            data.category_id || null,
            data.price || 0.00,
            data.stock || 0,
            data.description || null,
            data.image_url || null,
            data.created_by || null,
            id
        ], callback);
    },

    // Delete product
    delete: (id, callback) => {
        db.query("DELETE FROM products WHERE id = ?", [id], callback);
    }
};

module.exports = Product;
