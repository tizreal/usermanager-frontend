import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authHeaders, API_BASE_URL } from "../api";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [status, setStatus] = useState("");

  // Pre-fill the form with existing user data
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/get`, authHeaders())
      .then((res) => setUser({ ...res.data, password: "" }))
      .catch((err) => console.error("Error loading user:", err));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/user/update`, user, authHeaders());
      setStatus("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setStatus("Update failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto mt-16 bg-white shadow-2xl rounded-2xl p-10 border 
border-gray-200"
    >
      <h2 className="text-3xl font-bold mb-8 text-indigo-700 text-center">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phoneNumber", type: "tel" },
          {
            label: "New Password (leave blank to keep current)",
            name: "password",
            type: "password",
          },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label
              className="block text-sm font-semibold mb-1 text-gray
700"
            >
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={user[name] || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
focus:ring-indigo-400"
            />
          </div>
        ))}
        <div className="flex gap-4 justify-center pt-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg 
font-semibold"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg 
font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
      {status && <p className="mt-4 text-center text-indigo-700">{status}</p>}
    </div>
  );
};

export default EditProfile;
