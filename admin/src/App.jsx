import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Users from "./pages/Users";
import Vehicles from "./pages/Vehicles";
import Bookings from "./pages/Bookings";
import Layout from "./components/Layout";
import AddVehicle from "./pages/addVehicle";
import DocumentReview from "./components/DocumentReview";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/users" />} />
          <Route path="users" element={<Users />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="addVehicle" element={<AddVehicle />} />
          <Route path="/documents" element={<DocumentReview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
