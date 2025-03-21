const express = require("express");
const router = express.Router();
const db = require("../db");

// แสดงหมวดหมู่ทั้งหมด ทั้งแพลตฟอร์มและประเภทเกม
router.get("/", (req, res) => {
    const sql = `
      SELECT id, category_name AS name, 'category' AS type FROM categories
      UNION ALL
      SELECT id, name, 'platform' AS type FROM platforms
      UNION ALL
      SELECT id, name, 'game_category' AS type FROM game_categories
      ORDER BY name ASC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching categories:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่");
        }
        res.render("categories", { categories: results });
    });
});

// เพิ่มหมวดหมู่ใหม่ (รองรับหลายประเภท)
router.post("/add", (req, res) => {
    const { category_name, type } = req.body;

    let tableName, columnName;

    if (type === 'platform') {
        tableName = 'platforms';
        columnName = 'name';
    } else if (type === 'game_category') {
        tableName = 'game_categories';
        columnName = 'name';
    } else {
        tableName = 'categories';
        columnName = 'category_name';
    }

    const sql = `INSERT INTO ${tableName} (${columnName}) VALUES (?)`;
    db.query(sql, [category_name], (err) => {
        if (err) {
            console.error("❌ Error inserting category:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่");
        }
        res.redirect("/categories");
    });
});

// ลบหมวดหมู่ (ลบเฉพาะจาก categories เท่านั้น)
router.post("/delete/:id", (req, res) => {
    db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err) => {
        if (err) {
            console.error("❌ Error deleting category:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการลบหมวดหมู่");
        }
        res.redirect("/categories");
    });
});

module.exports = router;
