import User from "../models/user.model.js";
const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(`error in the user controller`, error.message);
    res.status(400).json({ error: `internal server error` });
  }
};

export default getUserForSidebar;
