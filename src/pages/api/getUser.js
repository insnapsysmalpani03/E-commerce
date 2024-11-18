import jwt from "jsonwebtoken";
import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";

const handler = async (req, res) => {
  try {

    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const dbUser = await User.findOne({ email: user.email });

    const { name, email, address, pincode,phone } = dbUser;

    res.status(200).json({ name, email, address, pincode, phone});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch details" });
  }
};

export default connectDb(handler);
