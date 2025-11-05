import { useState } from "react";
import "./Esignup.css";
import logo4 from "../assets/photos/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Esignup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [address, setAddress] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const questions = [
    { value: "", label: "--Select a Question--" },
    { value: "mom_name", label: "What is your mom's name?" },
    { value: "favorite_place", label: "What is your favorite place?" },
    { value: "first_pet", label: "What was the name of your first pet?" },
    { value: "birth_city", label: "In what city were you born?" },
    { value: "high_school", label: "What was the name of your high school?" },
  ];

  const validateForm = () => {
    // Check empty fields
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !username ||
      !password ||
      !idnumber ||
      !address ||
      !conformPassword ||
      !securityQuestion ||
      !answer
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all the required fields.",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return false;
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be 10 digits.",
      });
      return false;
    }

    // Password length
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters long.",
      });
      return false;
    }

    // Confirm password match
    if (password !== conformPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      });
      return false;
    }

    // Security question validation
    if (securityQuestion === "") {
      Swal.fire({
        icon: "warning",
        title: "Select a Security Question",
        text: "Please select a security question.",
      });
      return false;
    }

    return true; // All validations passed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if validation fails

    try {
      const response = await fetch("http://localhost:3000/api/esignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email,
          phone,
          firstname,
          lastname,
          idnumber,
          address,
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
          text: "Mechanic profile created successfully!",
          confirmButtonText: "OK",
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error: ${data.error}`,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please try again later.",
      });
    }
  };

  return (
    <div className="Esignup-container">
      <div>
        <form className="Esignup-form" onSubmit={handleSubmit}>
          <h1>
            Mechanic <span> Sign Up </span>
          </h1>
          <div className="main-e">
            <div className="column-1">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />

              <label htmlFor="Lname">Last name</label>
              <input
                type="text"
                placeholder="Enter your Last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />

              <label htmlFor="Idnumber">ID Number</label>
              <input
                type="text"
                placeholder="Enter your ID number"
                value={idnumber}
                onChange={(e) => setIdnumber(e.target.value)}
              />

              <label htmlFor="text">Phone number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label htmlFor="Address">Address</label>
              <input
                type="text"
                placeholder="Enter your Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="column-2">
              <label htmlFor="Username">Username</label>
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label htmlFor="password">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your Password"
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
              />

              <label htmlFor="securityQuestion">
                Select a Security Question:
              </label>
              <select
                id="securityQuestion"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                required
                className="w-[100%] h-[35px] mt-2 border-2 border-white rounded-md"
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
                placeholder="Enter your Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit">
            <b>SIGN UP</b>
          </button>

          <p>
            Already have an Account? <Link to={"/login"}>Login</Link>
          </p>
        </form>
      </div>

      <div className="logo">
        <img src={logo4} style={{ width: "350px", height: "auto" }} />
      </div>
    </div>
  );
}
