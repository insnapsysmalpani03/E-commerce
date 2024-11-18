const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    slug: { type: String, require: true },
    desc: { type: String, require: true },
    img: { type: String, require: true },
    category: { type: String, require: true },
    size: { type: String, require: true },
    color: { type: String, require: true },
    price: { type: Number, require: true },
    availableQty: { type: Number, require: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
