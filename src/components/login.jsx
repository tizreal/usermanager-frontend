import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import { useFormik } from "formik";
import * as Yup from "yup";

function setToken(token) {
  localStorage.setItem("authToken", token);
}

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${API_URL}/api/user/login`,
          values,
        );
        const token = response.headers["authorization"];
        if (token) {
          setToken(token);
          navigate("/home");
        } else {
          console.warn("No token in headers:", response.headers);
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col px-4" style={{ backgroundColor: "#f0effe" }}>
      {/* Top-left icon only */}
      <div className="pt-5 pl-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">U</span>
        </div>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Brand heading */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">UserApp</h1>
          <p className="text-gray-500 text-sm mt-1">Connect, share, and manage your account</p>
        </div>

        <div className="w-full max-w-lg bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Login
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-7">
        {/* Username field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter username"
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
          )}
        </div>
        {/* Password field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 pr-12"
              placeholder="Enter password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>
        {/* Register & Forgot password links */}
        <div className="flex flex-col items-center pt-2 gap-1">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Register
            </a>
          </span>
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline font-semibold"
          >
            Forgot your password?
          </a>
        </div>
        {/* Submit */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
          >
            Login
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
