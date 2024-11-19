const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, default: '' },
    pincode: { type: Number, default: 0 },
    phone: { type: Number, default: 0 },
    resetToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
    tokenUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

