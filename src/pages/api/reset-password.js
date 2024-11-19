import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

const resetPasswordHandler = async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST requests are allowed" });
    }
  
    const { token, newPassword } = req.body;
  
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
  
    try {
      const user = await User.findOne({ resetToken: token });
  
      if (!user) {
        return res.status(404).json({ message: "Invalid token" });
      }
  
      if (user.tokenUsed) {
        return res.status(400).json({ message: "Token has already been used" });
      }
  
      if (user.tokenExpiry < Date.now()) {
        user.resetToken = null;
        user.tokenExpiry = null;
        user.tokenUsed = false;
        await user.save();
        return res.status(400).json({ message: "Token has expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password and invalidate the token
      user.password = hashedPassword; // Hash the password before saving
      user.resetToken = null;
      user.tokenExpiry = null;
      user.tokenUsed = true;
      await user.save();
  
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export default connectDb(resetPasswordHandler);
  