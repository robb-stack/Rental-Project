import React, { useEffect, useState } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8000/booking");
      setBookings(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings", err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/booking/approve/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Error approving booking", err);
    }
  };

  const handleDeny = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/booking/deny/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Error denying booking", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const handledBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "denied"
  );

  if (loading) return <p className="text-gray-800">Loading bookings...</p>;

  return (
    <div className="p-6 space-y-10 text-gray-900">
      <h1 className="text-2xl font-bold">Confirmed / Denied Bookings</h1>
      <div className="grid gap-4">
        {handledBookings.length === 0 && (
          <p className="text-gray-700">No confirmed or denied bookings.</p>
        )}
        {handledBookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-300 p-4 rounded shadow flex justify-between items-center bg-white"
          >
            <div>
              <p className="font-semibold">Vehicle: {booking.vehicle.name}</p>
              <p>User ID: {booking.userId}</p>
              <p>
                Status:{" "}
                <span
                  className={
                    booking.status === "denied"
                      ? "text-red-600"
                      : "text-green-700"
                  }
                >
                  {booking.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold">Pending Requests</h1>
      <div className="grid gap-4">
        {pendingBookings.length === 0 && (
          <p className="text-gray-700">No pending booking requests.</p>
        )}
        {pendingBookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-300 p-4 rounded shadow flex justify-between items-center bg-white"
          >
            <div>
              <p className="font-semibold">Vehicle: {booking.vehicle.name}</p>
              <p>User ID: {booking.userId}</p>
              <p>Status: {booking.status}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleApprove(booking.id)}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDeny(booking.id)}
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
