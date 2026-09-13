import React, { useEffect, useState } from "react";
import "./Stock.css";

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

// ========================================
// BACKEND STOCK API
// ========================================

const STOCK_API_URL =
  "http://localhost:5000/api/admin/inventory/stock";

function Stock() {

  // ========================================
  // STATES
  // ========================================

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [newStock, setNewStock] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // GET STOCK FROM DATABASE
  // ========================================

  const fetchStock = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(STOCK_API_URL);

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load stock"
        );

      }


      setProducts(
        data.products || []
      );


    } catch (error) {

      console.error(
        "Fetch stock error:",
        error
      );

      alert(
        "Failed to load stock from database"
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOAD STOCK WHEN PAGE OPENS
  // ========================================

  useEffect(() => {

    fetchStock();

  }, []);


  // ========================================
  // DASHBOARD COUNTS
  // ========================================

  const totalProducts =
    products.length;


  const totalStock =
    products.reduce(
      (sum, item) =>
        sum +
        Number(
          item.stock_quantity || 0
        ),
      0
    );


  const highStock =
    products.filter(
      (item) =>
        Number(item.stock_quantity) >
        Number(item.minimum_stock)
    ).length;


  const lowStock =
    products.filter(
      (item) =>
        Number(item.stock_quantity) > 0 &&
        Number(item.stock_quantity) <=
        Number(item.minimum_stock)
    ).length;


  const outStock =
    products.filter(
      (item) =>
        Number(item.stock_quantity) === 0
    ).length;


  // ========================================
  // GET STOCK STATUS
  // ========================================

  const getStatus = (product) => {

    const stock =
      Number(
        product.stock_quantity
      );

    const minimumStock =
      Number(
        product.minimum_stock
      );


    if (stock === 0) {

      return "OutofStock";

    }


    if (stock <= minimumStock) {

      return "LowStock";

    }


    return "HighStock";

  };


  // ========================================
  // SEARCH PRODUCTS
  // ========================================

  const filteredProducts =
    products.filter((item) => {

      const searchText =
        search.toLowerCase();


      const productName =
        (
          item.product_name || ""
        ).toLowerCase();


      const brand =
        (
          item.brand || ""
        ).toLowerCase();


      return (

        productName.includes(
          searchText
        ) ||

        brand.includes(
          searchText
        )

      );

    });


  // ========================================
  // CHART DATA
  // ========================================

  const chartData =
    products.map((item) => ({

      ...item,

      stock:
        Number(
          item.stock_quantity || 0
        ),

      displayName:
        `${item.brand} - ${item.category}`

    }));


  // ========================================
  // CLICK UPDATE BUTTON
  // ========================================

  const editProduct = (product) => {

    setEditingProduct(product);

    setNewStock("");

  };


  // ========================================
  // CANCEL UPDATE
  // ========================================

  const cancelUpdate = () => {

    setEditingProduct(null);

    setNewStock("");

  };


  // ========================================
  // UPDATE STOCK IN DATABASE
  // ========================================

  const updateStock = async () => {

    if (!editingProduct) {

      alert(
        "Please select a product first."
      );

      return;

    }


    if (
      newStock === "" ||
      Number(newStock) < 0
    ) {

      alert(
        "Please enter a valid stock quantity."
      );

      return;

    }


    try {

      const response =
        await fetch(

          `${STOCK_API_URL}/${editingProduct.product_id}`,

          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              stock_quantity:
                Number(newStock)

            })

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data.message ||
          "Failed to update stock"

        );

      }


      alert(
        "Stock updated successfully!"
      );


      // Reload latest database stock

      await fetchStock();


      // Clear form

      setEditingProduct(null);

      setNewStock("");


    } catch (error) {

      console.error(
        "Update stock error:",
        error
      );

      alert(error.message);

    }

  };


  // ========================================
  // CHART TOOLTIP
  // ========================================

  const CustomTooltip = ({
    active,
    payload
  }) => {

    if (
      active &&
      payload &&
      payload.length
    ) {

      const item =
        payload[0].payload;


      return (

        <div
          style={{

            background: "#ffffff",

            border:
              "1px solid #d9d9d9",

            borderRadius: "8px",

            padding: "12px 16px",

            boxShadow:
              "0 4px 12px rgba(0,0,0,0.15)"

          }}
        >

          <p
            style={{

              margin:
                "0 0 8px",

              fontWeight: "700",

              fontSize: "15px"

            }}
          >

            {item.product_name}

          </p>


          <p
            style={{
              margin: "5px 0"
            }}
          >

            <strong>
              Brand:
            </strong>

            {" "}

            {item.brand}

          </p>


          <p
            style={{
              margin: "5px 0"
            }}
          >

            <strong>
              Category:
            </strong>

            {" "}

            {item.category}

          </p>


          <p
            style={{
              margin: "5px 0"
            }}
          >

            <strong>
              Stock:
            </strong>

            {" "}

            {item.stock_quantity}

            {" "}

            Bags

          </p>

        </div>

      );

    }


    return null;

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="stock-page">

        <h2>
          Loading stock...
        </h2>

      </div>

    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="stock-page">


      {/* =================================
          TITLE
      ================================= */}

      <h1 className="title">

        🏗️ CemTrack Stock Management

      </h1>


      {/* =================================
          DASHBOARD CARDS
      ================================= */}

      <div className="cards">


        <div className="card">

          <h3>
            Total Products
          </h3>

          <h2>
            {totalProducts}
          </h2>

        </div>


        <div className="card">

          <h3>
            Total Stock
          </h3>

          <h2>
            {totalStock}
          </h2>

        </div>


        <div className="card">

          <h3>
            High Stock
          </h3>

          <h2>
            {highStock}
          </h2>

        </div>


        <div className="card">

          <h3>
            Low Stock
          </h3>

          <h2>
            {lowStock}
          </h2>

        </div>


        <div className="card">

          <h3>
            Out of Stock
          </h3>

          <h2>
            {outStock}
          </h2>

        </div>


      </div>


      {/* =================================
          BAR CHART
      ================================= */}

      <div className="chart">


        <h3>
          Stock Quantity
        </h3>


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

                fontSize: 12,

                fontWeight: 600

              }}

            />


            <YAxis />


            <Tooltip
              content={
                <CustomTooltip />
              }
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

 {/* =================================
          LINE CHART
      =================================*/}

      <div className="chart">


        <h3>
          Current Stock Overview
        </h3>


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

                fontSize: 12,

                fontWeight: 600

              }}

            />


            <YAxis />


            <Tooltip
              content={
                <CustomTooltip />
              }
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
      
      {/* =================================
          SEARCH
      ================================= */}

      <div className="search-box">

        <input

          type="text"

          placeholder="🔍 Search Product or Brand..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

        />

      </div>


      {/* =================================
          UPDATE STOCK FORM
      ================================= */}

      {editingProduct && (

        <div className="form">


          <input

            type="text"

            value={
              `${editingProduct.product_name} - ${editingProduct.category}`
            }

            readOnly

          />


          <input

            type="number"

            value={
              editingProduct.stock_quantity
            }

            readOnly

          />


          <input

            type="number"

            placeholder="Enter New Total Stock"

            value={newStock}

            onChange={(e) =>
              setNewStock(
                e.target.value
              )
            }

          />


          <button
            onClick={updateStock}
          >

            Update Stock

          </button>


          <button
            onClick={cancelUpdate}
          >

            Cancel

          </button>


        </div>

      )}


      {/* =================================
          STOCK TABLE
      ================================= */}

      <table className="stock-table">


        <thead>

          <tr>

            <th>
              ID
            </th>

            <th>
              Product
            </th>

            <th>
              Brand
            </th>

            <th>
              Category
            </th>

            <th>
              Current Stock
            </th>

            <th>
              Minimum Stock
            </th>

            <th>
              Status
            </th>

            <th>
              Actions
            </th>

          </tr>

        </thead>


        <tbody>


          {filteredProducts.length > 0 ? (

            filteredProducts.map(
              (item) => (

                <tr
                  key={
                    item.product_id
                  }
                >


                  <td>
                    {item.product_id}
                  </td>


                  <td>
                    {item.product_name}
                  </td>


                  <td>
                    {item.brand}
                  </td>


                  <td>
                    {item.category}
                  </td>


                  <td>
                    {item.stock_quantity}
                  </td>


                  <td>
                    {item.minimum_stock}
                  </td>


                  <td>

                    <span
                      className={
                        getStatus(item)
                      }
                    >

                      {getStatus(item) ===
                      "HighStock"

                        ? "High Stock"

                        : getStatus(item) ===
                          "LowStock"

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

                  </td>


                </tr>

              )
            )

          ) : (

            <tr>

              <td
                colSpan="8"
              >

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