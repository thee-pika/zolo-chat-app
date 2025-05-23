import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  publicId: string;
  bio: string;
}

const ProtectedRoute = ({
  children,
  redirectUrl = "/login",
  user,
}: {
  children?: React.ReactNode;
  redirectUrl?: string;
  user: User;
}) => {
  console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", user);

  if (!user) {
    console.log(user);
    return <Navigate to={redirectUrl} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
