import {useState} from "react";
import {Link} from "react-router-dom";

function Register(){

const[name,setName]=useState("");
const[email,setEmail]=useState("");
const[password,setPassword]=useState("");

const register=(e)=>{

e.preventDefault();

if(name===""||email===""||password===""){
alert("Fill all fields");
return;
}

alert("Registration Successful");

}

return(

<div className="login-container">

<div className="login-box">

<h2>Register</h2>

<form onSubmit={register}>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

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

<button>Create Account</button>

</form>

<p>

<Link to="/">Back to Login</Link>

</p>

</div>

</div>

)

}

export default Register;