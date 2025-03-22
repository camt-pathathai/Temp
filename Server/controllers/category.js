const prisma = require("../config/prisma");

exports.add = async(req,res) => {

    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, msg: "Category name is required" });
        }

        const newCategory = await prisma.category.create({
            data: { name },
        });

        res.status(201).json({ success: true, message: "Category added successfully", category: newCategory });
    } catch (err) {
        console.error("Error adding category:", err);
        res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
};

exports.list = async(req,res) => {

    try{
        const categories = await prisma.category.findMany();
        //res.send(category);
        res.render('categories',{categories});

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"})
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure ID is a valid number
        if (isNaN(id)) {
            return res.status(400).json({ msg: "Invalid category ID" });
        }

        // Attempt to delete the category
        const category = await prisma.category.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({ success: true, message: "Category deleted successfully", category });

    } catch (err) {
        console.error("Error deleting category:", err);

        if (err.code === "P2025") {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }

        return res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
};



exports.getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany(); // Fetch all categories
        res.send(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};