import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouteAdmin = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user?.isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRouteAdmin;
