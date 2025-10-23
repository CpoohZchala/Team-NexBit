import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/photos/logo.png";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import Swal from "sweetalert2";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [userType, setUserType] = useState("user"); // State to toggle between user, mechanic, and admin
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // const {login} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const identifier = usernameOrEmail; // Use state variable directly
    const pwd = password; // Use state variable directly

    // Check if both fields are filled
    if (!identifier || !pwd) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information!",
        text: "Please fill in both email/username and password.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const loginData = { identifier, password: pwd }; // Changed to identifier instead of just username
    const loginUrl =
      userType === "user"
        ? "http://localhost:3000/api/user/login"
        : userType === "mechanic"
        ? "http://localhost:3000/api/mechanic/login"
        : "http://localhost:3000/api/admin/login";
    try {
      // Send login request
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Handle login errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Login failed with status ${response.status}`
        );
      }

      const data = await response.json();

      // Fetch user data after successful login using the identifier
      const userResponse = await fetch(
        `http://localhost:3000/api/getUserDetail/${userType}/${identifier}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`, // Send token in the Authorization header
          },
        }
      );

      // Handle user data fetch errors
      if (!userResponse.ok) {
        const userData = await userResponse.json(); // Only parse once
        throw new Error(
          userData.error ||
            `Error fetching user data with status ${userResponse.status}`
        );
      }

      const userData = await userResponse.json();
      // console.log("User data:", userData);
      setUser(userData.data); // Set user data in the context
      // Save the token and navigate to the home page
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", userType);
      localStorage.setItem("userId", userData.data._id);
      localStorage.setItem("userEmail", userData.data.email);

      Swal.fire({
        title: "Success!",
        text: "Login successful.",
        icon: "success",
        confirmButtonText: "OK",
      });

      if (userType === "mechanic") {
        navigate("/mdashboard");
        Swal.fire({
          title: "Success!",
          text: "Login successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else if (userType === "admin") {
        navigate("/admin/dashboard");
        Swal.fire({
          title: "Success!",
          text: "Login successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        navigate("/"); // Navigate to home page after login
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message, // Display the error message
        icon: "error", // Set the icon to 'error'
        confirmButtonText: "OK",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const forgotPassword = async (e) => {
    e.preventDefault();

    const identifier = usernameOrEmail; // Use state variable directly
    // if (!identifier) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Incomplete Information!",
    //     text: "Please fill in both email/username and password.",
    //     timer: 1500,
    //     timerProgressBar: true,
    //     showConfirmButton: false,
    //   });
    //   return;
    // }

    const loginData = { identifier }; // Changed to identifier instead of just username
    const loginUrl =
      userType === "user"
        ? "http://localhost:3000/api/user/login"
        : userType === "mechanic"
        ? "http://localhost:3000/api/mechanic/login"
        : "http://localhost:3000/api/admin/login";

    try {
      // Send login request
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData), // Send identifier (email/username) and password
      });

      // Handle login errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Login failed with status ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // alert(error.message);
    }

    navigate("/forgotpassword");
  };

  return (
    <div className="flex justify-center items-center h-[100vh] w-[100vw] default-bg px-[100px]  whole-container">
      <div className="flex justify-center items-center  custom-logo-container">
        <img src={logo} alt="autocare_logo" className="w-[600px]" />
      </div>
      <div className="flex items-center justify-center default-bg-form   rounded-lg ">
        <form className="text-gray-200" onSubmit={handleLogin}>
          <h1 className="text-red-600 text-4xl default-h1 my-4">WELCOME</h1>
          <div className=" my-2">
            <h3 className="text-lg mr-2">Login As:</h3>
            <span className="mr-2">
              <label className="text-lg user-label">
                <input
                  className="mr-2"
                  type="radio"
                  id="user"
                  name="userType"
                  value="user"
                  checked={userType === "user"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                User
              </label>
            </span>
            <span className="mr-2">
              <label className="text-lg user-label">
                <input
                  className="mr-2"
                  type="radio"
                  id="mechanic"
                  name="userType"
                  value="mechanic"
                  checked={userType === "mechanic"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Mechanic
              </label>
            </span>
            <span className="mr-2">
              <label className="text-lg user-label">
                <input
                  className="mr-2"
                  type="radio"
                  id="admin"
                  name="userType"
                  value="admin"
                  checked={userType === "admin"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Admin
              </label>
            </span>
          </div>

          <div className="py-2">
            <label className="mb-2 user-label">Username</label>
            <div className="relative">
              <span className="absolute top-[13px] left-[5px]">👤</span>
              <input
                className="my-2 py-[5px] px-[40px] rounded w-[100%] text-black"
                type="text"
                id="usernameOrEmail"
                placeholder="Enter Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="py-2">
            <label className="mb-2 user-label">Password</label>
            <div className="relative">
              <span className="absolute top-[13px] left-[5px]">🔒</span>
              <input
                className="my-2 py-[5px] px-[40px] rounded w-[100%] text-black"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="cursor-pointer absolute top-[13px] right-[5px]"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <div className="flex justify-end">
              <button
                className="underline hover:text-blue-600 cursor-pointer"
                onClick={forgotPassword}
              >
                Forget Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn_red_bg my-4 h-[40px] rounded-lg font-semibold"
          >
            LOGIN
          </button>
          <p className="text-center">
            Don’t have an Account?{" "}
            <Link className="text-blue-500 underline" to="/signupoption">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error}`, // Display the dynamic error message
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleRequestOtp}>
        <h1>Forgot Password</h1>
        <div className="input-group">
          <label htmlFor="identifier">
            Username / Email
            <input
              type="text"
              id="identifier"
              placeholder="Enter your username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </label>
        </div>
        <button className="submit" type="submit">
          Request OTP
        </button>
      </form>
    </div>
  );
}
