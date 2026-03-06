require("dotenv").config();
const express = require("express");
const cors = require("cors");

const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/api/auth", authRoutes);

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("GLOBAL SERVER ERROR:", err.stack || err);
    require('fs').appendFileSync('global_err.txt', "\nERROR: " + (err.stack || err));
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
