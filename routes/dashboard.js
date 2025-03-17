const express = require("express");
const router = express.Router();
const db = require("../db"); // เชื่อมต่อฐานข้อมูล

// Route แสดงหน้า Dashboard
router.get("/", (req, res) => {
    if (!req.session.admin_id) {
        return res.redirect("/auth/login");
    }

    // คำสั่ง SQL ดึงข้อมูล
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM products) AS total_products,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COUNT(*) FROM customers) AS total_customers,
            (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE MONTH(order_date) = MONTH(CURRENT_DATE())) AS monthly_sales
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching dashboard data:", err); // แสดง error ใน console
            return res.status(500).send("❌ เกิดข้อผิดพลาดในการดึงข้อมูล Dashboard");
        }

        console.log("✅ Dashboard Data:", results[0]); // ตรวจสอบค่าที่ดึงได้

        res.render("dashboard", {
            total_products: results[0].total_products || 0,
            total_orders: results[0].total_orders || 0,
            total_customers: results[0].total_customers || 0,
            monthly_sales: results[0].monthly_sales || 0
        });
    });
});

module.exports = router;
