const db = require("../config/db");

const User = {
  create: (data, callback) => {
    db.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [
        data.name,
        data.email,
        data.phone,
        data.password,
        data.role || "customer",
      ],
      callback,
    );
  },
  findByPhone: (phone, callback) => {
    db.query("SELECT * FROM users WHERE phone=?", [phone], callback);
  },
  findById: (id, callback) => {
    db.query("SELECT * FROM users WHERE id=?", [id], callback);
  },
  getAll: (callback) => {
    db.query("SELECT * FROM users", callback);
  },
};

module.exports = User;
