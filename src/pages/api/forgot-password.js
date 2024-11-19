import nodemailer from "nodemailer";
import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import crypto from "crypto";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // Generate a secure token (vvid) and expiry
    const resetToken = crypto.randomBytes(32).toString("hex"); // Secure token
    const tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes from now

    // Update the user with the token and expiry
    user.resetToken = resetToken;
    user.tokenExpiry = tokenExpiry;
    user.tokenUsed = false;
    await user.save();

    // Password reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/forgot?token=${resetToken}`;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Replace with your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD , // Your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: "malpanibusiness03@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}" style="color: #007bff;">Reset Password</a>
          <p>This link is valid for 15 minutes.</p>
          <p>If you didn’t request this, you can ignore this email.</p>
          <p>Thanks,<br>Malpani Business</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default connectDb(handler);
