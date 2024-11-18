import Product from "../../../models/Product";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const savedProducts = [];

      for (let i = 0; i < req.body.length; i++) {
        let p = new Product({
          title: req.body[i].title,
          slug: req.body[i].slug,
          desc: req.body[i].desc,
          img: req.body[i].img,
          category: req.body[i].category,
          size: req.body[i].size,
          color: req.body[i].color,
          price: req.body[i].price,
          availableQty: req.body[i].availableQty,
        });

        const savedProduct = await p.save();
        savedProducts.push(savedProduct);
      }

      res.status(200).json({ success: true, message: "Products saved successfully", savedProducts });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error saving products", error });
    }
  } else {
    res.status(400).json({ success: false, error: "This method is not allowed." });
  }
};

export default connectDb(handler);
