import React, { useState } from "react";
import "./Products.css";

import ultratech from "../assets/Ultratech.jpeg";
import acc from "../assets/Acc.jpeg";
import ambuja from "../assets/Ambuja.jpeg";
import dalmia from "../assets/Dalmia.jpeg";
import priya from "../assets/Priya.jpeg";
import ramco from "../assets/Ramco.jpeg";
import maha from "../assets/Maha.jpeg";
import birla from "../assets/Birla.webp";
import jk from "../assets/JK.jpeg";
import ultratech1 from "../assets/Ultratech43.jpeg";
import dalmia1 from "../assets/Dalmia53.webp";
import priya1 from "../assets/Priya43.webp";
import ramco1 from "../assets/Ramco53.webp";
const imageMap = {
  "ultratech cement": ultratech,
  "acc cement": acc,
  "ambuja cement": ambuja,
  "dalmia cement": dalmia,
  "priya cement": priya,
  "ramco cement": ramco,
  "maha cement": maha,
  "birla cement": birla,
  "jk cement": jk,
};


function Products() {

const [products,setProducts]=useState([

{
id:1,
image:ultratech,
name:"UltraTech Cement",
category:"OPC 53 Grade",
price:420,
stock:120,
sold:250
},

{
id:2,
image:acc,
name:"ACC Cement",
category:"PPC",
price:400,
stock:90,
sold:180
},

{
id:3,
image:ambuja,
name:"Ambuja Cement",
category:"OPC 43 Grade",
price:390,
stock:65,
sold:160
},

{
id:4,
image:dalmia,
name:"Dalmia Cement",
category:"PPC",
price:410,
stock:25,
sold:90
},

{
id:5,
image:priya,
name:"Priya Cement",
category:"OPC 53 Grade",
price:405,
stock:15,
sold:45
},

{
id:6,
image:ramco,
name:"Ramco Cement",
category:"PPC",
price:415,
stock:100,
sold:270
},

{
id:7,
image:maha,
name:"Maha Cement",
category:"OPC 53 Grade",
price:425,
stock:80,
sold:140
}

]);

const [showForm,setShowForm]=useState(false);

const [newProduct,setNewProduct]=useState({
name:"",
category:"",
price:"",
stock:"",
sold:"",
image:ultratech
});

const handleChange=(e)=>{
setNewProduct({
...newProduct,
[e.target.name]:e.target.value
});
};

const handleAdd=()=>{

if(
newProduct.name===""||
newProduct.category===""||
newProduct.price===""||
newProduct.stock===""){
alert("Please fill all fields");
return;
}
console.log(newProduct.name);
console.log(imageMap[newProduct.name]);
let productImage = imageMap[newProduct.name.toLowerCase()] || ultratech;

if (
  newProduct.name.toLowerCase() === "ultratech cement" &&
  newProduct.category === "OPC 43 Grade"
) {
  productImage = ultratech1;
}

if (
  newProduct.name.toLowerCase() === "dalmia cement" &&
  newProduct.category === "OPC 53 Grade"
) {
  productImage = dalmia1;
}

if (
  newProduct.name.toLowerCase() === "priya cement" &&
  newProduct.category === "OPC 43 Grade"
) {
  productImage = priya1;
}

if (
  newProduct.name.toLowerCase() === "ramco cement" &&
  newProduct.category === "OPC 53 Grade"
) {
  productImage = ramco1;
}

const product = {
  id: products.length + 1,
  image: productImage,
  name: newProduct.name,
  category: newProduct.category,
  price: `₹${newProduct.price}`,
  stock: Number(newProduct.stock),
  sold: Number(newProduct.sold)
};

const updatedProducts=
([...products,product]);
console.log(updatedProducts);
setProducts(updatedProducts);

setNewProduct({
name:"",
category:"",
price:"",
stock:"",
sold:"",
image:ultratech
});

setShowForm(false);

};

return(
  <div className="products-container">

<h1>Products Management</h1>

<div className="stats-container">

<div className="card">
<h3>Total Products</h3>
<p>{products.length}</p>
</div>

<div className="card">
<h3>In Stock</h3>
<p>{products.filter((p)=>p.stock>50).length}</p>
</div>

<div className="card">
<h3>Low Stock</h3>
<p>{products.filter((p)=>p.stock<=50).length}</p>
</div>

<div className="card">
<h3>Best Selling</h3>
<p>{products.reduce((a,b)=>a.sold>b.sold?a:b).name}</p>
</div>

</div>

<div className="top-controls">

<input
type="text"
className="search-box"
placeholder="Search Product..."
/>

<select className="filter-box">
<option>All Categories</option>
<option>OPC 53 Grade</option>
<option>OPC 43 Grade</option>
<option>PPC</option>
</select>

<button
className="add-btn"
onClick={()=>setShowForm(true)}
>
+ Add Product
</button>

</div>

{showForm && (

<div className="product-form">

<h2>Add Product</h2>

<input
type="text"
name="name"
placeholder="Product Name"
value={newProduct.name}
onChange={handleChange}
/>

<select
name="category"
value={newProduct.category}
onChange={handleChange}
>

<option value="">Select Category</option>
<option>OPC 53 Grade</option>
<option>OPC 43 Grade</option>
<option>PPC</option>

</select>

<input
type="number"
name="price"
placeholder="Price"
value={newProduct.price}
onChange={handleChange}
/>

<input
type="number"
name="stock"
placeholder="Stock"
value={newProduct.stock}
onChange={handleChange}
/>

<input
type="number"
name="sold"
placeholder="Sold"
value={newProduct.sold}
onChange={handleChange}
/>

<div className="form-buttons">

<button
className="save-btn"
onClick={handleAdd}
>
Save
</button>

<button
className="cancel-btn"
onClick={()=>setShowForm(false)}
>
Cancel
</button>

</div>

</div>

)}
<p>Total Products:
  {products.length}
</p>

<table className="products-table">

<thead>

<tr>

<th>ID</th>
<th>Image</th>
<th>Brand</th>
<th>Category</th>
<th>Price</th>
<th>Stock</th>
<th>Status</th>
<th>Sold</th>
<th>Action</th>

</tr>

</thead>

<tbody>
  {products.map((product) => (

<tr key={product.id}>

<td>{product.id}</td>

<td>
<img
src={product.image}
alt={product.name}
className="product-img"
/>
</td>

<td>{product.name}</td>

<td>{product.category}</td>

<td>{product.price}</td>

<td>{product.stock} Bags</td>

<td>
{product.stock > 50 ? (
<span className="in-stock">
In Stock
</span>
) : (
<span className="low-stock">
Low Stock
</span>
)}
</td>

<td>{product.sold}</td>

<td>

<button
className="edit-btn"
>
Edit
</button>

<button
className="delete-btn"
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default Products;