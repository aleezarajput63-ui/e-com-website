import { Supabase } from '../../lib/ConnectSb';
import React, { useEffect, useState } from 'react'

function Dashboard() {
  const [totaoproduct, settotalproduct] = useState(0);
  const [totalorder, settotalorder] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  // Categories
  const [totalCategories, setTotalCategories] = useState(0);

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const totals = async () => {

      const { data, error, count } = await Supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { data: orderData, error: orderError, count: orderCount } =
        await Supabase.from("Order").select("*", { count: "exact" });

      const { data: salesData, error: Saleserror } =
        await Supabase.from("Order").select("totalPrice");

      // Categories
      const { data: categoryData, error: categoryError, count: categoryCount } =
        await Supabase.from("categories").select("*", { count: "exact", head: true });

      const { data: recentData, error: recentError } =
        await Supabase.from("Order")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

      if (recentError) {
        console.log(recentError);
      } else {
        console.log(recentData);
        setRecentOrders(recentData);
      }

      if (Saleserror) {
        console.log(Saleserror);
      } else {
        const sales = salesData.reduce((sum, Order) => {
          return sum + Number(Order.totalPrice);
        }, 0);

        setTotalSales(sales);
      }

      if (orderError) {
        console.log(orderError);
      } else {
        console.log(orderData);
        settotalorder(orderCount);
      }

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        settotalproduct(count);
      }

      // Categories
      if (categoryError) {
        console.log(categoryError);
      } else {
        console.log(categoryData);
        setTotalCategories(categoryCount);
      }
    }

    totals();

  }, []);


  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 p-3 sm:p-5 md:p-6">

      {/* Header */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Welcome back! Here's what's happening with your store.
        </p>

      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">

        {/* Total Products */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5 md:p-6">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Products
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                {totaoproduct}
              </h2>

            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
              📦
            </div>

          </div>

          <p className="mt-4 text-xs text-orange-500 sm:text-sm">
            Products in store
          </p>

        </div>


        {/* Total Orders */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5 md:p-6">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Orders
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                {totalorder}
              </h2>

            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
              🛒
            </div>

          </div>

          <p className="mt-4 text-xs text-orange-500 sm:text-sm">
            Orders received
          </p>

        </div>


        {/* Total Sales */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5 md:p-6">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Sales
              </p>

              <h2 className="mt-2 break-words text-2xl font-bold text-gray-800 sm:text-3xl">
                Rs. {totalSales}
              </h2>

            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
              💰
            </div>

          </div>

          <p className="mt-4 text-xs text-orange-500 sm:text-sm">
            Total revenue
          </p>

        </div>


        {/* Total Categories */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5 md:p-6">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                {totalCategories}
              </h2>

            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
              🗂️
            </div>

          </div>

          <p className="mt-4 text-xs text-orange-500 sm:text-sm">
            Categories in store
          </p>

        </div>

      </div>


      {/* Recent Orders */}
      <div className="mt-6 w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-8">

        {/* Header */}
        <div className="border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5 md:px-6">

          <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
            Recent Orders
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Latest orders from your store
          </p>

        </div>


        {/* Orders */}
        <div className="w-full max-w-full overflow-x-auto">

          {recentOrders.length === 0 ? (

            <div className="px-4 py-10 text-center text-sm text-gray-500 sm:px-6">
              No recent orders found.
            </div>

          ) : (

            <table className="w-full min-w-[700px] text-left">

              <thead className="bg-orange-50">

                <tr>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-700 sm:px-6 sm:py-4 sm:text-sm">
                    Product
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-700 sm:px-6 sm:py-4 sm:text-sm">
                    Price
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-700 sm:px-6 sm:py-4 sm:text-sm">
                    Quantity
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-700 sm:px-6 sm:py-4 sm:text-sm">
                    Total
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-700 sm:px-6 sm:py-4 sm:text-sm">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentOrders.map((Order) => {

                  return (

                    <tr
                      key={Order.id}
                      className="border-b border-gray-100 transition hover:bg-orange-50/50"
                    >

                      {/* Product */}
                      <td className="px-4 py-4 sm:px-6">

                        <div className="min-w-[130px] whitespace-nowrap text-sm font-semibold text-gray-800">
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

                        <span className="whitespace-nowrap text-sm font-semibold text-orange-500">
                          Rs. {Order.totalPrice}
                        </span>

                      </td>


                      {/* Status */}
                      <td className="px-4 py-4 sm:px-6">

                        <span className="whitespace-nowrap rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-600">
                          {Order.status}
                        </span>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard