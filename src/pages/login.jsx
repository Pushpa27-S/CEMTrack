import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

const navigate = useNavigate();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const handleLogin=(e)=>{
e.preventDefault();

if(email===""){
alert("Enter Email");
return;
}

if(password===""){
alert("Enter Password");
return;
}

navigate("/home");
}

return(

<div className="login-container">

<div className="login-box">

<h1>CemTrack</h1>

<h3>Login</h3>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button>Login</button>

</form>

<p>

<Link to="/forgot">Forgot Password?</Link>

</p>

<p>

Don't have an account?

<Link to="/register"> Register</Link>

</p>

</div>

</div>

)

}

export default Login;