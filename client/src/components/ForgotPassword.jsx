import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const loginData = { identifier }; // Can be username or email
    const loginUrl =
      userType === "user"
        ? "http://localhost:3000/api/user/get-security-question"
        : userType === "mechanic"
        ? "http://localhost:3000/api/mechanic/get-security-question"
        : "http://localhost:3000/api/admin/get-security-question";

    try {
      // Send request to get security question based on identifier
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData), // Send the identifier (email/username)
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming `data.question` contains the security question from the backend
        setQuestion(data.question); // Show the security question to the user
      } else {
        Swal.fire({
          icon: 'error',
          title: 'User not found',
          text: 'Please check your username or Email.',
          timer: 1000, // Auto-closes after 10 seconds (10000 milliseconds)
          timerProgressBar: true, // Shows a progress bar
          showConfirmButton: false // No "OK" button, closes automatically
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswerSecurityQuestion = async (e) => {
    e.preventDefault();

    const answerData = { identifier, answer };
    const answerUrl =
      userType === "user"
        ? "http://localhost:3000/api/user/validate-security-answer"
        : userType === "mechanic"
        ? "http://localhost:3000/api/mechanic/validate-security-answer"
        : "http://localhost:3000/api/admin/validate-security-answer";

    try {
      const response = await fetch(answerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answerData),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.isAnswerCorrect) {
          // Navigate to reset password section with userType and identifier
          Swal.fire({
            icon: 'success',
            title: 'Correct answer!',
            text: 'Redirecting to reset password page.',
            timer: 5000, 
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            // Navigate after alert closes
            navigate("/resetpassword", { state: { userType, identifier } });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Incorrect answer!',
            text: 'Redirecting to login page.',
            timer: 5000, 
            timerProgressBar: true,
            showConfirmButton: false 
          }).then(() => {
            // Redirect after the alert closes
            navigate("/login");
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error validating answer.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#13496b]">
    <div className="flex justify-center items-center w-[100vw] h-[100vh] ">
      <form
        className="bg-[rgba(0,0,0,0.5)] h-[450px] flex flex-col justify-center w-[375px] flex p-4"
        onSubmit={handleAnswerSecurityQuestion}
      >
        <h1 className="text-center text-3xl my-4 text-white">
          Forgot Password
        </h1>
        <div className="flex my-2">
          <h3 className="text-lg text-white mr-2">Login As:</h3>
          <span className="mr-2">
            <label className="text-lg text-white">
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
            <label className="text-lg text-white">
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
            <label className="text-lg text-white">
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

        <div className="flex flex-col justify-center items-center">
          <label
            className="text-right text-white text-[24px] mb-2"
            htmlFor="usernameoremail"
          >
            Username or Email
          </label>
          <input
            type="text"
            placeholder="Enter Username or Email"
            className="mt-1 w-[300px] text-center p-2 border border-gray-300 rounded mb-4"
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="bg-red-600 w-[50%] rounded py-2 uppercase text-white hover:bg-blue-700"
          >
            Search
          </button>
          {question && (
            <>
              <label htmlFor="answer" className="text-[24px] text-white ">
                {question}
              </label>
              <input
                type="text"
                id="answer"
                className="mt-1 w-[300px] text-center p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter the answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button
                className="bg-red-600 w-[50%] rounded py-2 uppercase text-white hover:bg-red-700"
                type="submit"
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </form>
    </div>
    </div>
  );
}
