import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import QRCodeList from "./QRCodeList";
import PrivateRoute from "./HOC/PrivateRoute";
import Login from "./Auth/Login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/scannedList"
        element={
          <PrivateRoute>
            <QRCodeList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
