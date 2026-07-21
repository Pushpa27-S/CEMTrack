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
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerHome from "./pages/CustomerHome";
import CustomerLogin from "./pages/CustomerLogin";
import "./App.css";

function App() {
  return (
    <Routes>

      {/* Public Pages */}

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
      <Route
        path="Search"
        element={
           <Search/>
          }
          />

      {/* Authentication */}

      <Route
        path="/adminlogin"
        element={<AdminLogin />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Dashboard */}

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
        <Route path="stock" element={<Stock />} />
        <Route path="Search"element={<Search/>} />
        <Route path="/customer-home" element={<CustomerHome />} /> 
        <Route path="/customerlogin" element={<CustomerLogin/>} />

      </Route>

    </Routes>
  );
}

export default App;