import "@/styles/globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingBar from "react-top-loading-bar";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [total, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState(0);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }

    const token = localStorage.getItem("token");
    if (token) {
      setUser({ value: token });
    }
    setKey(Math.random());
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("MyUser")
    setUser({ value: null });
    setKey(Math.random());
    router.push("/");
  };

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubTotal(subt);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    // Create a unique key for each combination of name, size, and variant
    const itemKey = `${name}-${size}-${variant}`;
    console.log("Adding to cart:", itemCode, qty, price, name, size, variant);
  
    // Copy the existing cart
    let newCart = { ...cart };
  
    // Check if the item with this unique key (itemKey) is already in the cart
    if (itemKey in newCart) {
      newCart[itemKey].qty += qty; // Increment quantity if it exists
    } else {
      // Otherwise, add it as a new item in the cart
      newCart[itemKey] = { qty, price, name, size, variant, itemCode }; // Include itemCode here
    }
  
    // Update the cart and save it
    setCart(newCart);
    saveCart(newCart);
  };
  
  const buyNow = (itemCode, qty, price, name, size, variant) => {
    console.log("Buying now:", itemCode, qty, price, name, size, variant);
  
    // Create a unique key for the item
    const itemKey = `${name}-${size}-${variant}`;
  
    // Create a new cart with only this item
    let newCart = {
      [itemKey]: {
        qty: qty,
        price: price,
        name: name,
        size: size,
        variant: variant,
        itemCode,
      },
    };
  
    // Update the cart and save it
    setCart(newCart);
    saveCart(newCart);
  
    // Optionally, navigate to the cart or checkout page
    router.push("/checkout");
  };
  const removeFromCart = (itemCode, qty) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty = newCart[itemCode].qty - qty;
    }
    if (newCart[itemCode].qty <= 0) {
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
    console.log("cart cleared");
  };

  return (
    <div className="h-full flex flex-col min-h-screen">
      <LoadingBar
        color="#ff2d55"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar
        user={user}
        key={key}
        cart={cart}
        buyNow={buyNow}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={total}
        logout={logout}
      />
      <div className="flex-grow">
        <Component
          cart={cart}
          buyNow={buyNow}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={total}
          {...pageProps}
        />
      </div>
      <Footer />
    </div>
  );
}
