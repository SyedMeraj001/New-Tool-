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
import ProtectedRoute from "./components/ProtectedRoute"; // KEEP
import { ThemeProvider } from "./contexts/ThemeContext";
import { SectorProvider } from "./contexts/SectorContext";

import SectorSelector from "./components/SectorSelector";
import SectorDashboard from "./components/SectorDashboard";
import EvidenceUploader from "./components/EvidenceUploader";
import UserManagement from "./components/UserManagement";

import {
  LazyDashboard,
  LazyDataEntry,
  LazyIndustryStandardDataEntry,
  LazyReports,
  LazyAnalytics,
  LazyCompliance,
  LazyRegulatory,
  LazyStakeholders,
  LazyAdminPanel,
  LazyMaterialityAssessment,
  LazySupplyChainESG,
  LazyWorkflowDashboard,
  LazyIntegrationDashboard,
  LazyCalculatorDashboard,
  LazyComprehensiveESGDashboard,
  LazyESGReportingDashboard,
  LazyStakeholderSentimentDashboard,
  LazyIoTDashboard,
  LazyReportsAnalyticsDashboard,
  LazyEnhancedFrameworkCompliance
} from "./components/LazyComponents";

import RBACProtectedRoute from "./components/ProtectedRoute"; // KEEP
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

      <Route path="/data-entry" element={<CookieProtectedRoute><LazyDataEntry /></CookieProtectedRoute>} />
      <Route path="/industry-standard-data-entry" element={<CookieProtectedRoute><LazyIndustryStandardDataEntry /></CookieProtectedRoute>} />
      <Route path="/materiality-assessment" element={<CookieProtectedRoute><LazyMaterialityAssessment /></CookieProtectedRoute>} />
      <Route path="/supply-chain" element={<CookieProtectedRoute><LazySupplyChainESG /></CookieProtectedRoute>} />
      <Route path="/reports" element={<CookieProtectedRoute><LazyReports /></CookieProtectedRoute>} />
      <Route path="/analytics" element={<CookieProtectedRoute><LazyAnalytics /></CookieProtectedRoute>} />
      <Route path="/compliance" element={<CookieProtectedRoute><LazyCompliance /></CookieProtectedRoute>} />
      <Route path="/stakeholders" element={<CookieProtectedRoute><LazyStakeholders /></CookieProtectedRoute>} />
      <Route path="/regulatory" element={<CookieProtectedRoute><LazyRegulatory /></CookieProtectedRoute>} />
      <Route path="/admin" element={<CookieProtectedRoute><LazyAdminPanel /></CookieProtectedRoute>} />
      <Route path="/workflow" element={<CookieProtectedRoute><LazyWorkflowDashboard /></CookieProtectedRoute>} />
      <Route path="/integrations" element={<CookieProtectedRoute><LazyIntegrationDashboard /></CookieProtectedRoute>} />
      <Route path="/calculators" element={<CookieProtectedRoute><LazyCalculatorDashboard /></CookieProtectedRoute>} />
      <Route path="/comprehensive-esg" element={<CookieProtectedRoute><LazyComprehensiveESGDashboard /></CookieProtectedRoute>} />
      <Route path="/esg-reporting" element={<CookieProtectedRoute><LazyESGReportingDashboard /></CookieProtectedRoute>} />
      <Route path="/stakeholder-sentiment" element={<CookieProtectedRoute><LazyStakeholderSentimentDashboard /></CookieProtectedRoute>} />
      <Route path="/iot" element={<CookieProtectedRoute><LazyIoTDashboard /></CookieProtectedRoute>} />
      <Route path="/reports-analytics" element={<CookieProtectedRoute><LazyReportsAnalyticsDashboard /></CookieProtectedRoute>} />
      <Route path="/enhanced-framework-compliance" element={<CookieProtectedRoute><LazyEnhancedFrameworkCompliance /></CookieProtectedRoute>} />

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
