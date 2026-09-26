import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
     
      <div className="w-full bg-white border-b-2 border-orange-100 p-4 flex justify-between items-center md:hidden sticky top-0 z-50 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-orange-500">Admin Panel</h2>
          <p className="text-xs text-gray-500">E-Commerce Dashboard</p>
        </div>
       
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-orange-500 focus:outline-none p-2 rounded-lg border border-orange-200"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      
      <div className={`
        fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out
        w-64 bg-white border-r-2 border-orange-100 p-5 shadow-sm h-screen z-40
        flex flex-col justify-between
      `}>
        
        <div>
          
          <div className="hidden md:block border-b-2 border-orange-200 pb-5 mb-6">
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
              onClick={() => setIsOpen(false)} 
              className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            >
              📊 Dashboard
            </Link>

            <Link
              to="/admin/Categories"
              onClick={() => setIsOpen(false)}
              className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            >
              📁 Categories
            </Link>

            <Link
              to="/admin/Product"
              onClick={() => setIsOpen(false)}
              className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            >
              🛍️ Products
            </Link>

            <Link
              to="/admin/User"
              onClick={() => setIsOpen(false)}
              className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            >
              👥 Users
            </Link>

            <Link
              to="/admin/Order"
              onClick={() => setIsOpen(false)}
              className="block border border-orange-200 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            >
              📦 Orders
            </Link>
          </div>
        </div>

      </div>

     
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar
