import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AiFillHome } from "react-icons/ai";

export default function ResetPassword() {
  const location = useLocation();
  const { userType, identifier } = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    capital: false,
    symbol: false,
  });
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const capital = /[A-Z]/.test(password);
    const symbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValidations({ length, capital, symbol });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Passwords do not match!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/login");
      return;
    }

    if (!passwordValidations.length || !passwordValidations.capital || !passwordValidations.symbol) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Password does not meet the requirements!",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const resetData = { identifier, password };
    const resetUrl =
      userType === "user"
        ? "http://localhost:3000/api/user/reset-password"
        : userType === "mechanic"
        ? "http://localhost:3000/api/mechanic/reset-password"
        : "http://localhost:3000/api/admin/reset-password";

    try {
      const response = await fetch(resetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      if (response.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Password reset successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to reset password!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to reset password!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="flex justify-center flex-col items-center w-[100vw] h-[100vh]">
      <div className="w-[400px] pointer">
        <Link to="/login"><AiFillHome /></Link>
      </div>
      <form
        className="bg-green-600 h-[450px] flex flex-col justify-center w-[400px] flex p-4"
        onSubmit={handleResetPassword}
      >
        <h1 className="text-center text-3xl my-4 text-white">Reset Password</h1>
        <div className="flex flex-col justify-center items-center">
          <label
            className="text-right text-white text-[24px] mb-2"
            htmlFor="password"
          >
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter New Password"
            className="mt-1 w-[300px] text-center p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={handlePasswordChange}
          />
          <div className="text-left text-white mb-4">
            <p>Password must contain:</p>
            <p>
              {passwordValidations.length ? "✔️" : "❌"} At least 8 characters
            </p>
            <p>
              {passwordValidations.capital ? "✔️" : "❌"} At least one capital letter
            </p>
            <p>
              {passwordValidations.symbol ? "✔️" : "❌"} At least one symbol (e.g., !@#$%^&*)
            </p>
          </div>
          <label
            className="text-right text-white text-[24px] mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm New Password"
            className="mt-1 w-[300px] text-center p-2 border border-gray-300 rounded mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="bg-blue-600 w-[50%] rounded py-2 uppercase text-white hover:bg-blue-700"
            type="submit"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}