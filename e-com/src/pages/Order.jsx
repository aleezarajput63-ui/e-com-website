import React, { useEffect, useState } from 'react'
import { Supabase } from '../../lib/ConnectSb'

function Order() {
  const [orderdata, setorderdata] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await Supabase.from("Order").select("*");

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setorderdata(data);
      }
    }

    fetchOrder();
  }, [])


  const del = async (id) => {
    const { data, error } = await Supabase
      .from("Order")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setorderdata(orderdata.filter((Order) => Order.id !== id));
    }
  }


  const updateStatus = async (id, newStatus) => {
    const { data, error } = await Supabase
      .from("Order")
      .update({
        status: newStatus,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
    } else {
      console.log(data);

      setorderdata(prev =>
        prev.map(order =>
          order.id === id
            ? { ...order, status: newStatus }
            : order
        )
      );
    }
  }


  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 p-3 sm:p-5 md:p-6">

      {/* Header */}
      <div className="mb-5 sm:mb-6">

        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Orders
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Manage your customer orders
        </p>

      </div>


      {/* Order Table Card */}
      <div className="w-full max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              All Orders
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {orderdata.length} Orders
            </p>
          </div>

        </div>


        {/* Only Table Scrolls */}
        <div className="w-full max-w-full overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="bg-orange-500 text-white">

              <tr>

                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 sm:text-sm">
                  Product
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 sm:text-sm">
                  Price
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 sm:text-sm">
                  Quantity
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 sm:text-sm">
                  Total
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 sm:text-sm">
                  Status
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold sm:px-6 sm:py-4 sm:text-sm">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {orderdata.map((Order) => {

                return (

                  <tr
                    key={Order.id}
                    className="border-b border-gray-100 transition hover:bg-orange-50"
                  >

                    {/* Product */}
                    <td className="px-4 py-4 sm:px-6">

                      <div className="min-w-[150px] whitespace-nowrap text-sm font-semibold text-gray-800">
                        {Order.productName}
                      </div>

                    </td>


                    {/* Price */}
                    <td className="px-4 py-4 sm:px-6">

                      <span className="whitespace-nowrap text-sm text-gray-600">
                        Rs. {Order.productPrice}
                      </span>

                    </td>


                    {/* Quantity */}
                    <td className="px-4 py-4 sm:px-6">

                      <span className="text-sm text-gray-600">
                        {Order.quantity}
                      </span>

                    </td>


                    {/* Total */}
                    <td className="px-4 py-4 sm:px-6">

                      <span className="whitespace-nowrap text-sm font-bold text-orange-500">
                        Rs. {Order.totalPrice}
                      </span>

                    </td>


                    {/* Status */}
                    <td className="px-4 py-4 sm:px-6">

                      <select
                        value={Order.status}
                        onChange={(e) => {
                          updateStatus(Order.id, e.target.value);
                        }}
                        className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm outline-none transition hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:text-sm"
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>


                    {/* Delete */}
                    <td className="px-4 py-4 sm:px-6">

                      <button
                        className="whitespace-nowrap rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white sm:text-sm"
                        onClick={() => {
                          del(Order.id)
                        }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Order