import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setData } from "../redux/slices/uploadSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
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
      // const res = await axios.post("http://localhost:5001/upload", formData, {
        const res = await axios.post(
          "https://excel-analytics-platform-backend-qnaz.onrender.com/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      dispatch(setData(res.data.data));
      toast.success("File uploaded successfully");
      setFile(null); // Clear the file input after upload
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 sm:px-6 lg:px-12">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <div className="max-w-4xl mx-auto bg-gradient-to-t  shadow-lg rounded-2xl p-6 border border-gray-200">
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
      </div>
    </div>
  );
};

export default UploadPage;
