import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8000/vehicle");
      setVehicles(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      setError("Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await axios.delete(`http://localhost:8000/vehicle/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("Failed to delete vehicle.");
    }
  };

  return (
    <div className="p-6 text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Vehicles</h2>
        <button
          onClick={() => navigate("/addVehicle")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <p className="text-gray-800">Loading...</p>
      ) : error ? (
        <p className="text-red-700">{error}</p>
      ) : vehicles.length === 0 ? (
        <div className="text-center text-gray-700 bg-white py-6 rounded shadow">
          No vehicles found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-gray-900">
            <thead className="bg-gray-100 text-left text-sm uppercase text-gray-800">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Rate / Hour</th>
                <th className="px-6 py-3">Adjusted Rate / Hour</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {vehicle.imageUrl ? (
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.name}
                        className="h-16 w-24 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-24 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{vehicle.name}</td>
                  <td className="px-6 py-4">Rs. {vehicle.rate?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {vehicle.adjustedRate !== null && vehicle.adjustedRate !== undefined ? (
                      <span>Rs. {vehicle.adjustedRate.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        vehicle.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
