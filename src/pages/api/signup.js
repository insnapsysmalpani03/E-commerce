import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    // If method is not POST
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
