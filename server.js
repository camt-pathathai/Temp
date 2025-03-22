const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Set views path

// Serve static files like CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);  // Use express-ejs-layouts

app.set('layout', 'layout');  // Set the layout.ejs file

// Route for the HomePage
app.get('/', (req, res) => {
    res.render('HomePage', { title: 'Home - Game Shop', errorMessage: null });
});

// Route for All Products section (it will load HomePage.ejs)
app.get('/HomePage', (req, res) => {
    res.render('HomePage', { title: 'Home - Game Shop', errorMessage: null });
});

// Define route for Shop-Cart
app.get('/Shop_Cart', (req, res) => {
    res.render('Shop_Cart', { title: 'Shop Cart - Game Shop', layout: 'layoutShop' });
});

// Route for search
app.get('/search', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    
    // Define supported categories
    const categories = {
        "nintendo": "/Nintendo",
        "nin" : "/Nintendo",
        "playstation": "/playstation",
        "xbox": "/xbox",
        "pc gaming": "/pc-gaming"
    };

    // If category matches, redirect to the corresponding route
    if (categories[query]) {
        res.redirect(categories[query]);
    } else {
        // If category not found, show an alert on the HomePage
        res.render('HomePage', { 
            title: 'Home - Game Shop', 
            errorMessage: 'Category Not Found'  // Pass error message to HomePage
        });
    }
});

// Define route for Nintendo
app.get('/nintendo', (req, res) => {
    res.render('Nintendo', { title: 'Nintendo - Game Shop', layout: 'layoutCategory' });
});

// Route for Playstation
app.get('/playstation', (req, res) => {
    res.render('Shop_Cart', { title: 'Playstation - Game Shop', layout: 'layoutCategory' });
});

// Route for Xbox
app.get('/xbox', (req, res) => {
    res.render('Shop_Cart', { title: 'Xbox - Game Shop', layout: 'layoutCategory' });
});

// Route for PC Gaming
app.get('/pc-gaming', (req, res) => {
    res.render('Shop_Cart', { title: 'PC Gaming - Game Shop', layout: 'layoutCategory' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
