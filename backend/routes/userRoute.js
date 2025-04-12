import express from 'express';
import { loginUser, registerUser, requestPasswordReset, resetPassword, verifyOTP} from '../controllers/userController.js'; 

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/password-reset-request", requestPasswordReset);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/verify-otp", verifyOTP);

export default userRouter;
