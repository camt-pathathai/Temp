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





app.listen(Port, () => console.log(`Server is running on ${Port}`));