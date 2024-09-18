import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie"; // For handling cookies
import { useNavigate } from "react-router-dom"; // For navigation

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(["rememberMe"]);
  const navigate = useNavigate(); // Hook for navigation

  const myStyle = {
    backgroundImage: "url('https://i.pinimg.com/564x/75/de/07/75de0749aa17d31912274fc15ba4545e.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  // Updated Username validation: 3-9 characters, no spaces, alphanumeric and underscores
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,9}$/;
    return usernameRegex.test(username);
  };

  // Updated Password validation: 3-9 characters long, must include a number and a special character
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,9}$/;
    return passwordRegex.test(password) && !password.includes(" ");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateUsername(username)) {
      setIsUsernameValid(false);
      return setErrorMessage("Invalid username. Please ensure it meets the requirements (3-9 characters, no spaces, alphanumeric and underscores).");
    } else {
      setIsUsernameValid(true);
    }

    if (!validatePassword(password)) {
      setIsPasswordValid(false);
      return setErrorMessage("Password must be at least 3 characters, include a number, and a special character.");
    } else {
      setIsPasswordValid(true);
    }

    if (password !== confirmPassword) {
      setIsConfirmPasswordValid(false);
      return setErrorMessage("Passwords do not match.");
    } else {
      setIsConfirmPasswordValid(true);
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Signup successful! You can now log in.");
        toast.success("Signup successful! You can now log in.");
      } else {
        setErrorMessage(data.message || "Signup failed. Please try again.");
        toast.error(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Signup failed. Please try again.");
      toast.error("Signup failed. Please try again.");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  // Handle the "Remember Me" checkbox
  const handleRememberMe = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (checked) {
      setCookie("rememberMe", username, { path: "/", maxAge: 3600 * 24 * 30 }); // Store for 30 days
    } else {
      removeCookie("rememberMe");
    }
  };

  useEffect(() => {
    const savedUsername = cookies.rememberMe;
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, [cookies]);

  // Redirect to the login page
  const redirectToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={myStyle}>
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username Field */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <span style={{ color: 'red', marginLeft: '5px', marginTop: '0px' }}>*</span>
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className={`w-full px-3 py-2 border ${!isUsernameValid ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
              style={{ borderColor: !isUsernameValid ? 'red' : '#9A1750', borderWidth: '1px' }}
            />
          </div>

          {/* Password Field */}
          <div className="mt-6 relative">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <span style={{ color: 'red', marginLeft: '5px', marginTop: '0px' }}>*</span>
            </div>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border ${!isPasswordValid ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
              style={{ borderColor: !isPasswordValid ? 'red' : '#9A1750', borderWidth: '1px' }}
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 cursor-pointer"
              style={{ color: 'grey' }}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mt-6 relative">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <span style={{ color: 'red', marginLeft: '5px', marginTop: '0px' }}>*</span>
            </div>
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              className={`w-full px-3 py-2 border ${!isConfirmPasswordValid ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
              style={{ borderColor: !isConfirmPasswordValid ? 'red' : '#9A1750', borderWidth: '1px' }}
            />
            <FontAwesomeIcon
              icon={isConfirmPasswordVisible ? faEyeSlash : faEye}
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-9 cursor-pointer"
              style={{ color: 'grey' }}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#9A1750] text-white py-2 px-4 rounded-md hover:bg-[#7a123d] focus:outline-none"
          >
            Sign Up
          </button>
        </form>

        {/* Already have an account */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={redirectToLogin}
              className="text-[#9A1750] hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
