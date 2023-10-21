// QRCodeContext.js
import React, { createContext, useContext, useReducer } from "react";
import { qrCodeReducer } from "./QRCodeReducer";

const QRCodeContext = createContext();

export const useQRCodeContext = () => {
  return useContext(QRCodeContext);
};

export const QRCodeProvider = ({ children }) => {
  const initialState = {
    qrCodes: [],
    user: null,
    token: localStorage.getItem("token") | null,
    // Other application state goes here
  };

  const [state, dispatch] = useReducer(qrCodeReducer, initialState);

  return (
    <QRCodeContext.Provider value={{ state, dispatch }}>
      {children}
    </QRCodeContext.Provider>
  );
};
