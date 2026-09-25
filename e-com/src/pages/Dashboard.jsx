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
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-500">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Products */}
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {totaoproduct}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              📦
            </div>
          </div>

          <p className="mt-4 text-sm text-orange-500">
            Products in store
          </p>
        </div>


        {/* Total Orders */}
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Orders
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {totalorder}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              🛒
            </div>
          </div>

          <p className="mt-4 text-sm text-orange-500">
            Orders received
          </p>
        </div>


        {/* Total Sales */}
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Sales
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                Rs. {totalSales}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              💰
            </div>
          </div>

          <p className="mt-4 text-sm text-orange-500">
            Total revenue
          </p>
        </div>


        {/* Total Categories */}
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {totalCategories}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              🗂️
            </div>
          </div>

          <p className="mt-4 text-sm text-orange-500">
            Categories in store
          </p>
        </div>

      </div>


      {/* Recent Orders */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest orders from your store
          </p>
        </div>

        {/* Orders */}
        <div className="overflow-x-auto">

          {recentOrders.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
              No recent orders found.
            </div>
          ) : (
            <table className="w-full text-left">

              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Product
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Price
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
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

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {Order.productName}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        Rs. {Order.productPrice}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {Order.quantity}
                      </td>

                      <td className="px-6 py-4 font-semibold text-orange-500">
                        Rs. {Order.totalPrice}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
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