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

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

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

      {/* Authentication Pages */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Dashboard Pages */}

      <Route path="/" element={<AdminLayout />}>

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="products" element={<Products />} />

        <Route path="customers" element={<Customers />} />

        <Route path="billing" element={<Billing />} />

        <Route path="reports" element={<Reports />} />

        <Route path="stock" element={<Stock />} />

      </Route>

    </Routes>
  );
}

export default App;