import { Navigate } from "react-router-dom";

import { ReactElement } from "react";

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const isAuthenticated = localStorage.getItem("donor_id") || localStorage.getItem("organizations_id");

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
