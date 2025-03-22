const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    try {
        const token = req.headers["authtoken"]; // Retrieve token from headers
        console.log("🔹 Received Token:", token); // Debugging

        if (!token) {
            console.warn("❌ No Token Found");
            return res.status(401).json({ msg: "กรุณาเข้าสู่ระบบ" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("✅ Decoded Token:", decoded); // Debugging

        req.user = decoded; // Attach decoded user data to request
        next();
    } catch (err) {
        console.error("❌ Token Verification Failed:", err);
        res.status(401).json({ msg: "Token ไม่ถูกต้อง" });
    }
};