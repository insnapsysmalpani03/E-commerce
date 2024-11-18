const { default: mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    orderId: { type: String, require: true },
    paymentMethod: {type:String, require:true},
    paymentInfo:{type:String, require:true},
    products: { type: Object, require: true},
    address: { type: String, require: true },
    amount: { type: Number, require: true },
    status: { type: String, default: "Pending", require: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
