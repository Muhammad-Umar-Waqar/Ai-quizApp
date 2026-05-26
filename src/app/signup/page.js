// app/signup/page.js
"use client"
import React, { useState } from 'react'
import { Link } from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Preloader from '../../../utils/loading/preloader';



export default function page() {

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const router = useRouter();
const [fullPageLoader, setFullPageLoader] = useState(false);
  
  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Save JWT token to localStorage/session
        setFullPageLoader(true);
        localStorage.setItem('token', result.token);
        toast.success("User Signed In Successfully!")
        router.push('/dashboard/profile'); // Redirect to dashboard after successful sign-in
      } else {
        if (result.error && result.error.issues) {
            result.error.issues.forEach((issue) => {
                toast.error(issue.message); // Display each validation error message using toast
            });
        } else {
            toast.error(result.error); // Handle other errors that may not be validation-related
        }
        setError(result.error);
    }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Something went wrong. Please try again.');
    } 
    finally {
        setLoading(false); // Set loading to false after submission is complete
        setFullPageLoader(false);
      }
    }
    


  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch('/api/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            toast.success(`${name} Signed Up Successfully!`);
        } else {
            if (result.error && result.error.issues) {
                result.error.issues.forEach((issue) => {
                    toast.error(issue.message); // Display each validation error message using toast
                });
            } else {
                toast.error(result.error); // Handle other errors that may not be validation-related
            }
            setError(result.error);
        }
    } catch (err) {
        console.error('Error signing up:', err);
        setError('Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
};


if (fullPageLoader){
  return(
    <div>
      <Preloader/>
    </div>
  )
}

  return (
    <div className="mt-20">
    
     <div className={`containers ${isRightPanelActive ? 'right-panel-active' : ''}`} id="containers">
      <div className="form-containers sign-up-containers">
        <form action="#" className='sm:px-[50px] px-4'>
          <h1 className='sm:text-auto  text-2xl sm:mb-5 mb-10'>Create Account</h1>
         
          <input type="text"
              value={name}
              className="text-gray-800"
               placeholder="Name"
               onChange={(e) => setName(e.target.value)}
                required />
          <input type="email"
              value={email}
              className="text-gray-800"
               placeholder="Email"
               onChange={(e) => setEmail(e.target.value)}
                required />
          <input type="password"
              className="text-gray-800"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required  />
          <button onClick={handleSignup}>{loading ? 'Signing Up...' : 'Sign Up'} </button>
        </form>
        
      </div>
      <div className="form-containers sign-in-containers">
        <form action="#" className="sm:px-[50px] px-4">
          <h1 className='sm:text-auto  text-2xl sm:mb-5 mb-10'>Sign In</h1>
          <input  type="email" className="text-gray-800" value={email}  placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
          <input type="password"
              className="text-gray-800"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required  />
          <a href="#">Forgot your password?</a>
          <button  onClick={handleSignin}>{loading ? 'Signing in...' : 'Login'} </button>
        </form>
      </div>
      <div className="overlay-containers">
        <div className="overlay">
          <div className="overlay-panel overlay-left ">
            <h1>Welcome Back!</h1>
            <p className='md:px-10 px-2'>To keep connected with us please login with your personal info</p>
            <button className="ghost " id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className={`overlay-panel overlay-right px-0 `}>
            <h1>Hello, Friend!</h1>
            <p className='md:px-10  px-2 '>Enter your personal details and start journey with us</p>
            <button className="ghost " id="signUp " onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    
<style jsx>
{`


@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');




p {
font-size: 14px;
font-weight: 100;
line-height: 20px;
letter-spacing: 0.5px;
margin: 20px 0 30px;
}

span {
font-size: 12px;
}

a {
color: #333;
font-size: 14px;
text-decoration: none;
margin: 15px 0;
}

button {
border-radius: 20px;
border: 1px solid #4e4bfa;
background-color: #2f2bff;
color: #FFFFFF;
font-size: 12px;
font-weight: bold;
padding: 12px 45px;
letter-spacing: 1px;
text-transform: uppercase;
transition: transform 80ms ease-in;
}

button:active {
transform: scale(0.95);
}

button:focus {
outline: none;
}

button.ghost {

background-color: transparent;
border-color: #FFFFFF;
}

form {
background-color: #FFFFFF;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
height: 100%;
text-align: center;
}

input {
background-color: #eee;
border: none;
padding: 12px 15px;
margin: 8px 0;
width: 100%;
}

.containers {
background-color: #fff;
border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
    0 10px 10px rgba(0,0,0,0.22);
position: relative;
overflow: hidden;
width: 768px;
max-width: 100%;
min-height: 480px;
  margin-left: auto;
  margin-right: auto;
  
}

.form-containers {
position: absolute;
top: 0;
height: 100%;
transition: all 0.6s ease-in-out;
}

.sign-in-containers {
left: 0;
width: 50%;
z-index: 2;
}

.containers.right-panel-active .sign-in-containers {
transform: translateX(100%);
}

.sign-up-containers {
left: 0;
width: 50%;
opacity: 0;
z-index: 1;
}

.containers.right-panel-active .sign-up-containers {
transform: translateX(100%);
opacity: 1;
z-index: 5;
animation: show 0.6s;
}

@keyframes show {
0%, 49.99% {
  opacity: 0;
  z-index: 1;
}

50%, 100% {
  opacity: 1;
  z-index: 5;
}
}

.overlay-containers {
position: absolute;
top: 0;
left: 50%;
width: 50%;
height: 100%;
overflow: hidden;
transition: transform 0.6s ease-in-out;
z-index: 100;
}

.containers.right-panel-active .overlay-containers{
transform: translateX(-100%);
}

.overlay {
background: #4d42e6;
background: -webkit-linear-gradient(to right, #4a51ad, #41c3ff);
background: linear-gradient(to right, #2b37a7, #5caccc);
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #FFFFFF;
position: relative;
left: -100%;
height: 100%;
width: 200%;
  transform: translateX(0);
transition: transform 0.6s ease-in-out;
}

.containers.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
position: absolute;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
text-align: center;
top: 0;
height: 100%;
width: 50%;
transform: translateX(0);
transition: transform 0.6s ease-in-out;
}

.overlay-left {
transform: translateX(-20%);
}

.containers.right-panel-active .overlay-left {
transform: translateX(0);
}

.overlay-right {
right: 0;
transform: translateX(0);
}

.container.right-panel-active .overlay-right {
transform: translateX(20%);
}



`}


</style>
    </div>

  )
}
