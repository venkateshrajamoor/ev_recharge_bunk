import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { toast } from "react-toastify";

const timeSlots = ["10:00 - 12:00", "12:00 - 2:00", "2:00 - 4:00", "4:00 - 6:00"];

const BookSlot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [bunk, setBunk] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userName, setUserName] = useState("");

  const fetchBunkDetails = async () => {
    try {
      const docRef = doc(db, "bunks", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBunk({ id: docSnap.id, ...docSnap.data() });
      } else {
        toast.error("Bunk not found");
        navigate("/user-dashboard");
      }
    } catch (err) {
      toast.error("Error fetching bunk details");
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const q = query(collection(db, "bookedSlots"), where("bunkId", "==", id));
      const snapshot = await getDocs(q);
      const booked = snapshot.docs.map((doc) => doc.data().slotTime);
      setBookedSlots(booked);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    }
  };

  useEffect(() => {
    fetchBunkDetails();
    fetchBookedSlots();
  }, [id]);

  const handleBook = async () => {
    if (!bunk || bunk.slots <= 0 || !selectedSlot || !userName.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (bookedSlots.includes(selectedSlot)) {
      toast.error("This slot is already booked");
      return;
    }

    setIsBooking(true);
    try {
      const updatedSlots = bunk.slots - 1;

      await addDoc(collection(db, "bookedSlots"), {
        userName,
        slotTime: selectedSlot,
        timestamp: new Date().toISOString(),
        bunkId: bunk.id,
        bunkName: bunk.name,
        adminId: bunk.adminId || "",
      });

      

      toast.success("Slot booked successfully!");
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.error("Failed to book slot");
    } finally {
      setIsBooking(false);
    }
  };

  if (!bunk) return <p className="text-white p-10">Loading bunk data...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">⚡ Book a Charging Slot</h1>

      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-xl shadow-lg border border-gray-700">
        <p className="text-2xl font-semibold text-green-400 mb-2">⛽ {bunk.name}</p>
        <p className="text-sm text-gray-300">📍 Address: {bunk.address}</p>
        <p className="text-sm text-yellow-300 mb-4">📦 Slots Left: {bunk.slots}</p>

        <label className="block mt-4 mb-1 font-semibold">🙍 Your Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="Enter your name"
        />

        <label className="block mt-4 mb-1 font-semibold">🕐 Choose Time Slot:</label>
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="w-full p-2 text-black rounded"
        >
          <option value="">-- Select a time slot --</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
              {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
            </option>
          ))}
        </select>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBook}
            className={`px-6 py-2 rounded ${
              isBooking || !selectedSlot || bookedSlots.includes(selectedSlot)
                ? "bg-green-700 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isBooking || !selectedSlot || bookedSlots.includes(selectedSlot)}
          >
            {isBooking ? "Booking..." : "✅ Confirm Booking"}
          </button>

          <button
            onClick={() => navigate("/user-dashboard")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded"
          >
            ⬅ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
