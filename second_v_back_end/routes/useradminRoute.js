import express from "express"
import { allUsers, signUp, loginUser } from "../controllers/userAdminController.js"
import multer from "multer"
const userAdminRouter = express.Router()
const storage = multer.diskStorage({
    destination: "idupload",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
console.log(Date.now)

const upload = multer({ storage: storage })

userAdminRouter.post("/register", upload.single("image"), signUp)
userAdminRouter.get("/allusers", allUsers)
userAdminRouter.post("/login", loginUser)

export { userAdminRouter }