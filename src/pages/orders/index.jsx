import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/myorders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, [router]);

  const handleDetailsClick = (orderId) => {
    router.push(`/order?id=${orderId}`);
  };

  return (
    <div>
      <div className="container mx-auto">
        <h1 className="font-bold text-xl m-4">My Orders</h1>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4">{order.paymentMethod}</td>
                    <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4">₹{order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleDetailsClick(order._id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
