// import React, { useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const AdminPanel = () => {
//   const [uploads, setUploads] = React.useState([]);
//   const token = useSelector((state) => state.auth.token);

//   const fetchAllUploads = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5001/upload/admin/all-uploads",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setUploads(response.data);
//     } catch (error) {
//       console.error("Error fetching uploads:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllUploads();
//   }, [token]);

//   return (
//     <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="max-w-3xl mx-auto">
//         <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center uppercase text-gray-800">
//           Admin Upload Manager
//         </h2>

//         {uploads.length === 0 ? (
//           <p className="text-center text-gray-500">No uploads found.</p>
//         ) : (
//           <div>
//             {uploads.map((upload) => (
//               <div
//                 key={upload._id}
//                 className="bg-white shadow-md rounded-lg p-4 mb-4"
//               >
//                 <div>
//                   <p>File: {upload.fileName}</p>
//                   <p>Uploaded by: {upload.userId.email}</p>
//                   <p>
//                     Timestamp: {new Date(upload.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default AdminPanel;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";

const AdminPanel = () => {
  const [uploads, setUploads] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const fetchAllUploads = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/upload/admin/all-uploads",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUploads(res.data);
    } catch (err) {
      console.error("Failed to load admin uploads", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;
    try {
      await axios.delete(`http://localhost:5001/upload/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("File deleted successfully");
      fetchAllUploads();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete file.");
    }
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchAllUploads();
  }, [token]);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center uppercase text-gray-800">
          Admin Upload Manager
        </h2>

        {uploads.length === 0 ? (
          <p className="text-center text-gray-500">No uploads found.</p>
        ) : (
          <div className="space-y-6">
            {uploads.map((entry) => (
              <div
                key={entry._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>File:</strong> {entry.fileName}
                  </p>
                  <p>
                    <strong>User:</strong> {entry.userId?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Uploaded at:</strong>{" "}
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>

                <pre className="text-xs bg-gray-100 p-3 mt-4 rounded-lg overflow-x-auto max-h-60">
                  {JSON.stringify(
                    expanded === entry._id
                      ? entry.preview
                      : entry.preview.slice(0, 3),
                    null,
                    2
                  )}
                </pre>

                <div className="mt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => toggleExpanded(entry._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expanded === entry._id
                      ? "Hide Full Data"
                      : "View Full Data"}
                  </button>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
