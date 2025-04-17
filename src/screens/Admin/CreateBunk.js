import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateBunk = () => {
  const navigate = useNavigate();
  const [bunkName, setBunkName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [contact, setContact] = useState("");
  const [longitude, setLongitude] = useState("");
  const [slots, setSlots] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");

  const handleAddBunk = async () => {
    if (!bunkName || !address || !latitude || !longitude || !slots || !googleMapLink || !contact) {
      toast.error("Please fill in all details");
      return;
    }
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("You must be logged in as admin to add a bunk.");
        return;
      }

      await addDoc(collection(db, "bunks"), {
        name: bunkName,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        slots: parseInt(slots),
        googleMapLink,
        contact,
        adminId: currentUser.uid,
      });

      toast.success("🚀 Bunk added successfully!");
      setBunkName("");
      setAddress("");
      setLatitude("");
      setContact("");
      setLongitude("");
      setSlots("");
      setGoogleMapLink("");

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error adding bunk:", error);
      toast.error("Error adding bunk. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white overflow-auto p-10">
      {/* Header */}
      <div className="w-full text-left p-6 bg-gray-800 text-xl font-semibold rounded-md shadow">
        <p>🛠️ Create New EV Bunk</p>
      </div>

      {/* Form */}
      <div className="flex-grow flex flex-col items-center p-10">
        <h1 className="text-3xl font-bold mb-8">📋 Enter Bunk Details</h1>
        <div className="w-full max-w-lg space-y-4">

          <input type="text" placeholder="🚏 Bunk Name" value={bunkName}
            onChange={(e) => setBunkName(e.target.value)}
            className="w-full p-3 rounded text-black"
          />

          <input type="text" placeholder="📍 Address" value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 rounded text-black"
          />

          <input type="number" placeholder="🌐 Latitude" value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full p-3 rounded text-black"
          />

          <input type="text" placeholder="📞 Contact Number" value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-3 rounded text-black"
          />

          <input type="number" placeholder="🌐 Longitude" value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full p-3 rounded text-black"
          />

          <input type="number" placeholder="🔋 Available Slots" value={slots}
            onChange={(e) => setSlots(e.target.value)}
            className="w-full p-3 rounded text-black"
          />

          <input type="text" placeholder="📌 Google Maps Link" value={googleMapLink}
            onChange={(e) => setGoogleMapLink(e.target.value)}
            className="w-full p-3 rounded text-black"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-6 mt-8">
          <button
            onClick={handleAddBunk}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded text-lg transition"
          >
            ➕ Add Bunk
          </button>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded text-lg transition"
          >
            ⬅ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBunk;
