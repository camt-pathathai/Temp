const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { add, list, read, update, remove, sort, filter,nintendo, ps5, ps4, gamesir, xbox,recommended,adminlist, getedit, edit, stats, } = require('../controllers/product');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../Client/public/image/');  // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // File naming convention
    }
});


const upload = multer({ storage: storage });

router.get('/',recommended);

router.post("/product",upload.array('images', 10), add);
router.get("/products/", list);
router.get("/product/:id", read);
router.put("/product/:id", update);
router.delete("/product/:id", remove);
router.post("/productby", sort);
router.post("/search/filters", filter);

router.get("/products/nintendo", nintendo);
router.get("/products/ps5", ps5);
router.get("/products/ps4", ps4);
router.get("/products/gamesir", gamesir);
router.get("/products/xbox", xbox);

router.get("/admin/products", adminlist);

router.get("/admin/products/add",(req,res) => {
    res.render("add-product");
});

router.get('/admin/products/edit/:id', getedit );

router.put('/admin/products/edit/:id', upload.array('images', 10), edit);

router.get('/search', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    
    // Define supported categories
    const categories = {
        "nintendo": "/nintendo",
        "nin" : "/nintendo",
        "playstation4": "/ps4",
        "playstation 4": "/ps4",
        "ps 4": "/ps4",
        "ps4": "/ps4",
        "playstation5": "/ps5",
        "playstation 5": "/ps5",
        "ps 5": "/ps5",
        "ps5": "/ps5",
        "xbox": "/xbox",
        "gamesir": "/gamesir"
    };

    // If category matches, redirect to the corresponding route
    if (categories[query]) {
        res.redirect('products'+categories[query]);
    } else {
        // If category not found, show an alert on the HomePage
        res.redirect('/');
    }
});

//router.get('/stats', stats);


module.exports = router ;