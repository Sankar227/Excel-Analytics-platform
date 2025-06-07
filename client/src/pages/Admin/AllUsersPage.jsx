import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const toggleBlockUser = async (userId, isCurrentlyBlocked) => {
    try {
      await axios.patch(
        `http://localhost:5001/auth/admin/users/${userId}/block`,
        { isBlocked: !isCurrentlyBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        `User has been ${isCurrentlyBlocked ? "unblocked" : "blocked"}`
      );
      fetchUsers();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDeleteUser = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) {
      toast.info("User deletion cancelled");
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/auth/admin/users/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">All Users</h1>
      <div className="bg-slate-300/40 shadow rounded overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-indigo-200 text-indigo-800">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Admin</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{u.name || "N/A"}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.isAdmin ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  {u.isBlocked ? (
                    <span className="text-red-600">Blocked</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>
                <td className="px-4 py-2 gap-2 flex items-center">
                  <button
                    onClick={() => toggleBlockUser(u._id, u.isBlocked)}
                    className={`px-3 py-1 rounded text-white ${
                      u.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded"
                    onClick={() => handleDeleteUser(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center p-4 text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
