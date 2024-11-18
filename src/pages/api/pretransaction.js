// /pages/api/pretransaction.js
import connectDb from '../../../middleware/mongoose';
import Order from "../../../models/Order";
import Product from "../../../models/Product";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, orderId, paymentMethod, products, address, amount } = req.body;

    // Handle cases where `paymentMethod` is "Cash on Delivery" (no `paymentInfo` expected)
    const paymentInfo = paymentMethod === "Cash on Delivery" ? "Not required" : req.body.paymentInfo;

    try {
      let calculatedAmount = 0;

      // Loop through the products object to validate and update each product
      for (const [productSlug, productDetails] of Object.entries(products)) {
        const { qty, price, name, size, variant, itemCode } = productDetails;

        // Check if product exists in the database based on the slug
        const existingProduct = await Product.findOne({ slug: itemCode });
        if (!existingProduct) {
          return res.status(400).json({ success: false, message: `Product with slug ${productSlug} not found.` });
        }

        // Ensure the price in the request matches the price in the database (to prevent tampering)
        if (price !== existingProduct.price) {
          return res.status(400).json({ success: false, message: `Price mismatch for product ${productSlug}.` });
        }

        // Ensure the product size and variant match the data in the database
        if (size && size !== existingProduct.size) {
          return res.status(400).json({ success: false, message: `Size mismatch for product ${productSlug}.` });
        }

        if (variant && variant !== existingProduct.color) {
          return res.status(400).json({ success: false, message: `Variant mismatch for product ${productSlug}.` });
        }

        // Ensure the quantity is valid (greater than 0) and within allowable stock
        if (qty <= 0) {
          return res.status(400).json({ success: false, message: `Invalid quantity for product ${productSlug}.` });
        }

        if (existingProduct.availableQty - qty < 1) {
          return res
            .status(400)
            .json({
              success: false,
              message: `The ${name} is out of stock or insufficient quantity is available.`,
            });
        }

        //Calculate the total price for the product
        calculatedAmount += price * qty;
      }

      // Ensure the calculated amount matches the amount in the request body
      if (calculatedAmount !== amount) {
        return res.status(400).json({ success: false, message: "Amount does not match the calculated total for the products." });
      }

      // Decrement the availableqty for each product
      for (const [productSlug, productDetails] of Object.entries(products)) {
        const { qty, itemCode } = productDetails;

        // Update the product's available quantity in the database
        await Product.updateOne(
          { slug: itemCode },
          { $inc: { availableQty: -qty } } // Decrease availableQty by the ordered qty
        );
      }

      // Create a new order
      const order = new Order({
        email,
        orderId,
        paymentMethod,
        paymentInfo,
        products,
        address,
        amount,
        status: "Pending", // Default status
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
