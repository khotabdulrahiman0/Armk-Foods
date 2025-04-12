import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Send email function
const sendEmail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: subject,
        text: text,
    };

    return transporter.sendMail(mailOptions);
}

// Send OTP Email
export const sendOTPEmail = async (email, otp) => {
    const subject = 'Email Verification OTP';
    const text = `Your OTP for email verification is: ${otp}`;
    await sendEmail(email, subject, text);
}

// Send password reset email
const sendResetEmail = async (email, resetToken) => {
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Here is your reset token: ${resetToken}`;
    await sendEmail(email, subject, text);
}

// Register user with OTP
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP and set expiry (valid for 10 minutes)
        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Create new user with OTP
        const newUser = new userModel({ name, email, password: hashedPassword, otp, otpExpiry });
        await newUser.save();

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.json({ success: true, message: "OTP sent to email for verification" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error registering user" });
    }
}

// Verify OTP
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // OTP is valid, activate the account
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = createToken(user._id);
        res.json({ success: true, token, message: "OTP verified, account activated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error verifying OTP" });
    }
}

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error logging in" });
    }
}

// Request password reset
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        await sendResetEmail(email, resetToken);
        res.json({ success: true, message: "Password reset email sent" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in sending reset email" });
    }
}

// Reset password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error resetting password" });
    }
}
