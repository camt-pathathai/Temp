const express = require("express");
const router = express.Router();
const db = require("../db");

// ลบเส้นทาง get("/") ที่ซ้ำออก แล้วกำหนดเส้นทาง /products แยกออกจาก /add-product
router.get("/", (req, res) => {
    const sqlProducts = `
      SELECT p.*, pl.name AS platform_name, gc.name AS game_category_name
      FROM products p
      LEFT JOIN platforms pl ON p.platform_id = pl.id
      LEFT JOIN game_categories gc ON p.game_category_id = gc.id`;

    db.query(sqlProducts, (err, products) => {
        if (err) {
            console.error("❌ Error fetching products:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
        }

        res.render("products", { products });
    });
});

// ดึงหน้าเพิ่มสินค้า
router.get("/add-product", (req, res) => {
    res.render("add-product");  // เส้นทางสำหรับการ render หน้า add-product.ejs
});


// 📌 เพิ่มสินค้าใหม่
// 📌 เพิ่มสินค้าใหม่ และอัปเดตหน้าอัตโนมัติ
router.post("/add", (req, res) => {
    const { name, description, normal_price, promo_price, platform_id, game_category_id, image } = req.body;

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
        res.redirect("/products"); // 🔥 อัปเดตหน้าอัตโนมัติ
    });
});


// 📌 ลบสินค้า
router.post("/delete", (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.body.id], (err) => {
        if (err) {
            console.error("❌ Error deleting product:", err);
            return res.status(500).send("เกิดข้อผิดพลาดในการลบสินค้า");
        }
        res.redirect("/products");
    });
});

router.get("/add-product", (req, res) => {
    res.render("add-product");  // เส้นทางสำหรับการ render หน้า add-product.ejs
});
module.exports = router;
