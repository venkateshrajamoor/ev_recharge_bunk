import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("User");
  const [bunks, setBunks] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          if (doc.id === user.uid) {
            setFullName(doc.data().fullName);
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting user location:", error)
      );
    }
  }, [navigate]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchBunks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "bunks"));
      const bunkList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const countQuery = query(
            collection(db, "bookedSlots"),
            where("bunkId", "==", doc.id)
          );
          const snapshot = await getCountFromServer(countQuery);
          return {
            id: doc.id,
            ...data,
            bookedCount: snapshot.data().count,
            remainingSlots: data.slots - snapshot.data().count,
          };
        })
      );

      if (userLocation) {
        const nearbyBunks = bunkList.filter(
          (bunk) =>
            bunk.latitude &&
            bunk.longitude &&
            getDistance(
              userLocation.lat,
              userLocation.lng,
              bunk.latitude,
              bunk.longitude
            ) <= 30
        );
        setBunks(nearbyBunks);
      } else {
        setBunks([]);
      }
    } catch (error) {
      console.error("Error fetching bunks:", error);
    }
  };

  useEffect(() => {
    if (userLocation) {
      fetchBunks();
    }
  }, [userLocation]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white p-6">
      <div className="w-full text-left p-4 bg-gray-800 text-xl font-bold rounded-lg shadow">
        <p>👋 Hi {fullName}, Welcome to your EV Recharge Dashboard</p>
      </div>

      <div className="flex-grow flex flex-col items-center mt-10">
        <h1 className="text-4xl font-bold mb-4">⛽ Nearby EV Recharge Bunks</h1>
        <h2 className="text-lg text-gray-300 mb-6">📍 Within 30 KM of your location</h2>

        <ul className="w-full max-w-3xl grid gap-6">
          {bunks.length > 0 ? (
            bunks.map((bunk) => (
              <li
                key={bunk.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                <p className="text-2xl font-semibold mb-2">⛽ {bunk.name}</p>
                <p className="text-gray-300">📍 Address: {bunk.address}</p>
                <p className="text-gray-300">
                  🔋 Slots Available:{" "}
                  <span className="font-bold text-green-400">
                    {bunk.remainingSlots}
                  </span>
                </p>
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
                  onClick={() => navigate(`/bunk/${bunk.id}`)}
                >
                  🔎 View Details
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No nearby bunks found.</p>
          )}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
