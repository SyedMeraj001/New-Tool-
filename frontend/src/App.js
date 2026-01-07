import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./Login";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import DataEntry from "./DataEntry";
import Reports from "./Reports";
import Analytics from "./Analytics";
import Compliance from "./Compliance";
import Regulatory from "./Regulatory";
import Stakeholders from "./Stakeholders";
import AdminPanel from "./AdminPanel";

import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SectorProvider } from "./contexts/SectorContext";

import SectorSelector from "./components/SectorSelector";
import SectorDashboard from "./components/SectorDashboard";
import EvidenceUploader from "./components/EvidenceUploader";
import UserManagement from "./components/UserManagement";

import RBACProtectedRoute from "./components/ProtectedRoute";
import { PERMISSIONS } from "./utils/rbac";
import { initializeSector } from "./utils/sectorInit";

/* ================================
   Loading Spinner
================================ */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

/* ================================
   Cookie-based ProtectedRoute
   (RENAMED TO AVOID CONFLICT)
================================ */
const CookieProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setAuth(data.authenticated === true);
        setLoading(false);
      })
      .catch(() => {
        setAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return auth ? children : <Navigate to="/login" replace />;
};

/* ================================
   App Routes
================================ */
const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <CookieProtectedRoute>
            <Dashboard />
          </CookieProtectedRoute>
        }
      />

      <Route path="/profile" element={<CookieProtectedRoute><Profile /></CookieProtectedRoute>} />
      <Route path="/sectors" element={<CookieProtectedRoute><SectorSelector /></CookieProtectedRoute>} />
      <Route path="/sector/:sector" element={<CookieProtectedRoute><SectorDashboard /></CookieProtectedRoute>} />

      <Route path="/data-entry" element={<CookieProtectedRoute><DataEntry /></CookieProtectedRoute>} />
      <Route path="/reports" element={<CookieProtectedRoute><Reports /></CookieProtectedRoute>} />
      <Route path="/analytics" element={<CookieProtectedRoute><Analytics /></CookieProtectedRoute>} />
      <Route path="/compliance" element={<CookieProtectedRoute><Compliance /></CookieProtectedRoute>} />
      <Route path="/stakeholders" element={<CookieProtectedRoute><Stakeholders /></CookieProtectedRoute>} />
      <Route path="/regulatory" element={<CookieProtectedRoute><Regulatory /></CookieProtectedRoute>} />
      <Route path="/admin" element={<CookieProtectedRoute><AdminPanel /></CookieProtectedRoute>} />
      <Route path="/admin/dashboard" element={<CookieProtectedRoute><AdminPanel /></CookieProtectedRoute>} />

      {/* RBAC */}
      <Route
        path="/user-management"
        element={
          <RBACProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
            <UserManagement />
          </RBACProtectedRoute>
        }
      />

      {/* Evidence */}
      <Route
        path="/evidence-management"
        element={
          <CookieProtectedRoute>
            <EvidenceUploader
              dataId="ESG_MAIN"
              onClose={() => window.history.back()}
            />
          </CookieProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

/* ================================
   App Root
================================ */
function App() {
  useEffect(() => {
    initializeSector();
  }, []);

  return (
    <ThemeProvider>
      <SectorProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SectorProvider>
    </ThemeProvider>
  );
}

export default App;
