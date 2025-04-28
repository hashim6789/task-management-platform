import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Role } from "@/types";

const ProtectedRoute = ({ role }: { role: Role }) => {
  const { isAuthenticated, isBlocked, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirect to the login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  // Redirect to the blocked page if the user is blocked
  if (isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  // Redirect to the correct dashboard if the role doesn't match
  if (user && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // Render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
