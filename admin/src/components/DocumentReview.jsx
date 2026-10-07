import React, { useState, useEffect } from "react";
import axios from "axios";

const DocumentReview = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/documents/pending");
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (userId, type, action) => {
    try {
      await axios.patch("http://localhost:8000/api/documents/review", {
        userId,
        type,
        action,
        reason: action === "rejected" ? reason : null,
      });
      setReason("");
      setSelected(null);
      fetchPending();
      alert(`${type} ${action} successfully`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Document Review</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No pending documents.</p>
      ) : (
        <div className="space-y-6">
          {users.map((user) => (
            <div key={user.id} className="border rounded-xl p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{user.fullName}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* National ID */}
                {user.nationalIdStatus === "pending" && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">National ID (Pending)</h3>
                    <div className="flex gap-3 mb-4">
                      {user.nationalIdFront && (
                        <img src={`http://localhost:8000${user.nationalIdFront}`} alt="Front" className="w-40 h-28 object-cover rounded border" />
                      )}
                      {user.nationalIdBack && (
                        <img src={`http://localhost:8000${user.nationalIdBack}`} alt="Back" className="w-40 h-28 object-cover rounded border" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(user.id, "nationalId", "approved")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelected({ userId: user.id, type: "nationalId" })}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Driving License */}
                {user.drivingLicenseStatus === "pending" && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Driving License (Pending)</h3>
                    <div className="flex gap-3 mb-4">
                      {user.drivingLicenseFront && (
                        <img src={`http://localhost:8000${user.drivingLicenseFront}`} alt="Front" className="w-40 h-28 object-cover rounded border" />
                      )}
                      {user.drivingLicenseBack && (
                        <img src={`http://localhost:8000${user.drivingLicenseBack}`} alt="Back" className="w-40 h-28 object-cover rounded border" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(user.id, "drivingLicense", "approved")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelected({ userId: user.id, type: "drivingLicense" })}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Rejection Reason</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded p-3 mb-4"
              rows="3"
              placeholder="Enter reason for rejection..."
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={() => handleReview(selected.userId, selected.type, "rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReview;