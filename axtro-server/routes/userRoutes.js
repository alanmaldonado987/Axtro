import express from "express";
import { getUser, loginUser, registerUSer, updateUserProfile, requestPasswordReset, verifyOTP, resetPassword } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUSer)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUser)
userRouter.put('/update', protect, updateUserProfile)
userRouter.post('/forgot-password/request', requestPasswordReset)
userRouter.post('/forgot-password/verify', verifyOTP)
userRouter.post('/forgot-password/reset', resetPassword)

export default userRouter;