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
    (sum, product) =>
      sum + Number(product.productPrice) * product.quantity,
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

    const { data, error } = await Supabase
      .from("Order")
      .insert(orders)
      .select();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }


  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 px-3 py-5 sm:px-5 sm:py-7 md:px-8 lg:px-10">

      {/* My Cart */}
      <div className="mb-8 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mb-10 sm:p-6 md:mb-12">

        {/* Cart Header */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

          <h1 className="text-2xl font-bold text-orange-500 sm:text-3xl">
            My Cart
          </h1>

          <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600 sm:text-sm">
            {cart.length} Items
          </span>

        </div>


        {/* Cart + Summary */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">

          {/* Cart Items */}
          <div className="min-w-0 lg:col-span-2">

            {cart.length === 0 ? (

              <p className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-400 sm:p-6">
                Your cart is empty. Start adding products below!
              </p>

            ) : (

              <div className="space-y-4">

                {cart.map((product, index) => (

                  <div
                    key={`${product.id}-${index}`}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:gap-5"
                  >

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-20 w-20 shrink-0 rounded-lg bg-gray-200 object-cover sm:h-24 sm:w-24"
                    />


                    {/* Product Details */}
                    <div className="min-w-0 flex-1">

                      <h2 className="truncate text-base font-bold text-gray-800 sm:text-lg">
                        {product.productName}
                      </h2>

                      <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        {product.category}
                      </p>

                      <p className="mt-1 font-bold text-orange-500">
                        Rs. {product.productPrice}
                      </p>


                      {/* Quantity Controls */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <button
                          onClick={() => decreaseQuantity(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 font-bold text-white transition hover:bg-orange-600"
                        >
                          −
                        </button>

                        <span className="min-w-7 text-center text-sm font-semibold text-gray-700">
                          {product.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 font-bold text-white transition hover:bg-orange-600"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="rounded-md bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 sm:text-sm"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* Order Summary */}
          <div className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">

            <h2 className="mb-5 text-lg font-bold text-gray-800 sm:text-xl">
              Order Summary
            </h2>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">

              <span className="text-sm text-gray-500 sm:text-base">
                Items
              </span>

              <span className="text-sm font-semibold text-gray-800 sm:text-base">
                {cart.length}
              </span>

            </div>


            <div className="mt-4 flex items-center justify-between gap-3">

              <span className="text-base font-bold text-gray-800 sm:text-lg">
                Total
              </span>

              <span className="text-lg font-bold text-orange-500 sm:text-xl">
                Rs. {total}
              </span>

            </div>


            <button
              className="mt-6 w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:text-base"
              onClick={() => {
                Check()
              }}
            >
              Checkout
            </button>

          </div>

        </div>

      </div>


      {/* Our Products */}
      <div className="w-full">

        <div className="mb-6 flex flex-col gap-1 sm:mb-8">

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Our Products
          </h1>

          <p className="text-xs text-gray-500 sm:text-sm">
            Explore our latest products
          </p>

        </div>


        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">

          {productsList.map((product) => (

            <div
              key={product.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Product Image */}
              <div className="h-52 w-full bg-gray-100 sm:h-48">

                <img
                  src={product.image}
                  alt={product.productName}
                  className="h-full w-full object-cover"
                />

              </div>


              {/* Product Details */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">

                <h2 className="mb-1 truncate text-base font-bold text-gray-800 sm:text-lg">
                  {product.productName}
                </h2>

                <p className="mb-2 truncate text-xs font-semibold uppercase tracking-wider text-orange-500">
                  {product.category}
                </p>

                <p className="mb-4 line-clamp-2 text-xs text-gray-500 sm:text-sm">
                  {product.description}
                </p>


                {/* Price + Add */}
                <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-4 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">

                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                    Rs. {product.productPrice}
                  </h3>

                  <button
                    className="w-full rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 min-[400px]:w-auto"
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