import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import VerifyEmail from "./components/verifyEmail";
import ProtectedRoute from "./components/protectedRoute";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";

const Home = () => (
  <div className="text-center mt-20 text-2xl font-semibold text-gray-700">
    Welcome! You are logged in.
  </div>
);

function App() {
  return (
    <Router>
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/verifyEmail" element={<VerifyEmail />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/resetPassword" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
