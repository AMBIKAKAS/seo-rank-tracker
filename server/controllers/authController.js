import User from "../models/user.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const generateToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// REGISTER USER

export const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !password || !email) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CHECK IF USER EXISTS

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(
        password,
        await bcrypt.genSalt(10)
      );

    // CREATE USER

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // TOKEN GENERATION

    const token =
      generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.error(
      "Register error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN USER

export const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // FIND USER

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // TOKEN GENERATION

    const token =
      generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET CURRENT USER

export const getUser = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.userId
      ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "Get user error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};