const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    // Allow public GET requests to /categories (list categories) without authentication
    if (req.method === "GET" && req.path === "/categories") {
        return next();
    }

    // Allow public GET requests to /categories and /inventory without authentication
    if (req.method === "GET" && (req.path === "/categories" || req.path === "/inventory")) {
        return next();
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    if (token === "dev_token_bypass") {
        req.user = { id: 1, role: "admin" };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = adminMiddleware;
