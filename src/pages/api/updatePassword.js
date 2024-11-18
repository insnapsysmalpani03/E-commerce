import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";

const handler = async (req, res) => {
  try {
    const { token, password, newPassword } = req.body;
    
    if (!token || !password || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const dbUser = await User.findOne({ email: user.email });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare current password with the one in the database
    const isMatch = await bcrypt.compare(password, dbUser.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    dbUser.password = hashedPassword;
    await dbUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
};

export default connectDb(handler);
