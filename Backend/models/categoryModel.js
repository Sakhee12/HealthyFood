const db = require("../config/db");

const Category = {
    create: (data, callback) => {
        const sql = "INSERT INTO categories (name, slug, description, image_url, parent_id, status) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [
            data.name,
            data.slug || null,
            data.description || null,
            data.image_url || null,
            data.parent_id || null,
            data.status !== undefined ? data.status : 1
        ], callback);
    },

    // Get all categories
    getAll: (callback) => {
        db.query("SELECT * FROM categories", callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ?, parent_id = ?, status = ? WHERE id = ?";
        db.query(sql, [
            data.name,
            data.slug || null,
            data.description || null,
            data.image_url || null,
            data.parent_id || null,
            data.status !== undefined ? data.status : 1,
            id
        ], callback);
    },

    // Delete category
    delete: (id, callback) => {
        db.query("DELETE FROM categories WHERE id = ?", [id], callback);
    },

    // Insert default categories (bulk)
    insertDefaultCategories: (callback) => {
        const categories = [
            ["Zero Sugar Drinks", "", ""],
            ["Sachet / Small Packs", "", ""],
            ["Eco Pack Drinks", "", ""],
            ["Khajur (Dates)", "", ""],
            ["Dry Fruits", "", ""],
            ["Seeds & Nuts", "", ""],
            ["Healthy Nuggets / Bites", "", ""],
            ["Healthy Breakfast", "", ""],
            ["Papad", "", ""],
            ["Ghee (Tup)", "", ""],
            ["Wooden Cold Pressed Oils", "", ""],
            ["Chutney", "", ""],
            ["Healthy Kurkure / Puffs", "", ""],
            ["Kadak Bhakari", "", ""],
            ["Makhana", "", ""],
            ["Healthy Cookies", "", ""],
            ["Fruit Juice", "", ""],
        ];

        const sql = "INSERT INTO categories (name, description, image_url) VALUES ?";
        db.query(sql, [categories], callback);
    },
};

module.exports = Category;
