import Link from "next/link";
import React from "react";
import Product from "../../../models/Product";
import mongoose from "mongoose";

const Tshirts = ({ products }) => {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          {Object.keys(products).length === 0 ? (
            <div className="text-center font-semibold text-gray-500">
              <h1 className="text-2xl">Not available at the moment</h1>
              <p className="text-xl">Try again later</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center">
              {Object.keys(products).map((key) => {
                const product = products[key];

                return (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    className="lg:w-1/5 md:w-1/2 p-4 w-full shadow-lg m-5"
                  >
                    <img
                      alt="ecommerce"
                      className="m-auto h-[30vh] md:h-[36vh] block"
                      src={product.img}
                    />
                    <div className="mt-4 text-center md:text-left">
                      <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                        T-Shirts
                      </h3>
                      <h2 className="text-gray-900 title-font text-lg font-medium">
                        {product.title}
                      </h2>
                      <p className="mt-1">₹{product.price}/-</p>
                      <p className="mt-1">
                        {product.size.includes("S") && (
                          <span className="border border-gray-300 px-1 mx-1">
                            S
                          </span>
                        )}
                        {product.size.includes("M") && (
                          <span className="border border-gray-300 px-1 mx-1">
                            M
                          </span>
                        )}
                        {product.size.includes("L") && (
                          <span className="border border-gray-300 px-1 mx-1">
                            L
                          </span>
                        )}
                        {product.size.includes("XL") && (
                          <span className="border border-gray-300 px-1 mx-1">
                            XL
                          </span>
                        )}
                        {product.size.includes("XXL") && (
                          <span className="border border-gray-300 px-1 mx-1">
                            XXL
                          </span>
                        )}
                      </p>
                      <p className="mt-1">
                        {product.color.map((color, index) => {
                          const colorClass = color.trim().toLowerCase();

                          return (
                            <button
                              key={index}
                              className="border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none"
                              style={{
                                backgroundColor: colorClass,
                              }}
                            ></button>
                          );
                        })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  let products = await Product.find({ category: "T-Shirt" });
  let tshirts = {};

  for (let item of products) {
    if (item.title in tshirts) {
      // Add color and size without checking `availableQty`
      if (!tshirts[item.title].color.includes(item.color)) {
        tshirts[item.title].color.push(item.color);
      }
      if (!tshirts[item.title].size.includes(item.size)) {
        tshirts[item.title].size.push(item.size);
      }
    } else {
      tshirts[item.title] = JSON.parse(JSON.stringify(item));

      // Initialize `color` and `size` arrays without checking `availableQty`
      tshirts[item.title].color = [item.color];
      tshirts[item.title].size = [item.size];
    }
  }

  return {
    props: { products: JSON.parse(JSON.stringify(tshirts)) }, // Pass all T-Shirts to the page component
  };
}



export default Tshirts;
