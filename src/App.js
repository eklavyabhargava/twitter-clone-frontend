import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRoutes from "./routes/AuthRoute";
import { createContext, useContext } from "react";
import { ToastContainer } from "react-toastify";

const ApiContext = createContext();

function App() {
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <ApiContext.Provider value={API_URL}>
      <ToastContainer draggable />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AuthRoutes />} />
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  );
}

function useApiUrl() {
  return useContext(ApiContext);
}

export { useApiUrl, App as default };
