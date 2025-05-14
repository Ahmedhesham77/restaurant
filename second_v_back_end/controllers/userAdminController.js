import userAdminModel from "../models/userAdminModel.js"
import bcrypt from "bcrypt"
import validator from "validator";
import jwt from "jsonwebtoken";
import fs from "fs"
// import jwt from "jsonwebtoken";
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userAdminModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Dosen't exist" })

        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {

            return res.json({ success: false, message: "invalid Cardentials" })

        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })

    }
}
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
const signUp = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Please select an image" });
        }

        const { filename } = req.file;
        const { name, lastName, phone, email, password, access } = req.body;

        const exists = await userAdminModel.findOne({
            $or: [{ name }, { email }],
        });

        if (exists) {
            fs.unlinkSync(req.file.path);
            return res.json({ success: false, message: "user already Exist" });
        }

        if (!validator.isEmail(email)) {
            fs.unlinkSync(req.file.path);
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            fs.unlinkSync(req.file.path);
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userAdminModel({
            name: name,
            lastName: lastName,
            phone: phone,
            email: email,
            password: hashedPassword,
            access: access,
            image: filename,
        });

        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
const allUsers = async (req, res) => {
    try {
        const response = await userAdminModel.find({})
        if (response) {
            res.json({ success: true, message: "all users" })
            console.log(response)
        }

    } catch (error) {
        res.json({ success: false, message: error })
    }

}


export { signUp, allUsers, loginUser }