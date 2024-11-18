import jwt from 'jsonwebtoken';

import Order from '../../../models/Order';
import connectDb from '../../../middleware/mongoose';

const handler = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const orders = await Order.find({ email: data.email });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export default connectDb(handler);
