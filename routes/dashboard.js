const express = require("express");
const router = express.Router();
const db = require("../db"); // เชื่อมต่อฐานข้อมูล

// ดึงข้อมูลสถิติจากฐานข้อมูล
router.get("/", (req, res) => {
    const sqlTotalUsers = "SELECT COUNT(*) AS total_users FROM admin_users";
    const sqlTotalOrders = "SELECT COUNT(*) AS total_orders FROM orders";
    const sqlTotalProducts = "SELECT COUNT(*) AS total_products FROM products";
    const sqlMonthlySales = "SELECT SUM(total_price) AS monthly_sales FROM orders WHERE MONTH(order_date) = MONTH(CURRENT_DATE())";

    db.query(sqlTotalUsers, (err, usersResult) => {
        if (err) return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");

        db.query(sqlTotalOrders, (err, ordersResult) => {
            if (err) return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ");

            db.query(sqlTotalProducts, (err, productsResult) => {
                if (err) return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");

                db.query(sqlMonthlySales, (err, salesResult) => {
                    if (err) return res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลยอดขาย");

                    res.render("dashboard", {
                        total_users: usersResult[0].total_users,
                        total_orders: ordersResult[0].total_orders,
                        total_products: productsResult[0].total_products,
                        monthly_sales: salesResult[0].monthly_sales || 0
                    });
                });
            });
        });
    });
});
module.exports = router;
