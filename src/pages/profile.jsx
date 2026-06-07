import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authHeaders, API_BASE, removeToken } from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/user/get`, authHeaders())
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Could not load profile. Please log in again.");
        setLoading(false);
        // If 401, token is invalid — force logout
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      });
  }, [navigate]);

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <div
      className="max-w-lg mx-auto mt-16 bg-white shadow-2xl rounded-2xl p-10 border 
border-gray-200"
    >
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        My Profile
      </h2>
      <div className="space-y-4">
        <ProfileField label="First Name" value={user.firstName} />
        <ProfileField label="Last Name" value={user.lastName} />
        <ProfileField label="Username" value={user.username} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Phone" value={user.phoneNumber} />
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/edit-profile")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg 
font-semibold"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

// Small reusable display component for a labelled field
const ProfileField = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-semibold text-gray-600">{label}</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);

export default Profile;
