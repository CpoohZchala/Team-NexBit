import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [addedItem, setAddedItem] = useState("");
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    navigate("/"); // Navigate to home page after login
  };

  const logout = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("userRole");
    // localStorage.removeItem("userId");
    // localStorage.removeItem("userEmail");
    // localStorage.clear();
    // setUser(null);
    navigate("/"); // Navigate to home page after logout
  };
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    const userEmail = localStorage.getItem("userEmail");

    // setUser({token: token, userId: userId, userRole: userRole, userEmail: userEmail});

    if (token && userId && userRole && userEmail && !user) {
      try {
        const userResponse = await fetch(
          `http://localhost:3000/api/getUserDetail/${userRole}/${userEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
          }
        );

        if (!userResponse.ok) {
          const userData = await userResponse.json();
          throw new Error(
            userData.error ||
              `Error fetching user data with status ${userResponse.status}`
          );
        }

        const userData = await userResponse.json();
        setUser(userData.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        fetchUser,
        addedItem,
        setAddedItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
