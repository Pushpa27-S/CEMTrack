import React from "react";
import { Link } from "react-router-dom";

function CustomerHome() {
return (
<div style={{ padding: "40px" }}>

  <h1>Welcome Customer 👋</h1>

  <p>
    You have successfully logged in.
  </p>

  <h3>Customer Features</h3>

  <ul>
    <li>
      <Link to="/customer-products">
        View Products
      </Link>
    </li>

    <li>
      <Link to="/cart">
        Add to Cart
      </Link>
    </li>

    <li>
      <Link to="/my-orders">
        Place Orders / My Orders
      </Link>
    </li>

    <li>
      <Link to="/customer-profile">
        My Profile
      </Link>
    </li>
  </ul>

</div>

);
}

export default CustomerHome;