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
    res.render('HomePage', { title: 'Home - Game Shop' });
});

// Route for All Products section (it will load HomePage.ejs)
app.get('/HomePage', (req, res) => {
    res.render('HomePage', { title: 'Home - Game Shop' });
});

// Define route for Shop-Cart
app.get('/Shop_Cart', (req, res) => {
    res.render('Shop_Cart', { title: 'Shop Cart - Game Shop', layout: 'layoutShop' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
