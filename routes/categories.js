const express = require("express");
const router = express.Router();
const db = require("../db");

// แสดงหมวดหมู่
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY category_name ASC", (err, results) => {
    res.render("categories", { categories: results });
  });
});

// เพิ่มหมวดหมู่
router.post("/add", (req, res) => {
  const { category_name } = req.body;
  db.query("INSERT INTO categories (category_name) VALUES (?)", [category_name], () => {
    res.redirect("/categories");
  });
});

// ลบหมวดหมู่
router.post("/delete/:id", (req, res) => {
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], () => {
    res.redirect("/categories");
  });
});

module.exports = router;
