const express = require('express');
const router = express.Router();
const { registerAdmin,register,login,currentUser } = require('../controllers/account');
const { auth } = require('../middleware/auth');

router.get("/admin", (req, res) => {
    res.render("login");
});
router.get("/admin/register", (req, res) => {
    res.render("adminregister");
});
router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/map", (req, res) => {
    res.render("map");
});

router.post('/admin/register',registerAdmin);
router.post('/register',register);
router.post('/login',login);
router.post('/current-user',currentUser);
router.post('/current-admin',currentUser);

module.exports = router;