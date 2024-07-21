import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../store/auth.store";

function ProtectedLayout() {
  console.log(document.cookie);
  const { authenticated } = useAuth((state) => ({
    authenticated: state.authenticated,
  }));
  if (authenticated) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
}

export default ProtectedLayout;
