import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import VerifyEmail from "./components/verifyEmail";
import ProtectedRoute from "./components/protectedRoute";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";
import AdminPanel from "./pages/adminPanel";
import Home from "./pages/home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar /> {/* Renders on every page, hides itself if not logged in */}
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          {/*Public routes*/}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/verifyEmail" element={<VerifyEmail />} />

          {/*Protected routes*/}

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/resetPassword" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
