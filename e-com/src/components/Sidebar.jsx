import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="w-full bg-white border-r-2 border-orange-100 p-5 shadow-sm md:w-64 md:h-screen">

      <div className="border-b-2 border-orange-200 pb-5 mb-6">
        <h2 className="text-3xl font-extrabold text-orange-500">
          Admin Panel
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          E-Commerce Dashboard
        </p>
      </div>

      <div className="space-y-3">

        <Link
          to="/admin"
          className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/Categories"
          className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
        >
          📁 Categories
        </Link>

        <Link
          to="/admin/Product"
          className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
        >
          🛍️ Products
        </Link>

        <Link
          to="/admin/User"
          className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
        >
          👥 Users
        </Link>

        <Link
          to="/admin/Order"
          className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
        >
          📦 Orders
        </Link>

      </div>

    </div>
  )
}

export default Sidebar