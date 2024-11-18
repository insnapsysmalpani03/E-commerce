import React, { useState, useEffect } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { BsBagFill } from "react-icons/bs";
import PaymentModal from "../../../components/PaymentModal";
import SuccessModal from "../../../components/SuccessModal";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = ({ cart, addToCart, removeFromCart, subTotal, clearCart }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Success modal state
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    } else {
      // Retrieve MyUser from localStorage
      const storedUser = localStorage.getItem("MyUser");
      if (storedUser) {
        const { name, email } = JSON.parse(storedUser);
        setFormData((prevFormData) => ({
          ...prevFormData,
          name,
          email,
        }));
      }
    }
  }, []);

  const isFormValid = Object.values(formData).every(
    (field) => field.trim() !== ""
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For phone number: Allow only 10 digits
    if (name === "phone" && value.length <= 10) {
      setFormData({ ...formData, [name]: value });
    }

    // For pincode: Allow only 6 digits
    else if (name === "pincode" && value.length <= 6) {
      setFormData({ ...formData, [name]: value });
    }

    // For other fields, just update normally
    else if (name !== "phone" && name !== "pincode") {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to fetch city and state based on pincode
  const fetchLocationData = async (pincode) => {
    try {
      const response = await fetch("/api/pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });

      const data = await response.json();

      if (response.ok && data) {
        setFormData({
          ...formData,
          city: data.districtName,
          state: data.stateName,
        });
      } else {
        setFormData({ ...formData, city: "", state: "" });
        toast.warn("Pincode not serviceable or incorrect!");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // useEffect to fetch data when pincode is filled with 6 digits
  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetchLocationData(formData.pincode);
    }
  }, [formData.pincode]);

  const handlePayment = async (method) => {
    setIsModalOpen(false);
    setLoading(true);

    try {
      const orderData = {
        email: formData.email,
        orderId: `${uuidv4().slice(0, 15)}`,
        paymentMethod: method,
        paymentInfo:
          method === "Cash on Delivery" ? "Not required" : "Payment info",
        products: cart,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        amount: subTotal,
      };

      const response = await fetch("/api/pretransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log("Order created successfully:", result);
        setIsSuccessModalOpen(true); // Open success modal on successful order
        clearCart();
      } else {
        console.error("Error creating order:", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container px-2 sm:m-auto mb-2">
        <h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>
        <h2 className="font-semibold text-xl">1. Delivery Details</h2>
        <div className="mx-auto flex my-2">
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleInputChange}
                value={formData.name}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                readOnly
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>
        <div className="px-2 w-full">
          <div className="mb-4">
            <label
              htmlFor="address"
              className="leading-7 text-sm text-gray-600"
            >
              Address
            </label>
            <textarea
              name="address"
              id="address"
              cols="30"
              rows="2"
              onChange={handleInputChange}
              value={formData.address}
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="mx-auto flex my-2">
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="leading-7 text-sm text-gray-600"
              >
                Phone
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                maxLength={10}
                onChange={handleInputChange}
                value={formData.phone}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label
                htmlFor="pincode"
                className="leading-7 text-sm text-gray-600"
              >
                Pincode
              </label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                onChange={handleInputChange}
                maxLength={6}
                value={formData.pincode}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto flex my-2">
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label htmlFor="city" className="leading-7 text-sm text-gray-600">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                onChange={handleInputChange}
                value={formData.city}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                readOnly
              />
            </div>
          </div>
          <div className="px-2 w-1/2">
            <div className="mb-4">
              <label
                htmlFor="state"
                className="leading-7 text-sm text-gray-600"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                onChange={handleInputChange}
                value={formData.state}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                readOnly
              />
            </div>
          </div>
        </div>

        <h2 className="font-semibold text-xl">2. Review Cart Items</h2>
        <div className="sidebar bg-pink-100 p-6 m-2">
          <ol className="list-decimal font-semibold">
            {Object.keys(cart).length === 0 && (
              <div className="my-4 font-semibold">Your Cart is Empty</div>
            )}
            {Object.keys(cart).map((k) => (
              <li key={k}>
                <div className="item flex my-5">
                  <div className="font-semibold">
                    {cart[k].name} ({cart[k].size}, {cart[k].variant})
                  </div>
                  <div className="w-1/3 font-semibold flex items-center justify-center text-xl">
                    <AiFillMinusCircle
                      onClick={() =>
                        removeFromCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant
                        )
                      }
                      className="text-pink-500 cursor-pointer"
                    />
                    <span className="mx-2 text-sm">{cart[k].qty}</span>
                    <AiFillPlusCircle
                      onClick={() =>
                        addToCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant
                        )
                      }
                      className="text-pink-500 cursor-pointer"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <span className="total font-semibold">Subtotal: ₹{subTotal}</span>
        </div>
        <div className="mx-4 flex items-end md:justify-end justify-center">
          <button
            onClick={() => {
              if (Object.keys(cart).length === 0) {
                toast.error("Your cart is empty! Please add items to proceed.");
              } else {
                setIsModalOpen(true);
              }
            }}
            disabled={!isFormValid || loading}
            className={`flex mr-2 text-white ${
              isFormValid ? "bg-pink-500" : "bg-pink-300 cursor-not-allowed"
            } border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-md`}
          >
            <BsBagFill className="m-1" />
            {loading ? "Processing..." : `Pay ₹ ${subTotal}`}
          </button>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(method) => handlePayment(method)}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
        />
      </div>
    </>
  );
};

export default Checkout;
