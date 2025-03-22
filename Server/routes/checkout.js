const express = require('express');
const router = express.Router();
const { list, add } = require('../controllers/checkout');

router.get("/checkout/:userId", list );
router.post("/checkout", add );



module.exports = router;