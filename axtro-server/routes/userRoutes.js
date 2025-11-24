import express from "express";
import { getUser, loginUser, registerUSer, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUSer)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUser)
userRouter.put('/update', protect, updateUserProfile)

export default userRouter;