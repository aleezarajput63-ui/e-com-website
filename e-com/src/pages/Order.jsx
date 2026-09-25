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
    const { data, error } = await Supabase.from("Order").delete()
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setorderdata(orderdata.filter((Order) => Order.id !== id));
    }
  }


  const updateStatus = async (id, newStatus) => {
    const { data, error } = await Supabase.from("Order").update({
      status: newStatus,
    }).eq("id", id).select();

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:mb-8 sm:text-3xl">
        Orders
      </h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">

        <table className="w-full min-w-[800px] text-left">

          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-4 py-3 text-sm sm:px-6 sm:py-4 sm:text-base">
                Product
              </th>

              <th className="px-4 py-3 text-sm sm:px-6 sm:py-4 sm:text-base">
                Price
              </th>

              <th className="px-4 py-3 text-sm sm:px-6 sm:py-4 sm:text-base">
                Quantity
              </th>

              <th className="px-4 py-3 text-sm sm:px-6 sm:py-4 sm:text-base">
                Total
              </th>

              <th className="px-4 py-3 text-sm sm:px-6 sm:py-4 sm:text-base">
                Status
              </th>

              <th className="px-4 py-3 text-sm sm:px-6 sm:py-4 sm:text-base">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {orderdata.map((Order) => {
              return (
                <tr
                  key={Order.id}
                  className="border-b border-gray-200 hover:bg-orange-50"
                >

                  <td className="px-4 py-3 font-semibold text-gray-800 sm:px-6 sm:py-4">
                    {Order.productName}
                  </td>

                  <td className="px-4 py-3 text-gray-600 sm:px-6 sm:py-4">
                    Rs. {Order.productPrice}
                  </td>

                  <td className="px-4 py-3 text-gray-600 sm:px-6 sm:py-4">
                    {Order.quantity}
                  </td>

                  <td className="px-4 py-3 font-semibold text-orange-500 sm:px-6 sm:py-4">
                    Rs. {Order.totalPrice}
                  </td>

                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <select
                      value={Order.status}
                      onChange={(e) => {
                        updateStatus(Order.id, e.target.value);
                      }}
                      className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <button
                      className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                      onClick={() => { del(Order.id) }}
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
  );
}

export default Order