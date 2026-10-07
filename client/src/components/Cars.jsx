import React, { useEffect, useState } from "react";

const Cars = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setError("User not logged in.");
      return;
    }

    fetch(`http://localhost:8000/booking/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setBookings(data.data);
        } else {
          setError("Unexpected data format from server.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch bookings.");
      });
  }, []);

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Your Booked Cars</h1>

      {error && <p className="text-red-600">{error}</p>}

      {bookings.length === 0 && !error && <p>No bookings found.</p>}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border rounded-lg p-4 mb-4 shadow-md bg-white"
        >
          <h2 className="text-lg font-semibold">
            {booking.vehicle?.name || "Unknown Vehicle"}
          </h2>
          <p>Status: {booking.status}</p>
          <p>Rate: Rs. {booking.vehicle?.adjustedRate?.toFixed(2) || "N/A"}</p>
          {booking.vehicle?.image && (
            <img
              src={`http://localhost:8000/uploads/${booking.vehicle.image}`}
              alt={booking.vehicle.name}
              className="w-48 mt-2 rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Cars;
