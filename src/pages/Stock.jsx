import React, { useState } from "react";
import "./Stock.css";
import productsData from "../data/ProductsData";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

function Stock() {

  const [products, setProducts] = useState(
    productsData.map((product) => ({
      id: product.id,
      product: product.brand,
      category: product.category,
      stock: product.stock,
      price: product.price,
      image: product.image,
    }))
  );

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedProducts,setSelectedProducts]=useState([]);

  // Dashboard Counts
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, item) => sum + item.stock,
    0
  );

  const highStock = products.filter(
    (item) => item.stock > 30
  ).length;

  const lowStock = products.filter(
    (item) => item.stock > 0 && item.stock <= 30
  ).length;

  const outStock = products.filter(
    (item) => item.stock === 0
  ).length;

  // Status
  const getStatus = (stock) => {

    if (stock === 0) return "OutofStock";

    if (stock <= 30) return "LowStock";

    return "HighStock";
  };
  const showProducts = (status) => {

  let list = [];

  if (status === "High Stock") {
    list = products.filter((item) => item.stock > 30);
  }

  if (status === "Low Stock") {
    list = products.filter(
      (item) => item.stock > 0 && item.stock <= 30
    );
  }

  if (status === "Out Of Stock") {
    list = products.filter((item) => item.stock === 0);
  }

  setSelectedProducts(list);

};

  // Pie Chart
  const pieData = [
    {
      name: "High Stock",
      value: highStock,
    },
    {
      name: "Low Stock",
      value: lowStock,
    },
    {
      name: "Out Of Stock",
      value: outStock,
    },
  ];

  const COLORS = [
  "#22C55E", // Bright Green
  "#FACC15", // Bright Yellow
  "#EF4444", // Bright Red
];

  // Search
  const filteredProducts = products.filter((item) =>
    item.product
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Add Product
  const addProduct = () => {

    if (!name || !qty) {

      alert("Enter Product Details");

      return;

    }

    const newProduct = {

      id:
        products.length > 0
          ? Math.max(...products.map((p) => p.id)) + 1
          : 1,

      product: name,

      stock: Number(qty),

    };

    setProducts([...products, newProduct]);

    setName("");

    setQty("");

  };

  // Update Button
  const editProduct = (item) => {

    setEditingId(item.id);

    setName(item.product);

    setQty("");

  };

  // Update Stock
  const updateProduct = () => {

    if (!qty) {

      alert("Enter New Stock");

      return;

    }

    setProducts(

      products.map((item) => {

        if (item.id === editingId) {

          const finalStock =
            item.stock + Number(qty);

          return {

            ...item,

            stock: finalStock,

          };

        }

        return item;

      })

    );

    alert("Stock Updated Successfully");

    setEditingId(null);

    setName("");

    setQty("");

  };

  // Delete Product
  const deleteProduct = (id) => {

    setProducts(

      products.filter((item) => item.id !== id)

    );

  };
    return (

    <div className="stock-page">

      <h1 className="title">🏗️ CemTrack Stock Management</h1>

      {/* Dashboard Cards */}

      <div className="cards">

        <div className="card">
          <h3>Total Products</h3>
          <h2>{totalProducts}</h2>
        </div>

        <div className="card">
          <h3>Total Stock</h3>
          <h2>{totalStock}</h2>
        </div>

        <div className="card">
          <h3>High Stock</h3>
          <h2>{highStock}</h2>
        </div>

        <div className="card">
          <h3>Low Stock</h3>
          <h2>{lowStock}</h2>
        </div>

        <div className="card">
          <h3>Out of Stock</h3>
          <h2>{outStock}</h2>
        </div>

      </div>

      {/* Search */}

      <div className="search-box">

        <input
          type="text"
          placeholder="🔍 Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Add / Update Form */}

      <div className="form">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          disabled={editingId !== null}
          onChange={(e) => setName(e.target.value)}
        />

        {editingId !== null && (

          <input
            type="number"
            value={
              products.find((p) => p.id === editingId)?.stock || 0
            }
            readOnly
            placeholder="Current Stock"
          />

        )}

        <input
          type="number"
          placeholder={
            editingId
              ? "Add New Stock"
              : "Enter Stock Quantity"
          }
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {

        <button
  onClick={() => {
    if (editingId) {
      updateProduct();
    } else {
      alert("Please click the Update button in the table to update stock.");
    }
  }}
>
  Update Stock
</button>  

        }

      </div>

      {/* Charts */}

      <div className="charts">

        {/* Bar Chart */}

        <div className="chart">

          <h3>Stock Quantity</h3>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={products}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="product" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="stock"
                fill="#86efe4"
                radius={[8,8,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Pie Chart */}

        <div className="chart">

          <h3>Stock Status</h3>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
                onClick={(entry) => 
               showProducts(entry.name)}
              >

                {

                  pieData.map((entry,index)=>(

                    <Cell
                      key={index}
                      fill={COLORS[index]}
                      style={{cursor:"pointer"}}
                    />

                  ))

                }

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Line Chart */}

      <div className="chart">

        <h3>Stock Trend</h3>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={products}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="product" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="stock"
              stroke="#22a7c5"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>
        <div className="stock-list">

  <h4>Selected Products</h4>

  {selectedProducts.length === 0 ? (

    <p>Click on High Stock, Low Stock or Out Of Stock.</p>

  ) : (

    <ul>

      {selectedProducts.map((item) => (

        <li key={item.id}>
          <strong>{item.product}</strong><br />
          Category:{item.category}<br />
          Stock:{item.stock} Bags
        </li>

      ))}

    </ul>

  )}

</div>

      </div>
      {/* Stock Table */}

      <table className="stock-table">

        <thead>

          <tr>

            <th>ID</th>

            <th>Product</th>

            <th>Current Stock</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredProducts.length > 0 ? (

            filteredProducts.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.product}</td>

                <td>{item.stock}</td>

                <td>

                  <span className={getStatus(item.stock)}>

                    {getStatus(item.stock) === "HighStock"
                      ? "High Stock"
                      : getStatus(item.stock) === "LowStock"
                      ? "Low Stock"
                      : "Out of Stock"}

                  </span>

                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => editProduct(item)}
                  >
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(item.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="5">

                No Products Found

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

export default Stock;