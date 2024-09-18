import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const myStyle = {
    backgroundImage: "url('https://i.pinimg.com/564x/75/de/07/75de0749aa17d31912274fc15ba4545e.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const validateUsername = (username) => /^[a-zA-Z0-9_]{3,9}$/.test(username);

  // Updated Password validation: 3-9 characters long, must include a number and a special character
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,9}$/;
    return passwordRegex.test(password) && !password.includes(" ");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setIsUsernameValid(false);
      setErrorMessage("Username must be 3-9 characters long and contain only letters, numbers, and underscores.");
      return;
    }
    setIsUsernameValid(true);

    if (!validatePassword(password)) {
      setIsPasswordValid(false);
      setErrorMessage("Password must be 3-9 characters long, include a number and a special character, and have no spaces.");
      return;
    }
    setIsPasswordValid(true);

    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", { username, password });
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      toast.success("Login successful!", {
        onClose: () => {
          setTimeout(() => {
            window.location.href = "/employee";
          }, 1000); // Redirect after 1 second
        },
        autoClose: 2000, // Duration of the toast in milliseconds
      });
    } catch (error) {
      setErrorMessage("Invalid username or password");
      toast.error("Invalid username or password", {
        autoClose: 2000, // Duration of the toast in milliseconds
      });
      console.error("Login error", error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={myStyle}>
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <span style={{ color: 'red', marginLeft: '5px', marginTop: '0px' }}>*</span>
            </div>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${isUsernameValid ? "border-gray-300" : "border-red-500"} rounded-md shadow-sm focus:outline-none focus:ring-0`}
              style={{ borderColor: isUsernameValid ? '#9A1750' : 'red', borderWidth: '1px' }}
            />
          </div>
          <div className="relative">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <span style={{ color: 'red', marginLeft: '5px', marginTop: '0px' }}>*</span>
            </div>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${isPasswordValid ? "border-gray-300" : "border-red-500"} rounded-md shadow-sm focus:outline-none`}
              style={{ borderColor: isPasswordValid ? '#9A1750' : 'red', borderWidth: '1px' }}
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 cursor-pointer"
              style={{ color: 'grey' }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-[#9A1750]">Remember Me</label>
            </div>
            <Link to="/forgot-password" className="text-sm text-[#9A1750] hover:text-[#a11b5a]">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#9A1750] text-white rounded-md font-semibold hover:bg-[#a11b5a] focus:outline-none"
          >
            Login
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          <p className="text-gray-600">Don't have an account?{" "}
            <Link to="/signup" className="text-[#9A1750] hover:text-[#a11b5a]">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
