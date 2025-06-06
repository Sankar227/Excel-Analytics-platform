// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const AllUsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const token = useSelector((state) => state.auth.token);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const res = await axios.get("http://localhost:5001/auth/admin/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data);
//     };
//     fetchUsers();
//   }, [token]);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-4">All Users</h1>
//       <div className="bg-white shadow rounded overflow-x-auto">
//         <table className="min-w-full text-left text-sm">
//           <thead className="bg-indigo-100 text-indigo-800">
//             <tr>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2">Admin</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr key={u._id} className="border-t hover:bg-gray-50">
//                 <td className="px-4 py-2">{u.name || "N/A"}</td>
//                 <td className="px-4 py-2">{u.email}</td>
//                 <td className="px-4 py-2">{u.isAdmin ? "Yes" : "No"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {users.length === 0 && (
//           <p className="text-center p-4 text-gray-500">No users found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUsersPage;

//edit by me
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">All Users</h1>
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-indigo-100 text-indigo-800">
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
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleBlockUser(u._id, u.isBlocked)}
                    className={`px-3 py-1 rounded text-white ${
                      u.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
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
