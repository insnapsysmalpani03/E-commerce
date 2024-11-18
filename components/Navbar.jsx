import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { BsBagFill } from "react-icons/bs";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { MdPerson } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";

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
  const dropdownRef = useRef(null);
  const cartRef = useRef();

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
    if (cartRef.current.classList.contains("translate-x-full")) {
      cartRef.current.classList.remove("translate-x-full");
      cartRef.current.classList.add("translate-x-0");
    } else if (!cartRef.current.classList.contains("translate-x-full")) {
      cartRef.current.classList.remove("translate-x-0");
      cartRef.current.classList.add("translate-x-full");
    }
  };

  const toggleDropdown = () => {
    setDropdown(!dropdown);
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
        ref={cartRef}
        className="w-76 h-full sidebar overflow-y-scroll fixed top-0 right-0 bg-pink-100 px-8 py-10 transform transition-transform translate-x-full z-50"
      >
        <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
        <span
          onClick={toggleCart}
          className="absolute top-5 right-2 cursor-pointer text-2xl text-pink-500"
        >
          <AiFillCloseCircle />
        </span>
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length == 0 && (
            <div className="my-4 font-semibold">Your Cart is Empty</div>
          )}
          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-5">
                  <div className="w-2/3 font-semibold">
                    {cart[k].name} ({cart[k].size}, {cart[k].variant})
                  </div>
                  <div className="w-1/3 font-semibold flex items-center justify-center text-xl">
                    <AiFillMinusCircle
                      onClick={() => {
                        removeFromCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant
                        );
                      }}
                      className="text-pink-500 cursor-pointer"
                    />
                    <span className="mx-2 text-sm">{cart[k].qty}</span>
                    <AiFillPlusCircle
                      onClick={() => {
                        addToCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant
                        );
                      }}
                      className="text-pink-500 cursor-pointer"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="total my-2 font-semibold">Subtotal: ₹{subTotal}</div>
        <div className="flex">
          <Link href={"/checkout"}>
            <button
              disabled={Object.keys(cart).length === 0}
              className={`flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none rounded text-md ${
                Object.keys(cart).length === 0
                  ? "bg-pink-300 cursor-not-allowed"
                  : "hover:bg-pink-600"
              }`}
            >
              <BsBagFill className="m-1" />
              Checkout
            </button>
          </Link>
          <button
            onClick={clearCart}
            disabled={Object.keys(cart).length === 0}
            className={`flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none rounded text-md ${
              Object.keys(cart).length === 0
                ? "bg-pink-300 cursor-not-allowed"
                : "hover:bg-pink-600"
            }`}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
