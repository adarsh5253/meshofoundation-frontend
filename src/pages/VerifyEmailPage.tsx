import { Navigate } from "react-router-dom";

// Email verification is now handled via OTP entered on the AuthPage.
// This page exists only to redirect old verify-email links back to login.
export default function VerifyEmailPage() {
  return <Navigate to="/login" replace />;
}
