import React, { useState, useEffect } from "react";
import mongoose from "mongoose";
import Product from "../../../models/Product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error from "next/error";

const Slug = ({ buyNow, addToCart, product, variants, error}) => {
  const [pin, setPin] = useState();
  const [service, setService] = useState();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableQty, setAvailableQty] = useState(0);

  useEffect(() => {
    if(!error){
    // Set the first color and size as default on initial load
    const firstColor = Object.keys(variants)[0];
    if (firstColor) {
      setSelectedColor(firstColor);
      const firstSize = Object.keys(variants[firstColor])[0];
      if (firstSize) {
        setSelectedSize(firstSize);
        setAvailableQty(variants[firstColor][firstSize]?.availableQty || 0); // Set initial availableQty
      }
    }
  }
  }, [variants]);

  const checkServiceability = async () => {
    try {
      // Fetch data from the API
      const response = await fetch("http://localhost:3000/api/pincode", {
        method: "POST", // Ensure POST request is used
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pincode: pin }), // Pass the pincode to the API
      });

      // Parse the JSON response
      const pinJson = await response.json();

      // Check if pincode is found in the response
      if (response.ok) {
        // If serviceable, show success message
        setService(true);
        toast.success(
          `Your Pincode is serviceable! ${pinJson.districtName}, ${pinJson.stateName}`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } else {
        // If not found, show error message
        setService(false);
        toast.error("Your Pincode is not serviceable!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setService(false);
      toast.error("An error occurred while checking serviceability", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const onChangePin = (e) => {
    setPin(e.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const firstSize = Object.keys(variants[color])[0];
    setSelectedSize(firstSize);
    setAvailableQty(variants[color][firstSize]?.availableQty || 0); // Update availableQty
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setAvailableQty(variants[selectedColor][size]?.availableQty || 0); // Update availableQty
  };

  const getProductImage = () => {
    if (selectedColor && selectedSize) {
      const variant = variants[selectedColor][selectedSize];
      return variant.imageUrl || product.img;
    }
    return product.img;
  };

  if(error == 404){
    return <Error statusCode={404}/>
  }
  

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
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-16 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded"
              src={getProductImage()}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {product.brand || "CODESWEAR"}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title}
              </h1>
              <p className="leading-relaxed">
                {product.desc || "Product description goes here."}
              </p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div className="flex">
                  <span className="mr-3">Color</span>
                  {Object.keys(variants).map((color) => (
                    <button
                      key={color}
                      className={`border-2 rounded-full w-6 h-6 focus:outline-none ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    ></button>
                  ))}
                </div>

                <div className="flex ml-6 items-center">
                  <span className="mr-3">Size</span>
                  <div className="relative">
                    <select
                      className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-base pl-3 pr-10"
                      onChange={(e) => handleSizeChange(e.target.value)}
                      value={selectedSize || ""}
                      disabled={!selectedColor}
                    >
                      {selectedColor &&
                        Object.keys(variants[selectedColor]).map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                    </select>
                    <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex">
                {/* Display "Out of Stock" or Price */}
                {availableQty > 0 ? (
                  <span className="title-font font-medium text-2xl text-gray-900">
                    ₹{product.price || "0"}
                  </span>
                ) : (
                  <span className="title-font font-medium text-2xl text-red-500">
                    Currently Out of Stock!
                  </span>
                )}
                {/* Buy Now Button */}
                {availableQty > 0 && (<button
                  className="flex ml-8 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded"
                  onClick={() =>
                    buyNow(
                      product.slug,
                      1,
                      product.price,
                      product.title,
                      selectedSize,
                      selectedColor
                    )
                  }
                  disabled={availableQty <= 0} // Disable if out of stock
                >
                  Buy Now
                </button>)}

                {/* Add to Cart Button */}
                {availableQty > 0 && (
                  <button
                    onClick={() =>
                      addToCart(
                        product.slug,
                        1,
                        product.price,
                        product.title,
                        selectedSize,
                        selectedColor,
                        getProductImage()
                      )
                    }
                    className="flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded"
                    disabled={availableQty <= 0} // Disable if out of stock
                  >
                    Add to Cart
                  </button>
                )}
              </div>
              <div className="pin mt-6 flex space-x-2">
                <input
                  onChange={(e) => setPin(e.target.value)}
                  className="px-2 border-2 border-gray-400 rounded-md"
                  placeholder="Enter your pincode"
                  type="number"
                />
                <button
                  onClick={checkServiceability}
                  className="flex ml-16 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
                >
                  Check
                </button>
              </div>
              {!service && service != null && (
                <div className="text-red-700 text-sm mt-3">
                  Sorry! We don't deliver to this pincode yet.
                </div>
              )}
              {service && service != null && (
                <div className="text-green-700 text-sm mt-3">
                  Yay! We deliver to this pincode.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  let product = await Product.findOne({ slug: context.query.slug });
  
  if (product == null) {
    return{
      props:{error: 404}
    }
  }

  let variants = await Product.find({
    title: product.title,
    category: product.category,
  });

  let colorSizeSlug = {};
  for (let item of variants) {
    if (Object.keys(colorSizeSlug).includes(item.color)) {
      colorSizeSlug[item.color][item.size] = {
        slug: item.slug,
        imageUrl: item.img,
        availableQty: item.availableQty, // Add availableQty here
      };
    } else {
      colorSizeSlug[item.color] = {};
      colorSizeSlug[item.color][item.size] = {
        slug: item.slug,
        imageUrl: item.img,
        availableQty: item.availableQty, // Add availableQty here
      };
    }
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(colorSizeSlug)),
    },
  };
}

export default Slug;
