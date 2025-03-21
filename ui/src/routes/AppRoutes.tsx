import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from '../components/page/error/NotFound';
import Home from '../components/page/Home';
import SignIn from "../components/page/auth/SignIn";
import SignUp from "../components/page/auth/SignUp";
import Hub from "../components/page/Hub";
import auth from "../scripts/auth";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/signin" />;
  }
  return <>{children}</>;
};

// Public Route wrapper (redirects to hub if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (auth.isAuthenticated()) {
    return <Navigate to="/hub" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/hub" element={
          <ProtectedRoute>
            <Hub />
          </ProtectedRoute>
        } />

        {/* 404 route */}
        <Route path="*" element={<NotFound/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes