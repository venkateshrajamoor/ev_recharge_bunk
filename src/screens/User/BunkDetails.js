import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

const BunkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bunk, setBunk] = useState(null);
  const [availableSlots, setAvailableSlots] = useState(0);
  const TOTAL_SLOTS = 4;

  useEffect(() => {
    const fetchBunkAndSlots = async () => {
      try {
        const bunkRef = doc(db, "bunks", id);
        const bunkSnap = await getDoc(bunkRef);

        if (!bunkSnap.exists()) {
          toast.error("Bunk not found");
          return;
        }

        const bunkData = { id: bunkSnap.id, ...bunkSnap.data() };
        setBunk(bunkData);

        const q = query(
          collection(db, "bookedSlots"),
          where("bunkId", "==", bunkData.id)
        );
        const slotSnapshot = await getDocs(q);
        const bookedCount = slotSnapshot.size;
        const remaining = TOTAL_SLOTS - bookedCount;

        setAvailableSlots(remaining >= 0 ? remaining : 0);
      } catch (err) {
        console.error("Error fetching bunk or slots:", err);
        toast.error("Failed to load bunk details");
      }
    };

    fetchBunkAndSlots();
  }, [id]);

  if (!bunk) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-green-400 mb-4">
          ⛽ {bunk.name || "Bunk Details"}
        </h2>

        <div className="space-y-2 text-lg">
          <p><span className="font-semibold">📍 Address:</span> {bunk.address}</p>
          <p><span className="font-semibold">📞 Contact:</span> {bunk.contact || "Not Available"}</p>
          <p>
            <span className="font-semibold">📦 Available Slots:</span>{" "}
            <span className={`${availableSlots === 0 ? "text-red-400" : "text-yellow-400"}`}>
              {availableSlots}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => navigate(`/book-slot/${bunk.id}`)}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
          >
            ⚡ Book Slot
          </button>
          <button
            onClick={() => window.open(bunk.googleMapLink, "_blank")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
          >
            📍 View on Map
          </button>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded text-white"
          >
            ⬅ Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BunkDetails;
