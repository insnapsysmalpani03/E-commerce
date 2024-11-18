import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Truck,
  Package,
  Clock,
  Calendar,
  CreditCard,
} from "lucide-react";
import mongoose from "mongoose";
import Order from "../../../models/Order";

const MyOrder = ({ order, user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false); // Mark authentication check as complete
    }
  }, [router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl font-medium text-gray-700">Loading...</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">
          Order not found
        </h1>
      </div>
    );
  }

  console.log(order)

  const orderStatuses = [
    {
      status: "Ordered",
      icon: Package,
      description: "Order placed successfully",
    },
    {
      status: "Processing",
      icon: Clock,
      description: "Order is being processed",
    },
    { status: "Shipped", icon: Truck, description: "Order has been shipped" },
    {
      status: "Delivered",
      icon: CheckCircle,
      description: "Order has been delivered",
    },
  ];

  const isStepActive = (stepStatus) => {
    const statusMap = {
      Ordered: 0,
      Processing: 1,
      Shipped: 2,
      Delivered: 3,
    };
    return statusMap[order.status] >= statusMap[stepStatus];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function parseAddress(address) {
    if (!address || typeof address !== "string") {
      return {
        street: "N/A",
        city: "N/A",
        state: "N/A",
        pincode: "N/A",
      };
    }
  
    // Split the input into components
    const [street, city, rest] = address.split(", ");
    
    // Ensure 'rest' exists before splitting further
    const [state, pincode] = (rest || "").split(" - ");
  
    return {
      street: street || "N/A",
      city: city || "N/A",
      state: state || "N/A",
      pincode: pincode || "N/A",
    };
  }
  
  // Simulating address input (dynamic)
  const dynamicAddress = `${order.address}`
  
  // Parse the dynamic address
  const parsedAddress = parseAddress(dynamicAddress);
  
  console.log(parsedAddress);
 
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Order Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Details
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(order.createdAt)}
            </span>
            <span className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              {order.paymentMethod}
            </span>
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Order #{order.orderId}
            </span>
          </div>
        </div>

        {/* Order Status Tracker */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative mb-8">
            <div className="flex justify-between mb-2">
              {orderStatuses.map((step, index) => (
                <div key={index} className="flex flex-col items-center w-1/4">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300 ${
                      isStepActive(step.status)
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      isStepActive(step.status)
                        ? "text-pink-500"
                        : "text-gray-500"
                    }`}
                  >
                    {step.status}
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-100">
              <div
                className="h-full bg-pink-500 transition-all duration-500"
                style={{
                  width: `${
                    (orderStatuses.findIndex((s) => s.status === order.status) /
                      (orderStatuses.length - 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {Object.entries(order.products).map(([key, product], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Size: {product.size} | Color: {product.variant}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Qty: {product.qty}</p>
                    <p className="font-medium text-gray-900">
                      ₹{(product.qty * product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹0.00</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  ₹{(order.amount * 0.18).toFixed(2)}
                </span>
              </div> */}
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">
                    ₹{(order.amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600">
                  {parsedAddress.street}
                  <br />
                  {parsedAddress.city}, {parsedAddress.state}{" "}
                  {parsedAddress.pincode}
                  <br />
                </p>
                <p className="text-sm text-gray-600">Contact : {order.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
