import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  children,
  redirectUrl = "/login",
  user,
}: {
  children?: React.ReactNode;
  redirectUrl?: string;
  user: boolean;
}) => {
  if (!user) {
    return <Navigate to={redirectUrl} />;
  }
  return children ? children : <Outlet/>;
};

export default ProtectedRoute;
