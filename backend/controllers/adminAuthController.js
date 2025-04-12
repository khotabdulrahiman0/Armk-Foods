import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import Admin from "../models/adminModel.js";

// Create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({ success: false, message: "Admin does not exist" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(admin._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin Registration
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the admin already exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    // Validate email format & password strength
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    const admin = await newAdmin.save();

    // Generate a token
    const token = createToken(admin._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
