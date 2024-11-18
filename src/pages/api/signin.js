import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../utils/jwt";


const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Compare provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken(user);

      // If successful, send the JWT token along with user info
      return res.status(200).json({
        message: "Sign in successful",
        user: { id: user._id, name: user.name, email: user.email },
        token, // Send the token in the response
      });
    } catch (error) {
      console.error("Error signing in user:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    // If method is not POST
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
