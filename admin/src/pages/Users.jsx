import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [modalError, setModalError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/user");
      setUsers(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ fullName: user.fullName, email: user.email });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      setModalError("Please fill out all fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/user/${selectedUser.id}`, formData);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setModalError("Failed to update user.");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/user/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  if (loading) return <p className="text-gray-800 p-6">Loading users...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-gray-900">
          <thead className="bg-gray-100 text-left text-sm uppercase text-gray-800">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>

            {modalError && <p className="text-red-600 mb-3">{modalError}</p>}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white text-gray-900"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
