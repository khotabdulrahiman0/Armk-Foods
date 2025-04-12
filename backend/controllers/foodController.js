import foodModel from "../models/foodModel.js";
import fs from 'fs';

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Add food
const addFood = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            fs.unlink(`uploads/${food.image}`, () => {});
            await foodModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: "Food Removed" });
        } else {
            res.json({ success: false, message: "Food Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Search food by name
const searchFood = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ success: false, message: "Search term is required" });
        }

        // Find food items that match the search term (case-insensitive)
        const foods = await foodModel.find({
            name: { $regex: name, $options: 'i' }
        });

        if (foods.length > 0) {
            res.json({ success: true, data: foods });
        } else {
            res.json({ success: false, message: "No food items found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { listFood, addFood, removeFood, searchFood };
