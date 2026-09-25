import { Supabase } from '../../lib/ConnectSb';
import React, { useEffect, useState } from 'react';

function User() {
  const [productsList, setProductsList] = useState([]);

  // LOCAL STORAGE: cart ko localStorage se load kar rahe hain
  const [cart, setcart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await Supabase.from("products").select("*");
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setProductsList(data);
      }
    };
    fetch();
  }, []);

  // LOCAL STORAGE: cart change hone par localStorage mein save hoga
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addcart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      setcart(
        cart.map((item) => {
          return item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item;
        })
      );

    } else {

      setcart([...cart, { ...product, quantity: 1 }]);

    }
  }

  const increaseQuantity = (id) => {
    setcart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  const decreaseQuantity = (id) => {
    setcart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setcart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, product) => sum + Number(product.productPrice) * product.quantity,
    0
  );

  const Check = async () => {

    const orders = cart.map((product) => ({
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: product.quantity,
      totalPrice: Number(product.productPrice) * product.quantity,
      status: "Pending"
    }));

    const { data, error } = await Supabase.from("Order").insert(orders).select();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-10">

      {/* My Cart */}
      <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">
            My Cart
          </h1>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
            {cart.length} Items
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Cart Items */}
          <div className="lg:col-span-2">

            {cart.length === 0 ? (
              <p className="rounded-xl bg-gray-50 p-6 text-center text-gray-400">
                Your cart is empty. Start adding products below!
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex items-center gap-5 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:shadow-sm"
                  >

                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-20 w-20 rounded-lg object-cover bg-gray-200"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold text-gray-800">
                        {product.productName}
                      </h2>

                      <p className="text-sm text-gray-400">
                        {product.category}
                      </p>

                      <p className="mt-1 font-bold text-orange-500">
                        Rs. {product.productPrice}
                      </p>

                      <div className="mt-2 flex items-center gap-2">

                        <button
                          onClick={() => decreaseQuantity(product.id)}
                          className="h-8 w-8 rounded-md bg-orange-500 font-bold text-white"
                        >
                          −
                        </button>

                        <button
                          onClick={() => increaseQuantity(product.id)}
                          className="h-8 w-8 rounded-md bg-orange-500 font-bold text-white"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="mt-2 rounded-md bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600"
                        >
                          Remove
                        </button>

                        <span className="font-semibold">
                          {product.quantity}
                        </span>

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-6">

            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Order Summary
            </h2>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-500">
                Items
              </span>

              <span className="font-semibold text-gray-800">
                {cart.length}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">
                Total
              </span>

              <span className="text-xl font-bold text-orange-500">
                Rs. {total}
              </span>
            </div>

            <button
              className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              onClick={() => { Check() }}
            >
              Checkout
            </button>

          </div>

        </div>
      </div>

      {/* Our Products */}
      <div>
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Our Products
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {productsList.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="h-48 w-full bg-gray-100">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">

                <h2 className="mb-1 truncate text-lg font-bold text-gray-800">
                  {product.productName}
                </h2>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  {product.category}
                </p>

                <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">

                  <h3 className="text-lg font-bold text-gray-900">
                    Rs. {product.productPrice}
                  </h3>

                  <button
                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                    onClick={() => addcart(product)}
                  >
                    + Add to Cart
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default User;