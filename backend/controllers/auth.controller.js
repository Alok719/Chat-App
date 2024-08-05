import { error, profile } from "console";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: `Passwords and confirmPasswords are not matching` });
    }
    const user = await User.findOne({ userName });
    if (user) {
      return res.status(400).json({ error: `userName already exits` });
    }

    //HASH Password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName: fullName,
      userName: userName,
      password: hashedPassword,
      gender: gender,
      profilePic: gender == "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      //generate JWT here
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: `invalid user data` });
    }
  } catch (error) {
    console.log(`error in signup controller`, error.message);
    res.status(500).json({
      error: `internal Server error`,
    });
  }
};
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: `Invalid username or password` });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profile: user.profilePic,
    });
  } catch (error) {
    console.log(`error in the login controller`, error.message);
    res.status(400).json({ error: `internal server error` });
  }
};
const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: `logged out succesfully` });
  } catch (error) {
    console.log(`error in the logout controller`, error.message);
    res.status(400).json({ error: `internal server error` });
  }
};

export { signup, login, logout };
