import React from "react";
import Login from "../Auth/Login";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQRCodeContext } from "../Provider/QRCodeContext";

const PrivateRoute = ({ children }) => {
  let location = useLocation();

  const { state, dispatch } = useQRCodeContext();

  if (!state.token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  console.log(state, "STate in PrivateRoute.js");

  return children;
};

export default PrivateRoute;
