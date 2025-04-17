import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const ManageBunks = () => {
  const [bunks, setBunks] = useState([]);
  const [bookedSlotMap, setBookedSlotMap] = useState({});
  const [selectedSlotMap, setSelectedSlotMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBunks = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      try {
        const bunkSnapshot = await getDocs(collection(db, "bunks"));
        const allBunks = bunkSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((bunk) => bunk.adminId === user.uid);

        const bookingSnapshot = await getDocs(collection(db, "bookedSlots"));
        const bookings = bookingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const updatedBunks = allBunks.map((bunk) => {
          const bookingsForBunk = bookings.filter((b) => b.bunkId === bunk.id);
          const remainingSlots = 4 - bookingsForBunk.length;

          return {
            ...bunk,
            slots: remainingSlots,
          };
        });

        const bookedMap = {};
        allBunks.forEach((bunk) => {
          const booked = bookings
            .filter((b) => b.bunkId === bunk.id)
            .map((b) => ({
              id: b.id,
              slotTime: b.slotTime,
            }));
          bookedMap[bunk.id] = booked;
        });

        setBookedSlotMap(bookedMap);
        setBunks(updatedBunks);
      } catch (error) {
        console.error("Error fetching bunks:", error);
      }
    };

    fetchBunks();
  }, [navigate]);

  const deleteBunk = async (id) => {
    await deleteDoc(doc(db, "bunks", id));
    setBunks((prev) => prev.filter((bunk) => bunk.id !== id));
  };

  const handleAddSlot = async (bunkId, currentSlots) => {
    const selected = selectedSlotMap[bunkId];
    const slotToDelete = bookedSlotMap[bunkId]?.find((s) => s.slotTime === selected);

    if (!slotToDelete) return;

    try {
      await deleteDoc(doc(db, "bookedSlots", slotToDelete.id));

      setBunks((prevBunks) =>
        prevBunks.map((bunk) =>
          bunk.id === bunkId ? { ...bunk, slots: currentSlots + 1 } : bunk
        )
      );

      setBookedSlotMap((prevMap) => ({
        ...prevMap,
        [bunkId]: prevMap[bunkId].filter((s) => s.slotTime !== selected),
      }));

      setSelectedSlotMap((prev) => ({ ...prev, [bunkId]: "" }));
    } catch (err) {
      console.error("Error releasing slot:", err);
    }
  };

  return (
    <div className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🛠️ Manage EV Bunks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bunks.map((bunk) => (
          <div key={bunk.id} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-1">🚏 {bunk.name}</h2>
            <p className="text-gray-300">📍 {bunk.address}</p>
            <p className="text-gray-400 text-sm">📞 {bunk.contact || "N/A"}</p>
            <p className="mt-2">
              🔋 Available Slots:{" "}
              <span className="font-bold text-green-400">{bunk.slots}</span>
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={bunk.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center"
              >
                📌 View on Map
              </a>

              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                onClick={() => deleteBunk(bunk.id)}
              >
                ❌ Delete Bunk
              </button>

              {bookedSlotMap[bunk.id]?.length > 0 && (
                <div className="mt-3">
                  <select
                    className="text-black px-2 py-2 rounded w-full mb-2"
                    value={selectedSlotMap[bunk.id] || ""}
                    onChange={(e) =>
                      setSelectedSlotMap((prev) => ({
                        ...prev,
                        [bunk.id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">🔽 Select slot to free</option>
                    {bookedSlotMap[bunk.id].map((slot) => (
                      <option key={slot.id} value={slot.slotTime}>
                        {slot.slotTime}
                      </option>
                    ))}
                  </select>

                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full"
                    onClick={() => handleAddSlot(bunk.id, bunk.slots)}
                    disabled={!selectedSlotMap[bunk.id]}
                  >
                    ✅ Free Selected Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg mt-10"
        onClick={() => navigate("/admin-dashboard")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default ManageBunks;
