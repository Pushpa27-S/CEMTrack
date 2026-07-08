import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

function App() {
  return (
    <div>
      <nav className="navbar">
        <h2 className="logo">CEMTrack</h2>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/products" element={<Products />} />
</Routes>
    </div>
  );
}

export default App;