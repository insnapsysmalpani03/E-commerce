import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { BsBagFill } from "react-icons/bs";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { MdAccountCircle, MdPerson } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";

const Navbar = ({
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  logout,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Auto open the cart when products are added and automatically close on checkout page
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      setIsCartOpen(true); // Keep the cart open if there are items
    } else {
      setIsCartOpen(false); // Close the cart if empty
    }
    console.log(router.pathname);
    let extempted = ['/checkout', '/order', '/orders', '/','/account', '/login' ,'signup', 'forgot'];
    if (extempted.includes(router.pathname)) {
      setIsCartOpen(false); // Close cart when navigating to the checkout page
    }
  }, [cart, router.pathname]); // Re-run whenever cart or pathname changes

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev); // Toggle the cart manually
  };

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-start justify-center items-center sticky top-0 bg-white py-2 shadow-md z-10">
      <div className="logo mr-auto mx-6 md:mr-4 md:mb-0 mb-2">
        <Link href={"/"}>
          <Image src="/nav.png" width={220} height={40} alt="" />
        </Link>
      </div>

      <div className="nav">
        <ul className="flex items-center space-x-6 font-bold md:text-md">
          <Link href={"/tshirts"}>
            <li>Tshirts</li>
          </Link>
          <Link href={"/hoodies"}>
            <li>Hoodies</li>
          </Link>
          <Link href={"/stickers"}>
            <li>Stickers</li>
          </Link>
          <Link href={"/mugs"}>
            <li>Mugs</li>
          </Link>
        </ul>
      </div>

      <div className="cart absolute right-0 top-4 mx-5 cursor-pointer flex items-center space-x-4 md:space-x-2">
        {user.value ? (
          <div
            ref={dropdownRef}
            className="relative"
            {...(isMobile
              ? {
                  onClick: toggleDropdown,
                }
              : {
                  onMouseEnter: () => setDropdown(true),
                  onMouseLeave: () => setDropdown(false),
                })}
          >
            <MdAccountCircle className="text-2xl md:text-2xl cursor-pointer" />
            {dropdown && (
              <div className="absolute right-0 top-full pt-2 border">
                <div className="shadow-lg rounded-md w-36 py-2 bg-white">
                  <Link href="/account">
                    <div className="pb-1 px-4 hover:text-pink-700 flex items-center space-x-2">
                      <MdPerson className="text-lg" />
                      <span>My Account</span>
                    </div>
                  </Link>
                  <Link href="/orders">
                    <div className="py-1 px-4 hover:text-pink-700 flex items-center space-x-2">
                      <AiOutlineShoppingCart className="text-lg" />
                      <span>Orders</span>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown toggle
                      logout();
                    }}
                    className="w-full"
                  >
                    <div className="py-1 px-4 hover:text-pink-700 flex items-center space-x-2">
                      <BiLogOut className="text-lg" />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button className="text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded text-sm md:text-md">
              Login
            </button>
          </Link>
        )}
        <FaShoppingCart onClick={toggleCart} className="text-2xl md:text-2xl" />
      </div>

      <div
      className={`w-96 h-full fixed top-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
        <button
          onClick={toggleCart}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <AiFillCloseCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="px-6 py-4 flex-1 overflow-y-auto h-[calc(100vh-180px)]">
        {Object.keys(cart).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <BsBagFill className="w-12 h-12 mb-4" />
            <p className="text-lg">Your Cart is Empty</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {Object.keys(cart).map((k) => (
              <li key={k} className="bg-gray-50 rounded-lg p-4">
                <div className="flex space-x-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {cart[k].imageUrl ? (
                      <Image
                        src={cart[k].imageUrl}
                        alt={cart[k].name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <BsBagFill className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{cart[k].name}</h3>
                        <p className="text-sm text-gray-500">
                          {cart[k].size}, {cart[k].variant}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ₹{cart[k].price}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
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
                          className="text-pink-500 hover:text-pink-600 transition-colors"
                        >
                          <AiFillMinusCircle className="w-6 h-6" />
                        </button>
                        <span className="w-8 text-center font-medium">{cart[k].qty}</span>
                        <button
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
                          className="text-pink-500 hover:text-pink-600 transition-colors"
                        >
                          <AiFillPlusCircle className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer with Subtotal and Actions */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-xl font-bold">₹{subTotal}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/checkout">
            <button
              disabled={Object.keys(cart).length === 0}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                Object.keys(cart).length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              <BsBagFill className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </Link>
          
          <button
            onClick={clearCart}
            disabled={Object.keys(cart).length === 0}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              Object.keys(cart).length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Navbar;
