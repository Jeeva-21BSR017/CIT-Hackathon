const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Access Denied" });

    // Extract token from "Bearer <token>"
    const token = authHeader.replace("Bearer ", "");
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;  // Store user ID in request object
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
