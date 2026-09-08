import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Stock from "./pages/Stock";
import Search from "./pages/Search";

import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import CustomerHome from "./pages/CustomerHome";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerProducts from "./pages/CustomerProducts";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";


import "./App.css";

function App() {
return (
<Routes>

  {/* ================= PUBLIC PAGES ================= */}

  <Route
    path="/"
    element={
      <>
        <Navbar />
        <Home />
      </>
    }
  />

  <Route
    path="/about"
    element={
      <>
        <Navbar />
        <About />
      </>
    }
  />

  <Route
    path="/contact"
    element={
      <>
        <Navbar />
        <Contact />
      </>
    }
  />


  {/* ================= AUTHENTICATION ================= */}

  <Route
    path="/adminlogin"
    element={<AdminLogin />}
  />

  <Route
    path="/adminorders"
    element={<AdminOrders />}
  />

  

  <Route
    path="/register"
    element={<Register />}
  />

  <Route
    path="/forgot-password"
    element={<ForgotPassword />}
  />


  {/* ================= CUSTOMER ================= */}

  <Route
    path="/customerlogin"
    element={<CustomerLogin />}
  />

  <Route
    path="/customer-home"
    element={<CustomerHome />}
  />

  <Route
    path="/customer-products"
    element={<CustomerProducts />}
  />

  <Route
    path="/cart"
    element={<Cart />}
  />
  <Route
    path="/my-orders"
    element={<MyOrders />}
    />
    <Route
    path="/my-profile"
    element={<MyProfile />}
    />
  


  {/* ================= ADMIN ================= */}

  <Route element={<AdminLayout />}>

    

    <Route
      path="/dashboard"
      element={<Dashboard />}
    />

    <Route
      path="/products"
      element={<Products />}
    />

    <Route
      path="/customers"
      element={<Customers />}
    />

    <Route
      path="/billing"
      element={<Billing />}
    />

    <Route
      path="/reports"
      element={<Reports />}
    />

    <Route
      path="/stock"
      element={<Stock />}
    />

    <Route
      path="/search"
      element={<Search />}
    />

  </Route>

</Routes>

);
}

export default App;