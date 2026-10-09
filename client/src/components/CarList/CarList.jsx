import React, { useEffect, useState } from "react";
import axios from "axios";
import PayButton from "../PayButton";   
import DatePicker from "../DatePicker/DatePicker";

const CarList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // ← for showing pay button
  const [bookingDates, setBookingDates] = useState({});


  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get(`http://localhost:8000/vehicle?userId=${user?.id}`)
      .then(res => setVehicles(res.data.data))
      .catch(err => console.error("Error fetching vehicles:", err));

    if (user) {
      axios.get(`http://localhost:8000/booking/user/${user.id}`)
        .then(res => setUserBookings(res.data.data))
        .catch(err => console.error("Error fetching bookings:", err));
    }
  }, []);

  const handleDateChange = (carId, value) => {
    setBookingDates((prev) => ({ ...prev, [carId]: value }));
  } ;

  const handleBookNow = async (vehicleId, carName, amount) => {
    const bookingDate = bookingDates[vehicleId];
    if (!user) {
      alert("Please log in to book a vehicle.");
      return;
    }

    if(!bookingDate){
      alert("Please Input the booking date as well.");
      return;

    }

    try {
      const res = await axios.post("http://localhost:8000/booking", {
        userId: user.id,
        vehicleId,
        status: "pending",
      });

      const newBooking = res.data.data; 

      alert("Booking created! Please complete the payment.");

      // Showing Pay Button for this booking
      setSelectedBooking({
        id: newBooking.id,
        carName: carName,
        amount: amount,
        email: user.email,
      });

      // Refreshing bookings list
      const bookingsRes = await axios.get(`http://localhost:8000/booking/user/${user.id}`);
      setUserBookings(bookingsRes.data.data);

    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Booking failed. You may have already booked this vehicle.";

      alert(message);
      console.error("Booking error:", err.response?.data || err);
    }
  };

  const isBooked = (vehicleId) => {
    return userBookings.some(b => b.vehicleId === vehicleId && b.status !== "denied");
  };

  return (
    <div className="pb-24">
      <div className="container">
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif mb-3">
          Book Your Ride Now
        </h1>
        <p className="text-sm pb-10">
          Choose your car, pick your dates, and hit the road – it’s that easy.
        </p>

        {/* Show Pay Button if a booking was just created */}
        {selectedBooking && (
          <div className="mb-8 p-4 bg-green-50 border border-green-300 rounded-lg text-center">
            <p className="mb-3 font-medium">Booking created successfully! Please pay to confirm.</p>
            <PayButton
              bookingId={selectedBooking.id}
              carName={selectedBooking.carName}
              amount={selectedBooking.amount}
              customerEmail={selectedBooking.email}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {vehicles.map((car, index) => (
            <div
              key={car.id}
              className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group"
            >
              <div className="w-full h-[120px] bg-red-500">
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-full object-cover border-2 border-gray-400 rounded-lg group-hover:scale-[1.05] transition duration-300"
                />
              </div>
              <div className="space-y-4">
                <h1 className="text-primary font-semibold">{car.name}</h1>
                <div className="flex justify-between items-center text-xl font-semibold">
                  <p>Rs. {car.adjustedRate}/Day</p>
                  {isBooked(car.id) ? (
                    <span className="text-gray-500 text-sm">Booked</span>
                  ) : (
                    <button
                      onClick={() => handleBookNow(car.id, car.name, car.adjustedRate)}
                      className="text-sm px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xl font-semibold capitalize text-[0.85em]">
                Status: <span className="text-green-500">{isBooked(car.id) ? "Booked" : car.status}</span>
              </p>
              <div className="text-sm">
                <label htmlFor="date" className="">Booking Date: </label>
                <input
                  type="date"
                  name="date"
                  className=""
                  style={{
                    padding: '10px 12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    color: '#111',
                    background: '#fff',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: '260px',
                  }}
                  value={bookingDates[car.id] || ""}
                  onChange={(e) => handleDateChange(car.id, e.target.value)}
                />
              </div>
              <div className="h-[0.2vh] w-full bg-black"></div>
              <p className="text-[0.8em] text-gray-500"><span className="font-semibold text-black/80">Note:</span> Pickup Available Only in Kathmandu</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarList;