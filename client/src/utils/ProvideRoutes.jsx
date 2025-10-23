import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function ProvideRoutes({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

ProvideRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};