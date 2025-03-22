const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// ✅ แสดงหน้า Login
router.get("/login", (req, res) => {
    res.render("login");
});

// ✅ จัดการล็อกอิน (POST)
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log("📩 รับค่าจากฟอร์ม:", username, password);

    db.query("SELECT * FROM admin_users WHERE username = ?", [username], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ success: false, message: "❌ เซิร์ฟเวอร์มีปัญหา!" }); // ✅ ต้อง return JSON
        }
        if (!results || results.length === 0) {
            return res.json({ success: false, message: "❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!" });
        }

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (isMatch) {
                req.session.admin_id = results[0].id;
                console.log("✅ Login Success:", username);
                console.log("🔍 Session:", req.session);

                return res.json({ success: true }); // ✅ ต้อง return JSON
            } else {
                return res.json({ success: false, message: "❌ รหัสผ่านไม่ถูกต้อง!" });
            }
        });
    });
});


// ✅ แสดงหน้า Register
router.get("/register", (req, res) => {
    res.render("register");
});

// ✅ จัดการสมัครสมาชิก (POST)
router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ success: false, message: "❌ โปรดกรอกข้อมูลให้ครบถ้วน!" });
    }

    try {
        db.query("SELECT * FROM admin_users WHERE username = ?", [username], async (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ success: false, message: "❌ ไม่สามารถเชื่อมต่อฐานข้อมูล!" });
            }

            if (results && results.length > 0) {
                return res.status(409).json({ success: false, message: "❌ ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว!" });
            }

            // ✅ เข้ารหัสรหัสผ่าน
            const hashedPassword = await bcrypt.hash(password, 10);

            // ✅ บันทึกข้อมูลลงฐานข้อมูล
            db.query(
                "INSERT INTO admin_users (email, username, password) VALUES (?, ?, ?)",
                [email, username, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error("❌ Error inserting user:", err);
                        return res.status(500).json({ success: false, message: "❌ ไม่สามารถสมัครสมาชิกได้!" });
                    }

                    console.log("✅ สมัครสมาชิกสำเร็จ:", username);
                    res.json({ success: true });
                }
            );
        });
    } catch (err) {
        console.error("❌ Error hashing password:", err);
        res.status(500).json({ success: false, message: "❌ มีข้อผิดพลาดในการสมัครสมาชิก!" });
    }
});

// ✅ จัดการออกจากระบบ
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login");
    });
});

module.exports = router;
