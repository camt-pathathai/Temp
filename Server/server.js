const express = require('express');
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
const path = require("path");
const multer = require('multer');



const app = express() ;
const Port = 3000 ;
app.set("views", path.join(__dirname, "../Client/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../Client/public")));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

console.log(readdirSync('./routes'));
readdirSync('./routes').map((routers) => app.use(require('./routes/'+ routers)));
// กำหนดเส้นทางสำหรับหน้า "Sale Products"
app.get('/sale-products', (req, res) => {
    // ดึงข้อมูลสินค้าที่ลดราคา
    const discountedProducts = [
        { id: 1, name: 'Game A', salePrice: 19.99, originalPrice: 29.99, image: [{ name: 'gameA.jpg' }] },
        { id: 2, name: 'Game B', salePrice: 9.99, originalPrice: 19.99, image: [{ name: 'gameB.jpg' }] },
        // เพิ่มรายการสินค้าลดราคา
    ];

    res.render('sale-products', { discountedProducts });
});






app.listen(Port, () => console.log(`Server is running on ${Port}`));