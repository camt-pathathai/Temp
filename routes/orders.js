const express = require("express");
const router = express.Router();  // ✅ บรรทัดนี้ขาดอยู่
const db = require("../db");

// ตัวอย่าง route
router.get("/", (req, res) => {
  const sql = "SELECT * FROM orders";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.render("orders", { orders: results });
  });
});

module.exports = router;
