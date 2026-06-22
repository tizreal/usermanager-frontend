import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authHeaders, API_BASE_URL, removeToken } from "../api";

const icons = {
  firstName: (
    <svg
      className="h-4 w-4 text-purple-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  lastName: (
    <svg
      className="h-4 w-4 text-purple-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  username: (
    <svg
      className="h-4 w-4 text-purple-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  email: (
    <svg
      className="h-4 w-4 text-purple-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  phoneNumber: (
    <svg
      className="h-4 w-4 text-purple-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/user/get`, authHeaders())
      .then((res) => {
        setUser(res.data);
        setEditData({ ...res.data, password: "" });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Could not load profile. Please log in again.");
        setLoading(false);
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/user/update`, editData, authHeaders());
      setUser({ ...user, ...editData });
      setStatus("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Update failed. Please try again.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "—";
  const initials = (
    user.firstName?.[0] ||
    user.username?.[0] ||
    "?"
  ).toUpperCase();

  const fields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email", type: "email" },
    { key: "phoneNumber", label: "Phone" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0effe" }}>
      <div className="max-w-lg mx-auto pt-8 px-4 pb-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Hero banner */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 px-8 pt-8 pb-10 text-center relative">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-white">{fullName}</h2>
            <p className="text-purple-200 text-sm mt-0.5">@{user.username}</p>
          </div>

          {/* Fields */}
          <div className="px-8 py-6">
            {status && (
              <p
                className={`mb-4 text-center text-sm font-medium ${status.includes("failed") ? "text-red-600" : "text-green-600"}`}
              >
                {status}
              </p>
            )}

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                {fields.map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      {label}
                    </label>
                    <input
                      type={type || "text"}
                      value={editData[key] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [key]: e.target.value })
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                ))}
                <div key="password">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    New Password{" "}
                    <span className="text-gray-400 normal-case">
                      (leave blank to keep current)
                    </span>
                  </label>
                  <input
                    type="password"
                    value={editData.password || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, password: e.target.value })
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setEditData({ ...user, password: "" });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-3">
                  {fields.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="flex-shrink-0">{icons[key]}</span>
                      <span className="text-xs font-semibold text-gray-400 w-24 flex-shrink-0 uppercase tracking-wide">
                        {label}
                      </span>
                      <span className="text-gray-800 text-sm">
                        {user[key] || "—"}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold text-sm"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
