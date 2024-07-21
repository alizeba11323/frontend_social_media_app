import { Navigate } from "react-router-dom";
import useAuth from "../store/auth.store";

function ProtectedLayout({ children }) {
  console.log(document.cookie);
  const { authenticated } = useAuth((state) => ({
    authenticated: state.authenticated,
  }));
  if (authenticated) {
    return children;
  }
  return <Navigate to="/login" />;
}

export default ProtectedLayout;
