import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setData } from "../redux/slices/uploadSlice";
import { ToastContainer, toast } from "react-toastify";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.upload.data);
  const token = useSelector((state) => state.auth.token);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5001/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setData(res.data.data));
      toast.success("File uploaded successfully");
      setFile(null); // Clear the file input after upload
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-24 sm:px-6 lg:px-12">
      <ToastContainer position="top-center" />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload Excel/CSV File
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
          >
            Upload
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Data Preview
          </h3>
          <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto max-h-64 text-sm whitespace-pre-wrap break-all border border-gray-200">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;

// import React, { useRef, useState } from "react";

// const Upload = () => {
//   const [file, setFile] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       const allowedTypes = ["xls", "xlsx", "csv"];
//       const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

//       if (!allowedTypes.includes(fileExtension)) {
//         alert("❌ Unsupported file type. Please upload an Excel or CSV file.");
//         if (fileInputRef.current) {
//           fileInputRef.current.value = ""; // Clear wrong file from input
//         }
//         setFile(null); // Clear selected file from state
//         return;
//       }

//       setFile(selectedFile); // Set the file only if it's valid
//     }
//   };

//   const handleUpload = (e) => {
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem("user")); // small "user"
//     if (!user) {
//       alert("User not logged in");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", user._id); // Add userId if you have user authentication
//     fetch("http://localhost:5000/upload", {
//       method: "post",
//       body: formData,
//       headers: {
//         // "Content-Type": "multipart/form-data", // Don't set this header for FormData
//         Authorization: `Bearer ${user.token}`, // Add token if needed
//       },
//     })
//       // .then((res) => res.json())

//       .then(async (res) => {
//         const contentType = res.headers.get("content-type");
//         const data = contentType?.includes("application/json")
//           ? await res.json()
//           : await res.text();

//         if (!res.ok) {
//           throw new Error(data?.error || data || "Upload failed");
//         }

//         alert("File uploaded successfully");
//         setFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//         console.log(data);
//       })

//       .then((data) => {
//         console.log(data);
//         alert("File uploaded successfully"); // Display success message
//         setFile(); // Reset the file input after upload
//         if (fileInputRef.current) {
//           fileInputRef.current.value = ""; // Clear the file input
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         alert(err.message || "Something went wrong"); // Display error message
//       });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Upload File
//         </h1>

//         <div className="flex items-center justify-center w-full">
//           <input
//             type="file"
//             className="py-8"
//             onChange={handleFileChange}
//             ref={fileInputRef}
//           />
//         </div>

//         <button
//           className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 rounded-full transition duration-300"
//           onClick={handleUpload}
//         >
//           Upload
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Upload;
