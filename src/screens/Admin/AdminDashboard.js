import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Admin");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setFullName(userDoc.data().fullName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-6 rounded-lg shadow text-xl font-semibold">
        👋 Hi <span className="text-green-400">{fullName}</span>, Welcome to the Admin Panel
      </div>

      {/* Main Section */}
      <div className="flex-grow flex flex-col items-center justify-center mt-10">
        <h1 className="text-4xl font-bold mb-8 text-center">🛠️ Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <button
            onClick={() => navigate("/create-bunk")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg shadow text-lg transition"
          >
            ➕ Create Bunk Location
          </button>

          <button
            onClick={() => navigate("/manage-bunks")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg shadow text-lg transition"
          >
            🧾 Manage Bunks
          </button>

          <button
            onClick={() => navigate("/slots-booked")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-4 rounded-lg shadow text-lg transition"
          >
            📅 View Booked Slots
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white text-lg shadow transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
