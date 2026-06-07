import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authHeaders, API_BASE } from "../api";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/user/`, authHeaders())
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
      await axios.delete(`${API_BASE}/user/${userId}`, authHeaders());
      setUsers(users.filter((u) => u.userId !== userId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading users...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        Admin Panel — All Users
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl border border-gray-100">
          <thead>
            <tr className="bg-indigo-50 text-left">
              {[
                "ID",
                "Username",
                "Email",
                "First Name",
                "Last Name",
                "Verified",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 text-indigo-700 font
semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id}
                className={i % 2 === 0 ? "bg-white" : "bg-indigo-50/30"}
              >
                <td className="p-3 text-gray-500 text-sm">{u.id}</td>
                <td className="p-3 font-semibold text-indigo-600">
                  {u.username}
                </td>
                <td className="p-3 text-gray-700">{u.email}</td>
                <td className="p-3 text-gray-700">{u.firstName}</td>
                <td className="p-3 text-gray-700">{u.lastName}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold  
                    ${u.emailVerified ? "bg-green-100 text-green-700" : "bg-red-100 textred-600"}`}
                  >
                    {u.emailVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(u.userId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
