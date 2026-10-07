import React, { useState, useEffect } from "react";
import axios from "axios";

const Documents = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/documents/my/${userId}`);
      setDocs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchDocuments();
  }, [userId]);

  const handleUpload = async (type, e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("type", type);

    if (form.front.files[0]) formData.append("front", form.front.files[0]);
    if (form.back?.files[0]) formData.append("back", form.back.files[0]);
    if (type === "drivingLicense" && form.licenseExpiry?.value) {
      formData.append("licenseExpiry", form.licenseExpiry.value);
    }

    try {
      setUploading(true);
      setMessage("");
      const res = await axios.post("http://localhost:8000/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      fetchDocuments();
      form.reset();
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      not_uploaded: "bg-gray-200 text-gray-700",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.not_uploaded}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">My Documents</h1>
      <p className="text-gray-600 mb-8">
        You must upload and get both documents approved before you can book a vehicle.
      </p>

      {docs?.documentsVerified && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✅ Your documents are verified. You can now book vehicles.
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* National ID Card */}
        <div className="border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">National ID / Citizenship Card</h2>
            {getStatusBadge(docs?.nationalIdStatus)}
          </div>

          {docs?.nationalIdRejection && (
            <p className="text-red-600 text-sm mb-3">Reason: {docs.nationalIdRejection}</p>
          )}

          {(docs?.nationalIdFront || docs?.nationalIdBack) && (
            <div className="flex gap-3 mb-4">
              {docs.nationalIdFront && (
                <img src={`http://localhost:8000${docs.nationalIdFront}`} alt="Front" className="w-32 h-20 object-cover rounded border" />
              )}
              {docs.nationalIdBack && (
                <img src={`http://localhost:8000${docs.nationalIdBack}`} alt="Back" className="w-32 h-20 object-cover rounded border" />
              )}
            </div>
          )}

          {(docs?.nationalIdStatus === "not_uploaded" || docs?.nationalIdStatus === "rejected") && (
            <form onSubmit={(e) => handleUpload("nationalId", e)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Front Side</label>
                <input type="file" name="front" accept="image/*" required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Back Side</label>
                <input type="file" name="back" accept="image/*" className="w-full border rounded p-2" />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload National ID"}
              </button>
            </form>
          )}
        </div>

        {/* Driving License */}
        <div className="border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Driving License</h2>
            {getStatusBadge(docs?.drivingLicenseStatus)}
          </div>

          {docs?.drivingLicenseRejection && (
            <p className="text-red-600 text-sm mb-3">Reason: {docs.drivingLicenseRejection}</p>
          )}

          {(docs?.drivingLicenseFront || docs?.drivingLicenseBack) && (
            <div className="flex gap-3 mb-4">
              {docs.drivingLicenseFront && (
                <img src={`http://localhost:8000${docs.drivingLicenseFront}`} alt="Front" className="w-32 h-20 object-cover rounded border" />
              )}
              {docs.drivingLicenseBack && (
                <img src={`http://localhost:8000${docs.drivingLicenseBack}`} alt="Back" className="w-32 h-20 object-cover rounded border" />
              )}
            </div>
          )}

          {(docs?.drivingLicenseStatus === "not_uploaded" || docs?.drivingLicenseStatus === "rejected") && (
            <form onSubmit={(e) => handleUpload("drivingLicense", e)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Front Side</label>
                <input type="file" name="front" accept="image/*" required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Back Side (optional)</label>
                <input type="file" name="back" accept="image/*" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Expiry Date</label>
                <input type="date" name="licenseExpiry" className="w-full border rounded p-2" />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Driving License"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;