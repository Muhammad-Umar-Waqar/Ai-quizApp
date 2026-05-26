// app/signin/page.js
"use client"
import React, { useState } from 'react'

import { Link } from 'next/link';
import "./style.css"
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';



export default function page() {

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const router = useRouter();
  
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
        localStorage.setItem('token', result.token);
        toast.success("User Signed In Successfully!")
        router.push('/dashboard/profile'); // Redirect to dashboard after successful sign-in
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Something went wrong. Please try again.');
    } 
    finally {
        setLoading(false); // Set loading to false after submission is complete
      }
    }
    


  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };


  // handleSignup
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
        toast.success(`${name} Signed Up Successfully!`)
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Something went wrong. Please try again.');
    }finally{
      setLoading(false);
    }
  };


  return (
    <div className="mt-20">
    
     <div className={`containers ${isRightPanelActive ? 'right-panel-active' : ''}`} id="containers">
      <div className="form-containers sign-up-containers">
        <form action="#">
          <h1>Create Account</h1>
          <div className="social-containers">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
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
        <form action="#">
          <h1>Sign in</h1>
          <div className="social-containers">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
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
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
