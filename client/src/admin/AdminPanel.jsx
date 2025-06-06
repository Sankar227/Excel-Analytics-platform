import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, setUploads, removeUpload } from "../redux/slices/adminSlice";
import { ToastContainer } from "react-toastify";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { users, uploads } = useSelector((state) => state.admin);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [usersRes, uploadsRes] = await Promise.all([
        axios.get("http://localhost:5001/auth/admin/users", config),
        axios.get("http://localhost:5001/upload/admin/all-uploads", config),
      ]);
      dispatch(setUsers(usersRes.data));
      dispatch(setUploads(uploadsRes.data));
    };

    fetchData();
  }, [dispatch, token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this file?")) {
      await axios.delete(`http://localhost:5001/upload/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removeUpload(id));
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-t from-amber-400 to-amber-100 p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-4xl text-blue-600">{users.length}</p>
        </div>
        <div className="bg-gradient-to-tr from-emerald-300 to-emerald-600 p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total File Uploads</h2>
          <p className="text-4xl text-rose-400">{uploads.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">All Uploaded Files</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-left">
          <thead>
            <tr className="bg-blue-200 text-blue-800">
              <th className="px-4 py-2">File Name</th>
              <th className="px-4 py-2">Uploaded By</th>
              <th className="px-4 py-2">Uploaded At</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{upload.fileName}</td>
                <td className="px-4 py-2">{upload.userId?.email || "N/A"}</td>
                <td className="px-4 py-2">
                  {new Date(upload.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(upload._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {uploads.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No uploads available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
