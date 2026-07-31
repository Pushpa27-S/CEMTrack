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
const [selectedProducts, setSelectedProducts] = useState([]);

/* ================================
DASHBOARD COUNTS
================================= */

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

/* ================================
STATUS
================================= */

const getStatus = (stock) => {

if (stock === 0) return "OutofStock";

if (stock <= 30) return "LowStock";

return "HighStock";

};

/* ================================
SEARCH
================================= */

const filteredProducts = products.filter((item) =>
item.product
.toLowerCase()
.includes(search.toLowerCase())
);

/* ================================
CHART DATA

 Brand + Category are combined
 so every product appears separately.

================================= */

const chartData = products.map((item) => ({
...item,

displayName:
  `${item.product} - ${item.category}`,

}));

/* ================================
ADD PRODUCT
================================= */

const addProduct = () => {

if (!name || !qty) {

  alert("Enter Product Details");

  return;

}

const newProduct = {

  id:
    products.length > 0
      ? Math.max(
          ...products.map((p) => p.id)
        ) + 1
      : 1,

  product: name,

  category: "OPC 53",

  stock: Number(qty),

};

setProducts([
  ...products,
  newProduct
]);

setName("");
setQty("");

};

/* ================================
UPDATE BUTTON
================================= */

const editProduct = (item) => {

setEditingId(item.id);

setName(item.product);

setQty("");

};

/* ================================
UPDATE STOCK
================================= */

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

/* ================================
DELETE PRODUCT
================================= */

const deleteProduct = (id) => {

setProducts(
  products.filter(
    (item) => item.id !== id
  )
);

};

/* ================================
CHART TOOLTIP
================================= */

const CustomTooltip = ({ active, payload }) => {

if (
  active &&
  payload &&
  payload.length
) {

  const item = payload[0].payload;

  return (

    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        padding: "12px 16px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.15)"
      }}
    >

      <p
        style={{
          margin: "0 0 8px",
          fontWeight: "700",
          fontSize: "15px"
        }}
      >
        {item.product}
      </p>

      <p style={{ margin: "5px 0" }}>
        <strong>Category:</strong>{" "}
        {item.category}
      </p>

      <p style={{ margin: "5px 0" }}>
        <strong>Stock:</strong>{" "}
        {item.stock} Bags
      </p>

    </div>

  );

}

return null;

};

return (

<div className="stock-page">


  {/* ================================
      TITLE
  ================================= */}

  <h1 className="title">
    🏗️ CemTrack Stock Management
  </h1>


  {/* ================================
      DASHBOARD CARDS
  ================================= */}

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


  {/* ================================
      SEARCH
  ================================= */}

  <div className="search-box">

    <input
      type="text"
      placeholder="🔍 Search Product..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />

  </div>


  {/* ================================
      ADD / UPDATE FORM
  ================================= */}

  <div className="form">

    <input
      type="text"
      placeholder="Product Name"
      value={name}
      disabled={editingId !== null}
      onChange={(e) =>
        setName(e.target.value)
      }
    />


    {editingId !== null && (

      <input
        type="number"
        value={
          products.find(
            (p) => p.id === editingId
          )?.stock || 0
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
      onChange={(e) =>
        setQty(e.target.value)
      }
    />


    <button
      onClick={() => {

        if (editingId) {

          updateProduct();

        } else {

          alert(
            "Please click the Update button in the table to update stock."
          );

        }

      }}
    >
      Update Stock
    </button>

  </div>


  {/* ================================
      BAR CHART
  ================================= */}

  <div className="chart">

    <h3>Stock Quantity</h3>

    <ResponsiveContainer
      width="100%"
      height={500}
    >

      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 130
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
        />


        <XAxis
          dataKey="displayName"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={140}
          tick={{
            fontSize: 14,
            fontWeight: 600
          }}
        />


        <YAxis />


        <Tooltip
          content={<CustomTooltip />}
        />


        <Legend />


        <Bar
          dataKey="stock"
          name="Stock"
          fill="#86efe4"
          radius={[
            8,
            8,
            0,
            0
          ]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>


  {/* ================================
      LINE CHART
  ================================= */}

  <div className="chart">

    <h3>Stock Trend</h3>

    <ResponsiveContainer
      width="100%"
      height={500}
    >

      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 130
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
        />


        <XAxis
          dataKey="displayName"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={140}
          tick={{
            fontSize: 14,
            fontWeight: 600
          }}
        />


        <YAxis />


        <Tooltip
          content={<CustomTooltip />}
        />


        <Legend />


        <Line
          type="monotone"
          dataKey="stock"
          name="Stock"
          stroke="#22a7c5"
          strokeWidth={3}
          dot={{
            r: 5
          }}
          activeDot={{
            r: 8
          }}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>


  {/* ================================
      STOCK TABLE
  ================================= */}

  <table className="stock-table">

    <thead>

      <tr>

        <th>ID</th>

        <th>Product</th>

        <th>Category</th>

        <th>Current Stock</th>

        <th>Status</th>

        <th>Actions</th>

      </tr>

    </thead>


    <tbody>

      {filteredProducts.length > 0 ? (

        filteredProducts.map(
          (item) => (

            <tr key={item.id}>

              <td>
                {item.id}
              </td>


              <td>
                {item.product}
              </td>


              <td>
                {item.category}
              </td>


              <td>
                {item.stock}
              </td>


              <td>

                <span
                  className={getStatus(
                    item.stock
                  )}
                >

                  {getStatus(
                    item.stock
                  ) === "HighStock"

                    ? "High Stock"

                    : getStatus(
                        item.stock
                      ) === "LowStock"

                    ? "Low Stock"

                    : "Out of Stock"}

                </span>

              </td>


              <td>

                <button
                  className="edit-btn"
                  onClick={() =>
                    editProduct(item)
                  }
                >
                  Update
                </button>


                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteProduct(
                      item.id
                    )
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          )
        )

      ) : (

        <tr>

          <td colSpan="6">
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