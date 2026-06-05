import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Register = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
  });

  // Only runs when editing an existing user (via id in the URL)
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/books/${id}`)
        .then((response) => setUser(response.data))
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/user/${id}`, user);
      } else {
        await axios.post("http://localhost:8080/api/user/signup", user);
      }
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto mt-16 bg-white/90 shadow-2xl rounded-2xl p-10 border 
border-gray-200"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        {id ? "Edit User" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* First Name */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
focus:ring-indigo-400"
            required
            placeholder="Enter first name"
          />
        </div>
        {/* Last Name, Username, Password, Phone, Email fields follow same pattern */}
        {/* ... (see full code below) ... */}
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
  );
};

export default Register;
