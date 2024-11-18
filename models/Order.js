const { default: mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, require: true},
    email: { type: String, require: true },
    phone : { type: Number, require: true},
    orderId: { type: String, require: true },
    paymentMethod: {type:String, require:true},
    paymentInfo:{type:String, require:true},
    products: { type: Object, require: true},
    address: { type: String, require: true },
    city: { type: String, require: true},
    state: { type: String, require: true},
    pincode : { type: Number, require: true},
    phone: { type: Number, require: true},
    amount: { type: Number, require: true },
    status: { type: String, default: "Ordered", require: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
