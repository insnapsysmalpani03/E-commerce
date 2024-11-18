import jwt from "jsonwebtoken";
import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, name, address, pincode, phone, email } = req.body;

    // Validate token
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const dbUser = await User.findOne({ email: user.email });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent email update
    if (email && email !== dbUser.email) {
      return res.status(400).json({ error: "Email cannot be changed" });
    }

    // Validate phone number
    if (phone && (!/^\d{10}$/.test(phone))) {
      return res
        .status(400)
        .json({ error: "Phone number must be exactly 10 digits" });
    }

    // Validate pincode
    if (pincode && (!/^\d{6}$/.test(pincode))) {
      return res.status(400).json({ error: "Pincode must be exactly 6 digits" });
    }

    // Update user details
    dbUser.name = name || dbUser.name;
    dbUser.address = address || dbUser.address;
    dbUser.pincode = pincode || dbUser.pincode;
    dbUser.phone = phone || dbUser.phone;

    await dbUser.save();

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: {
        name: dbUser.name,
        email: dbUser.email,
        address: dbUser.address,
        pincode: dbUser.pincode,
        phone: dbUser.phone,
      },
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Failed to update details" });
  }
};

export default connectDb(handler);
