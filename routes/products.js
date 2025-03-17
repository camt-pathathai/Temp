const express = require("express");
const router = express.Router();
const db = require("../db");

// ดึงสินค้าทั้งหมด
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
      if (err) {
          console.error("❌ Error fetching products:", err);
          return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
      }
      console.log("✅ Products fetched:", results);
      res.render("products", { products: results });
  });
});


// ดึงหน้าเพิ่มสินค้า
router.get("/add", (req, res) => {
    res.render("add-product");
});

// เพิ่มสินค้าใหม่ (เปลี่ยนจาก category_name เป็น category_id)
router.post("/add", (req, res) => {
  const { name, description, normal_price, promo_price, category, image } = req.body;
  
  console.log("📌 Data received from form:", req.body);  // ✅ ตรวจสอบค่าที่ส่งมา

  const sqlGetCategoryId = "SELECT id FROM categories WHERE category_name = ?";
  db.query(sqlGetCategoryId, [category], (err, result) => {
      if (err) {
          console.error("❌ Error fetching category_id:", err);
          return res.status(500).send("เกิดข้อผิดพลาดในการดึงหมวดหมู่");
      }

      console.log("✅ Category found:", result);

      if (result.length > 0) {
          const category_id = result[0].id;

          const sqlInsert = `INSERT INTO products 
                            (product_name, product_description, product_normal_price, product_price_promotion, category_id, product_images) 
                            VALUES (?, ?, ?, ?, ?, ?)`;
          const values = [name, description, normal_price, promo_price, category_id, image];

          db.query(sqlInsert, values, (err) => {
              if (err) {
                  console.error("❌ Error inserting product:", err);
                  return res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
              }
              console.log("✅ Product added successfully");
              res.redirect("/products");
          });
      } else {
          res.status(400).send("❌ หมวดหมู่ไม่ถูกต้อง หรือไม่มีอยู่ในระบบ");
      }
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
