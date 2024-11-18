import Product from "../../../models/Product";
import connectDb from "../../../middleware/mongoose";
const handler = async (req, res) => {
    if (req.method === "POST") {
      try {
        console.log(req.body);
        // Await each update one by one
        for (let i = 0; i < req.body.length; i++) {
          await Product.findByIdAndUpdate(req.body[i]._id, req.body[i]);
        }
  
        res
          .status(200)
          .json({ success: true, message: "Products updated successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error saving products", error });
      }
    } else {
      res
        .status(400)
        .json({ success: false, error: "This method is not allowed." });
    }
  };
  
export default connectDb(handler);
