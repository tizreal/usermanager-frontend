import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authHeaders, API_BASE_URL } from "../api";

const StatCard = ({ label, value, color }) => (
  <div
    className={`bg-white rounded-2xl shadow border border-gray-100 p-5 flex flex-col gap-1`}
  >
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
      {label}
    </p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/`, authHeaders())
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading users:", err);
        setLoading(false);
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate("/home");
        }
      });
  }, [navigate]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/user/${userId}`, authHeaders());
      setUsers(users.filter((u) => u.userId !== userId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading users...</p>;

  const verified = users.filter((u) => u.emailVerified).length;
  const unverified = users.length - verified;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0effe" }}>
      <div className="max-w-5xl mx-auto pt-8 px-4 pb-8">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Admin Panel</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Users"
            value={users.length}
            color="text-indigo-600"
          />
          <StatCard label="Verified" value={verified} color="text-green-600" />
          <StatCard
            label="Unverified"
            value={unverified}
            color="text-red-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table header with search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">All Users</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 w-full sm:w-56"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs">
                <tr>
                  {[
                    "User",
                    "Email",
                    "First Name",
                    "Last Name",
                    "Verified",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => {
                  const initial = (u.username?.[0] || "?").toUpperCase();
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initial}
                          </div>
                          <span className="font-semibold text-indigo-600">
                            {u.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{u.email}</td>
                      <td className="px-5 py-3 text-gray-600">{u.firstName}</td>
                      <td className="px-5 py-3 text-gray-600">{u.lastName}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            u.emailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {u.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDelete(u.userId)}
                          className="text-red-400 hover:text-red-600 font-semibold text-xs border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-10">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
