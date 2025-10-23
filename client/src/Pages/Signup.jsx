import { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/photos/logo.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");

  const navigate = useNavigate();
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const questions = [
    { value: "", label: "--Select a Question--" },
    { value: "mom_name", label: "What is your mom's name?" },
    { value: "favorite_place", label: "What is your favorite place?" },
    { value: "first_pet", label: "What was the name of your first pet?" },
    { value: "birth_city", label: "In what city were you born?" },
    { value: "high_school", label: "What was the name of your high school?" },
  ];

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const response = await fetch("http://localhost:3000/api/usignup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname,
        email,
        phone,
        username,
        password,
        conformPassword,
        securityQuestion,
        answer,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User created successfully!",
        confirmButtonText: "OK",
      });
      navigate("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${data.error}`, // Display the dynamic error message
        confirmButtonText: "OK",
      });
    }
  };

  const comparePassword = () => {
    if (conformPassword !== password) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h1>
          Customer <span>Sign Up </span>{" "}
        </h1>
        <div className="main-s">
          <div className="column-3">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              placeholder="Enter your Full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
             <label htmlFor="number">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            
          </div>






          <div className="column-4">
          <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Conform Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              value={conformPassword}
              onChange={(e) => setConformPassword(e.target.value)}
            />
            {comparePassword() ? (
              <p className="text-red-300" id="password-not-match">
                Passwords do not match !
              </p>
            ) : null}
            <label htmlFor="securityQuestion">
              Select a Security Question:
            </label>
            <select
              id="securityQuestion"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
              className="w-[300px] h-[40px] border-2 border-white rounded-md"
            >
              {questions.map((question) => (
                <option key={question.value} value={question.value}>
                  {question.label}
                </option>
              ))}
            </select>
            <label htmlFor="answer">Your Answer:</label>
            <input
              type="text"
              id="answer"
              placeholder="Enter the Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit">
          <b>SIGN UP</b>
        </button>
        <div className="flex justify-center p-2">
          <p className="text-white">
            Already have an Account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
      <img
        className="logo"
        src={logo}
        style={{ width: "350px", height: "Auto" }}
      />
    </div>
  );
}
