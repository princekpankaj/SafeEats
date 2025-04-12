import React, { useState } from "react";
import SafeEats_logo from "../Images/SafeEats_logo.png";
import SignUpBg from "../Images/SignUp-bg.png"; // Import the background image
import './SignIn';
import SignIn from "./SignIn";
import { useNavigate } from "react-router-dom";


const SignUp = () => {

  const formhandler = (e) => {
    e.preventDefault();

    /*we have to convert the data into "Object" if we want to get the data from localStorage, so we used "JSON.parse()" method. it will convert "JSON-->OBJECT"*/
    const getData = JSON.parse(localStorage.getItem("user") || "[]"); 

    
    let arr = [];
    arr = [...getData];
    arr.push(data);   
    
    /*used to set the data on localStorage(But we have to set the data into JSON formate so we used "JSON.stringify()" method for this) it will convert "OBJECT-->JSON"*/
    localStorage.setItem("user", JSON.stringify(arr)) 
    
    alert("Signup Successfully !");
    navigate("/login")

  };

  const userDetail = {
    name:"",
    email:"",
    password:""
  }


  const[data, setData] = useState(userDetail);

  const navigate = useNavigate();   /*it is method of DOM which helps to navigate to another page.*/

  const handleInput = (event) => {
    // console.log(event.target.value);     /*give us typed value*/
    // console.log(event.target.name);    /*give us type of value(like: value of text-input/email-input/password-input)*/

    const name = (event.target.name);
    const value = (event.target.value);

    setData({...data,[name]:value})

  }  

  return (

    <div className="relative min-h-screen">
      {/* Background image with blur (only the background) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-blur backdrop-blur-sm"
        style={{ backgroundImage: `url(${SignUpBg})` }}
      ></div>

      {/* Navigation Bar - not blurred */}
      <nav className="flex items-center bg-black bg-opacity-70 w-full p-4 fixed top-0 left-0 z-10">
        <img
          src={SafeEats_logo}
          alt="SafeEats_Logo"
          className="rounded-full w-12 h-12 border-2 border-red-500"
        />
        <span className="ml-3 text-xl md:text-2xl font-semibold text-white">
          SafeEats: Welcome !
        </span>
      </nav>

      {/* Sign-Up Form */}
      <form
        onSubmit={(e) => formhandler(e)}
        className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-24"
      >
        <div className="bg-black bg-opacity-40 p-6 rounded-lg shadow-xl shadow-amber-200 w-full max-w-md z-20">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-6">
            Sign Up
          </h2>
          <input
            className="border border-gray-300 bg-transparent text-white placeholder-gray-400 p-3 text-base md:text-lg w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            required
            type="text"
            name="name"
            placeholder="Name                                                            👤"
            onChange={handleInput}
          />
          <input
            className="border border-gray-300 bg-transparent text-white placeholder-gray-400 p-3 text-base md:text-lg w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            required
            type="email"
            name="email"
            placeholder="Email                                                             ✉️"
            onChange={handleInput}
          />
          <input
            className="border border-gray-300 bg-transparent text-white placeholder-gray-400 p-3 text-base md:text-lg w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            required
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInput}
          />
          <p className="text-center text-sm md:text-base text-white mb-4">
            Already have an account?
            <a
              className="font-semibold text-blue-400 underline hover:text-blue-600 ml-1"
              href="/login"
            >
              Login
            </a>
          </p>
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold text-lg md:text-xl bg-green-600 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
