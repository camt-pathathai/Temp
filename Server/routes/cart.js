const express = require('express');
const router = express.Router();
const { cart,cartupdate,addcart,remove } = require('../controllers/cart');

//router.get("/cart/:userId",cart);
//router.post("/cart/:userId",cartupdate);
router.get("/cart/:userId",cart);
router.post("/cart", addcart);
router.post("/cart/remove/:productId",remove);
router.post("/cart/update/:productId", cartupdate);


module.exports = router;