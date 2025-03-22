const prisma = require('../config/prisma');

exports.add = async(req,res) => {

    try{
        console.log(req.body);
        console.log(req.files);
        const { name, description, price, quantity, categoryIds} = req.body ;
        //console.log(name, description, price, quantity, categoryId, images);
        if (!categoryIds || !Array.isArray(categoryIds)) {
            return res.status(400).json({ msg: "Category IDs are required and should be an array" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: "Images are required and should be uploaded" });
        }

        const imageNames = req.files.map((file) => file.filename);
        const product = await prisma.product.create({
            data:{
                name:name,
                description:description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categories: {
                    create: categoryIds.map((categoryId) => ({
                      category: {
                        connect: { id: parseInt(categoryId) },
                      },
                    })),
                },
                image: { // Assuming 'images' is the correct field in your DB schema
                    create: imageNames.map((imageName) => ({
                        name: imageName, // Use the filename or image URL here
                    })),
                },
            }
        });


        //res.send("Add product success");
        
        res.json({ success: true, message: 'Product added successfully!' });

    }catch (err) {
        console.log(err);
        res.status(500).json({msg : "Server Error"});
    }
};

exports.list = async(req,res) => {

    try{
        //const { count } = req.params;
        const products = await prisma.product.findMany({
           where:{
            NOT:{
                quantity:0
            }
                
           },
            orderBy: { createdAt: "desc" },
            include: {
                categories: {
                    include: {
                      category: true,
                    },
                  },
                image: true,
                
            }
        })

        //res.send(products);
        res.render("allproduct", { products });
       

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.adminlist = async(req,res) => {
 
    try{
        //const { count } = req.params;
        const products = await prisma.product.findMany({
           where:{
                
           },
            orderBy: { createdAt: "asc" },
            include: {
                categories: {
                    include: {
                      category: true,
                    },
                  },
                image: true,
                
            }
        })

        //res.send(products);
        res.render("adminproducts", { products });
       

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.nintendo = async(req,res) => {

    try{
        //const { count } = req.params;
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {  category: {
                        name: "nintendo" 
                    } }
                },
                NOT:{
                    quantity:0
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                categories: {
                    include: {
                        category: true,
                    }
                },
                image: true
            }
        });
        //res.send(products);
        res.render("Nintendo", { products });
       

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.ps5 = async(req,res) => {

    try{
        //const { count } = req.params;
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {  category: {
                        name: "ps5" 
                    } }
                },
                NOT:{
                    quantity:0
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                categories: {
                    include: {
                        category: true,
                    }
                },
                image: true
            }
        });
        //res.send(products);
        res.render("Ps5", { products });
       

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.ps4 = async(req,res) => {

    try{
        //const { count } = req.params;
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {  category: {
                        name: "ps4" 
                    } }
                },
                NOT:{
                    quantity:0
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                categories: {
                    include: {
                        category: true,
                    }
                },
                image: true
            }
        });
        //res.send(products);
        res.render("Ps4", { products });
       

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.gamesir = async(req,res) => {

    try{
        //const { count } = req.params;
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {  category: {
                        name: "gamesir" 
                    } }
                },
                NOT:{
                    quantity:0
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                categories: {
                    include: {
                        category: true,
                    }
                },
                image: true
            }
        });
        //res.send(products);
        res.render("Gamesir", { products });
       

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.xbox = async(req,res) => {

    try{
        //const { count } = req.params;
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {  category: {
                        name: "xbox" 
                    } }
                },
                NOT:{
                    quantity:0
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                categories: {
                    include: {
                        category: true,
                    }
                },
                image: true
            }
        });
        //res.send(products);
        res.render("Xbox", { products });
       

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                categories: true,
                image: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.update = async(req,res) => {

    try{
        const { name, description, price, quantity, categoryIds, images } = req.body ;
        //console.log(name, description, price, quantity, categoryId, images);

        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        });

        await prisma.productOnCategory.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data:{
                name:name,
                description:description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categories: {
                    create: categoryIds.map((categoryId) => ({
                      category: {
                        connect: { id: parseInt(categoryId) },
                      },
                    })),
                },
                image: {
                    create: images.map((item) => ({
                        name: item.name
                    }))
                }
            }
        });


        res.send("Hello update");


    }catch (err) {
        console.log(err);
        res.status(500).json({msg : "Server Error"});
    }
};

exports.remove = async(req,res) => {

    try {
        const { id } = req.params;

        // Step 1: Find the product along with related images and categories
        const product = await prisma.product.findFirst({
            where: { id: Number(id) },
            include: { image: true, categories: true }
        });

        if (!product) {
            return res.status(400).json({ message: 'Product not found!' });
        }

        console.log(product);

        // Step 2: Delete the related images
        await prisma.image.deleteMany({
            where: {
                productId: Number(id),
            },
        });

        // Step 3: Delete the product-category associations
        await prisma.productOnCategory.deleteMany({
            where: {
                productId: Number(id),
            },
        });

        // Step 4: Delete the product
        await prisma.product.delete({
            where: {
                id: Number(id),
            },
        });

        // Step 5: Send a success response
        res.status(200).json({ message: 'Product deleted successfully!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.sort = async(req,res) => {

    try{
        const { sort, order, limit } = req.body;
        console.log(sort, order, limit);
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: { 
                categories: true,
                image:true
             }
        })
        res.send(products)

    }catch (err) {
        console.log(err);
        res.status(500).json({msg : "Server Error"});
    }
};

const handleQuery = async (req, res, query) => {
    try {
        //code
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                }
            },
            include: {
                categories: true,
                image: true
            }

        });
        res.send(products);
    } catch (err) {
        //err
        console.log(err);
        res.status(500).json({ message: "Search Error" });
    }
}
const handlePrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                categories: true,
                image: true
            }
        });
        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error ' });
    }
}
const handleCategory = async (req, res, categoryIds) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {  categoryId: { in: categoryIds.map((id) => Number(id))} }
                }
            },
            include: {
                categories: true,
                image: true
            }
        });
        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error ' });
    }
}


exports.filter = async(req,res) => {

    try{
        const { query, category, price } = req.body;

        if (query) {
            console.log('query-->', query);
            await handleQuery(req, res, query);
        }
        if (category) {
            console.log('category-->', category);
            await handleCategory(req, res, category);
        }
        if (price) {
            console.log('price-->', price);
            await handlePrice(req, res, price);
        }

        

        //res.send("Hello search Filters");

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.recommended = async(req,res) => {

    try {
        // Count total number of products
        const totalProducts = await prisma.product.count(); 

        // Sum all product quantities (total stock)
        const totalStockResult = await prisma.product.aggregate({
            _sum: { quantity: true } 
        });

        // Sum of all sold items from Product table
        const totalSoldResult = await prisma.product.aggregate({
            _sum: { sold: true }
        });

        // Fetch recommended products
        const products = await prisma.product.findMany({
            take: 8,
            where: {
                NOT: {
                    quantity: 0
                }
            },
            orderBy: { sold: "desc" },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                image: true,
            }
        });

        // Render the index view with stats and recommended products
        res.render("index", {
            totalProducts,
            totalStock: totalStockResult._sum.quantity || 0,
            totalSold: totalSoldResult._sum.sold || 0,
            products,  // Include the recommended products in the view
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.getedit = async (req, res) => {
    try {
        const { id } = req.params;

        // Log the ID to check if it's correct
        console.log(`Fetching product with ID: ${id}`);

        // Fetch the product from the database
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: { categories: true }, // Include categories if needed
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product); // Send product details to the frontend
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, quantity, categories } = req.body;

        // Fetch the existing product and its categories
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: { categories: true },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        // Step 1: Delete existing categories from ProductOnCategory table
        

        // Step 2: Update the product's details
        const updatedProduct = await prisma.product.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name: name,
                description: description,
                price: parseFloat(price), // Ensuring it's a float
                quantity: parseInt(quantity), // Ensuring it's an integer
                // Clear old categories
                categories: {
                    deleteMany: {},
                    create: categories.map((categoryId) => ({
                        category: {
                            connect: { id: parseInt(categoryId) }, // Connect to existing categories
                        },
                    })),
                },
                // Add new images (assuming the images are provided in `images` array)
                /*image: {
                    create: images.map((item) => ({
                        name: item.name, // Assuming 'name' holds the image file name
                    })),
                },*/
            },
        });

        // Return the updated product
        return res.json(updatedProduct);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

/*
exports.stats = async (req, res) => {
    try {
        // Count total number of products
        const totalProducts = await prisma.product.count(); 

        // Sum all product quantities (total stock)
        const totalStockResult = await prisma.product.aggregate({
            _sum: { quantity: true } 
        });

        // Sum of all sold items from Product table
        const totalSoldResult = await prisma.product.aggregate({
            _sum: { sold: true }
        });

        res.json({
            totalProducts,
            totalStock: totalStockResult._sum.quantity || 0,
            totalSold: totalSoldResult._sum.sold || 0
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Server Error" });
    }
}; */
