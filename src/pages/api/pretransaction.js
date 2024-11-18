// /pages/api/pretransaction.js
import connectDb from '../../../middleware/mongoose';
import Order from "../../../models/Order";
import Product from "../../../models/Product";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { name, email, orderId, paymentMethod, products, address, amount, phone } = req.body;
    console.log(req.body)

    // Validate that the phone number exists
    if (!phone === "") {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }

    // Optionally validate phone number format
    const phoneRegex = /^[0-9]{10,15}$/; // Example: Allow 10 to 15 digit phone numbers
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format." });
    }

    // Handle cases where `paymentMethod` is "Cash on Delivery" (no `paymentInfo` expected)
    const paymentInfo = paymentMethod === "Cash on Delivery" ? "Not required" : req.body.paymentInfo;

    try {
      let calculatedAmount = 0;

      // Loop through the products object to validate and update each product
      for (const [productSlug, productDetails] of Object.entries(products)) {
        const { qty, price, name, size, variant, itemCode } = productDetails;
      
        // Fetch the specific product based on slug, size, and variant
        const existingProduct = await Product.findOne({
          slug: itemCode,
          size: size || null,
          color: variant || null,
        });
      
        if (!existingProduct) {
          return res.status(400).json({
            success: false,
            message: `Product with slug ${productSlug}, size ${size}, and variant ${variant} not found.`,
          });
        }
      
        // Validate the price
        if (price !== existingProduct.price) {
          return res.status(400).json({
            success: false,
            message: `Price mismatch for product ${productSlug} (${size}, ${variant}).`,
          });
        }
      
        // Validate stock
        if (existingProduct.availableQty < qty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${name} (${size}, ${variant}).`,
          });
        }
      
        // Calculate the total price
        calculatedAmount += price * qty;
      }
      
      // After validation, decrement stock
      for (const [productSlug, productDetails] of Object.entries(products)) {
        const { qty, size, variant, itemCode } = productDetails;
      
        await Product.updateOne(
          { slug: itemCode, size: size || null, color: variant || null },
          { $inc: { availableQty: -qty } }
        );
      }      

      // Create a new order
      const order = new Order({
        name,
        email,
        orderId,
        paymentMethod,
        paymentInfo,
        products,
        address,
        phone, // Include phone in the order
        amount,
        status: "Ordered", // Default status
      });

      // Save the order in the database
      await order.save();

      res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
};

export default connectDb(handler);
