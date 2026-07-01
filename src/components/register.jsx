import React, { useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Must be a valid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      const { confirmPassword, ...payload } = values;
      try {
        if (id) {
          await axios.put(`${API_URL}/api/user/${id}`, payload);
        } else {
          await axios.post(`${API_URL}/api/user/signup`, payload);
        }
        navigate("/");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/api/books/${id}`)
        .then((response) => formik.setValues({ ...response.data, confirmPassword: "" }))
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [id]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ backgroundColor: "#f0effe" }}>
    <div
      className="max-w-lg mx-auto bg-white/90 shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-200"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">
        {id ? "Edit User" : "Register"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-7">
        {/* First Name */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2
focus:ring-indigo-400"
            placeholder="Enter first name"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
          )}
        </div>
        {/* Last Name */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter last name"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
          )}
        </div>
        {/* Username */}
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
        {/* Password */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>
        {/* Confirm Password */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Confirm password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>
        {/* Phone Number */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter phone number"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>
        <div className="flex gap-4 justify-center pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3
rounded-lg font-semibold shadow-lg"
          >
            Register
          </button>
        </div>
        <div className="flex justify-center items-center pt-2">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Login
            </a>
          </span>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Register;
