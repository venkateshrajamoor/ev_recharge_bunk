import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const SlotsBooked = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, "bookedSlots"),
          where("adminId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">📋 Slots Booked by Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <p className="text-lg font-semibold mb-1">🙍 User: <span className="text-green-400">{booking.userName}</span></p>
              <p className="text-gray-300 mb-1">⛽ Bunk: {booking.bunkName}</p>
              <p className="text-gray-400 mb-1">⏰ Slot Time: {booking.slotTime}</p>
              <p className="text-gray-500 text-sm">📅 Booked At: {new Date(booking.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center mt-8">No slots booked yet.</p>
        )}
      </div>

      <div className="flex justify-center mt-12">
        <button
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
          onClick={() => navigate("/admin-dashboard")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SlotsBooked;
