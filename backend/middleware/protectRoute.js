import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: `Unauthorized  - No tokens provided` });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: `Unauthorized  - Invalid Token` });
    }

    const user = await User.findById(decoded.userId).select("-password"); // The select method is used to include or exclude certain fields in the resulting document. The "-password" argument specifically excludes the password field from the returned user document. This is a security measure to prevent sensitive data, like the user's hashed password, from being exposed in the response.

    if (!user) {
      return res.status(401).json({ error: `User not found` });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`error in the protectrout middleware`, error.message);
    res.status(400).json({ error: `internal server error` });
  }
};

export default protectRoute;
