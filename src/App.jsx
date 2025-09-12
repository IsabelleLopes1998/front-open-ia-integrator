import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute"; // opcional

import Login from "./pages/Login/Login";
import IA from "./pages/IA/IA";


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* raiz manda pro login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* públicas */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          
          {/* grupo de PRIVADAS */}
          <Route element={<ProtectedRoute />}>
            <Route path="/ia" element={<IA />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
