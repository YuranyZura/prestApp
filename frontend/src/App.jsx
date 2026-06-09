import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Prestamos from "./pages/Prestamos";
import Pagos from "./pages/Pagos";
import Cobranza from "./pages/Cobranza";
import Trabajadores from "./pages/Trabajadores";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prestamos"
          element={
            <ProtectedRoute>
              <Prestamos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos"
          element={
            <ProtectedRoute>
              <Pagos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cobranza"
          element={
            <ProtectedRoute>
              <Cobranza />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trabajadores"
          element={
            <ProtectedRoute>
              <Trabajadores />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;