const express = require('express');
const router = express.Router();
const { add,list,remove,getCategories } = require('../controllers/category');

router.post('/category', add);
router.get('/category',list);
router.delete('/category/:id',remove);
router.get('/categories', getCategories);



module.exports = router;