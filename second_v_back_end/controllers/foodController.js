import foodModel from "../models/foodModels.js";
import fs from "fs"

const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
        sizes: JSON.parse(req.body.sizes),
        addons: JSON.parse(req.body.addons)
    })
    try {
        await food.save()
        res.json({ success: true, message: "Food Added" })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}


const removeFood = async (req, res) => {
    try {


        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const getMeal = async (req, res) => {
    const searchQuery = req.query.name; // الحصول على اسم الوجبة من الطلب
    const foods = await foodModel.find({ name: { $regex: searchQuery, $options: 'i' } });
    res.json(foods);
};


export { addFood, listFood, removeFood, getMeal }
