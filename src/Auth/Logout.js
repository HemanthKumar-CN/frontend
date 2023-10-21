import React from "react";
import { useQRCodeContext } from "../Provider/QRCodeContext";

export function Logout() {
  const { state, dispatch } = useQRCodeContext();

  console.log("Trying to logout");

  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("token");
}
