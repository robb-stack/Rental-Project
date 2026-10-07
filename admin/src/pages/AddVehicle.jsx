import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "available",
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.status) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("price", formData.price);
      dataToSend.append("status", formData.status);
      if (formData.image) {
        dataToSend.append("image", formData.image);
      }

      await axios.post("http://localhost:8000/vehicle", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Vehicle added successfully.");
      setTimeout(() => {
        navigate("/vehicles");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to add vehicle.");
    }
  };

  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 uppercase">
        Add Vehicle
      </h1>

      {/* FORM CARD */}
      <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Vehicle Details</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Price per Hour ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
