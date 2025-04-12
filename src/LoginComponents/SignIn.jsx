import React, { useState } from "react";
import SafeEats_logo from "../Images/SafeEats_logo.png";
import SignUpBg from "../Images/SignUp-bg.png"; // Import the background image
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    let getDetails = JSON.parse(localStorage.getItem("user"));
    if (!getDetails) {
      alert("No users found. Please sign up first!");
      return;
    }

    const matchedUser = getDetails.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem("loggedInEmail", email);      /*it is becos to get loged in user-name into dashboard */

      alert("Login Successfully!");
      navigate("/home");           /*Navigate to Dashboard page */
    } 
    else {
      alert("Invalid email or password!");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center backdrop-blur-md"
        style={{ backgroundImage: `url(${SignUpBg})` }}
      ></div>

      {/* Navigation Bar */}
      <nav className="flex items-center bg-black bg-opacity-70 w-full p-4 fixed top-0 left-0 z-10">
        <img
          src={SafeEats_logo}
          alt="SafeEats_Logo"
          className="rounded-full w-12 h-12 border-2 border-red-500"
        />
        <span className="ml-3 text-xl md:text-2xl font-semibold text-white">
          SafeEats: Welcome Back!
        </span>
      </nav>

      {/* Sign-In Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-24"
      >
        <div className="bg-black bg-opacity-40 p-6 rounded-lg shadow-xl shadow-amber-200 w-full max-w-md z-20">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-6">
            Sign In
          </h2>

          <input
            className="border border-gray-300 bg-transparent text-white placeholder-gray-400 p-3 text-base md:text-lg w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleInput}
          />
          <input
            className="border border-gray-300 bg-transparent text-white placeholder-gray-400 p-3 text-base md:text-lg w-full rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={handleInput}
          />
          <p className="text-center text-sm md:text-base text-white mb-4">
            Create an account?
            <a
              className="font-semibold text-blue-400 underline hover:text-blue-600 ml-1"
              href="/"
            >
              SignUp
            </a>
          </p>
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold text-lg md:text-xl bg-green-600 rounded-md hover:bg-green-700"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
