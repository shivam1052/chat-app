import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import createToken from "../jwt/token.js";

//signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exist!" });
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 10);
    //create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      createToken(newUser._id, res);
      res.status(201).json({ message: "User created successfully", newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Internal server error" });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid user credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    createToken(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Internal server error" });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    res.status(201).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Internal server error" });
  }
};
