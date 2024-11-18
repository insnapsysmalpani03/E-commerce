import { useRouter } from "next/router";
import React from "react";

import mongoose from "mongoose";
import Order from "../../../models/Order";

const MyOrder = ({ order }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">Order not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap bg-white shadow-md rounded-lg p-6">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest uppercase">
                Codeswear
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                Order ID: {order.orderId}
              </h1>
              <p className="leading-relaxed mb-4">
                Thank you for shopping with us. Your order has been successfully placed.
              </p>
              <p className="leading-relaxed mb-4 font-semibold">
                Payment Method: <span className="font-normal">{order.paymentMethod}</span>
              </p>
              <p className="leading-relaxed mb-4 font-semibold">
                Order Status: <span className="font-normal">{order.status}</span>
              </p>

              <div className="flex mb-4 pb-2">
                <span className="flex-grow text-center text-pink-500 font-semibold py-2 text-lg">
                  Item Description
                </span>
                <span className="flex-grow text-center font-semibold py-2 text-lg">
                  Quantity
                </span>
                <span className="flex-grow text-center font-semibold py-2 text-lg">
                  Item Total
                </span>
              </div>

              {/* Rendering products dynamically */}
              {Object.entries(order.products).map(([key, product], index) => (
                <div className="flex border-t border-gray-200 py-3" key={index}>
                  <span className="text-gray-500">
                    {product.name} ({product.size}, {product.variant})
                  </span>
                  <span className=" m-auto text-gray-900">{product.qty}</span>
                  <span className="m-auto text-gray-900">
                  ₹{(product.qty * product.price).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex items-center mt-8">
                <span className="title-font font-medium text-2xl text-gray-900">
                  Subtotal: ${order.amount.toFixed(2)}
                </span>
                <button className="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">
                  Track Order
                </button>
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src="https://dummyimage.com/400x400"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;

  // Check if the id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      props: {
        order: null, // Pass null if the id is invalid
      },
    };
  }

  // Connect to the database if not already connected
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // Fetch the order by its ID
  const order = await Order.findById(id);

  // If the order is not found, return null as well
  if (!order) {
    return {
      props: {
        order: null,
      },
    };
  }

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default MyOrder;
