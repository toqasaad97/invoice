import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateInvoiceForm from "./components/CreateInvoiceForm";
import EditInvoicePageForm from "./pages/EditInvoicePageForm";
// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
            success: {
              style: {
                background: "#4CAF50",
              },
            },
            error: {
              style: {
                background: "#F44336",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation/:id"
            element={
              <ProtectedRoute>
                <InvoiceDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateInvoiceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditInvoicePageForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
