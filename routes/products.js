const express = require("express");
const router = express.Router();
const db = require("../db");

// ดึงสินค้าทั้งหมด
router.get("/", (req, res) => {
    const sql = `
      SELECT p.*, pl.name AS platform_name, gc.name AS game_category_name
      FROM products p
      JOIN platforms pl ON p.platform_id = pl.id
      JOIN game_categories gc ON p.game_category_id = gc.id`;

    db.query(sql, (err, results) => {
        res.render("products", { products: results });
    });
});



// ดึงหน้าเพิ่มสินค้า
router.get("/add", (req, res) => {
    res.render("add-product");
});

// routes/products.js
// ดึงหน้าเพิ่มสินค้า พร้อมดึงข้อมูล platforms และ game_categories
router.get("/add", (req, res) => {
    const sqlPlatforms = "SELECT * FROM platforms";
    const sqlCategories = "SELECT * FROM game_categories";

    db.query(sqlPlatforms, (err, platforms) => {
        if (err) {
            console.error("❌ Error fetching platforms:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลแพลตฟอร์ม");
        }

        db.query(sqlCategories, (err, categories) => {
            if (err) {
                console.error("❌ Error fetching categories:", err);
                return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่");
            }

            res.render("add-product", { platforms, categories });
        });
    });
});

// เพิ่มสินค้าใหม่
router.post("/add", (req, res) => {
    const { name, description, normal_price, promo_price, platform_id, game_category_id, image } = req.body;

    // ตรวจสอบว่าข้อมูลถูกต้อง
    if (!name || !description || !normal_price || !platform_id || !game_category_id) {
        return res.status(400).send("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    const sql = `
        INSERT INTO products (product_name, product_description, product_normal_price, product_price_promotion, platform_id, game_category_id, product_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, description, normal_price, promo_price || null, platform_id, game_category_id, image || null], (err, result) => {
        if (err) {
            console.error("❌ Error inserting product:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
        }
        res.redirect("/products");
    });
});


// ลบสินค้า
router.post("/delete", (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.body.id], (err) => {
        if (err) {
            console.error("❌ Error deleting product:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการลบสินค้า");
        }
        res.redirect("/products");
    });
});

module.exports = router;
