import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar'
import Product from './pages/Product'
import Categories from './pages/Categories'
import Order from './pages/Order'
import User from './pages/User'
import Dashboard from "./pages/Dashboard";
function App() {
 


  return (
    <BrowserRouter>
      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-8">
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/Product" element={<Product />} />
            <Route path="/admin/Categories" element={<Categories />} />
            <Route path="/admin/Order" element={<Order />} />
           <Route path="/admin/User" element={<User />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}

export default App