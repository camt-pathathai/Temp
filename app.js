const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./db");
const productsRoutes = require("./routes/products"); // นำเข้าไฟล์ routes/products.js
const app = express();

// ตั้งค่าเซสชัน
app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware
app.use(express.urlencoded({ extended: true })); // รองรับ Form Data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/products", productsRoutes); // เชื่อมเส้นทาง /products
app.use((req, res, next) => {
  console.log("🔍 Session Data:", req.session);
  next();
});


// นำเข้า Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const dashboardRoutes = require("./routes/dashboard");

// ✅ Middleware ป้องกันการเข้าถึง Back-Office ถ้าไม่ได้ล็อกอิน
const checkAuth = (req, res, next) => {
    if (!req.session.admin_id) {
        return res.redirect("/auth/login");
    }
    next();
};

// ✅ ใช้ Middleware นี้กับเส้นทางที่ต้องล็อกอินก่อนเข้าใช้งาน
app.use("/dashboard", checkAuth);
app.use("/products", checkAuth);
app.use("/categories", checkAuth);

// ใช้งาน Routes
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/dashboard", dashboardRoutes);

// หน้า Dashboard (หลังล็อกอิน)
app.get("/", (req, res) => {
    if (!req.session.admin_id) return res.redirect("/auth/login");
    res.render("dashboard");
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
app.use(express.json()); // รองรับ JSON Request
app.use(express.urlencoded({ extended: true })); // รองรับ Form Data
app.use(session({
    secret: process.env.SESSION_SECRET || "my_secret_key",
    resave: false,
    saveUninitialized: false, // เปลี่ยนเป็น false เพื่อป้องกัน session ว่าง
    cookie: { secure: false } // เปิด secure เฉพาะใช้ HTTPS
}));

const ordersRoutes = require("./routes/orders");
const customersRoutes = require("./routes/customers");

app.use("/orders", checkAuth, ordersRoutes);
app.use("/customers", checkAuth, customersRoutes);
