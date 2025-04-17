import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginScreen from "./screens/Auth/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen";
import AdminDashboard from "./screens/Admin/AdminDashboard";
import CreateBunk from "./screens/Admin/CreateBunk";
import ManageBunks from "./screens/Admin/ManageBunks";
import UserDashboard from "./screens/User/UserDashboard";

import Home from "./screens/HomeScreen";
import BunkDetails from "./screens/User/BunkDetails";
import BookSlot from "./screens/User/BookSlot";
import SlotsBooked from "./screens/Admin/BookedSlots";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<LoginScreen />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/create-bunk" element={<CreateBunk />} />
        <Route path="/manage-bunks" element={<ManageBunks />} />
        <Route path="/slots-booked" element={<SlotsBooked />} />
        <Route path="/bunk/:id" element={<BunkDetails />} />
        <Route path="/book-slot/:id" element={<BookSlot/>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
