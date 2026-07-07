import {useState} from "react";
import {Link} from "react-router-dom";

function ForgotPassword(){

const[email,setEmail]=useState("");

const submit=(e)=>{

e.preventDefault();

if(email===""){
alert("Enter Email");
return;
}

alert("Password Reset Link Sent");

}

return(

<div className="login-container">

<div className="login-box">

<h2>Forgot Password</h2>

<form onSubmit={submit}>

<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<button>Send Link</button>

</form>

<p>

<Link to="/">Back</Link>

</p>

</div>

</div>

)

}

export default ForgotPassword;