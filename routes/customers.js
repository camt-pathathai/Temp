const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM customers";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.render("customers", { customers: results });
  });
});

module.exports = router;
