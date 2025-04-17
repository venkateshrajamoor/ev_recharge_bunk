import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === "admin") {
          toast.success("Admin Login Successful!");
          navigate("/admin-dashboard");
        } else {
          toast.success("User Login Successful!");
          navigate("/user-dashboard");
        }
      } else {
        toast.error("User role not found. Contact support.");
      }
    } catch (error) {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 h-full">
        <img src="3.jpg" alt="EV Recharge Bunk" className="  object-cover" />
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-900 text-white p-10">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin} className="w-80 flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 rounded bg-gray-800 text-white" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 rounded bg-gray-800 text-white" required />
          <div className="flex justify-center gap-4">
            <button type="submit" className="bg-blue-500 px-7 py-3 rounded">Login</button>
            <button onClick={() => navigate("/")} className="bg-red-500 px-6 py-3 rounded">Back to Main Page</button>
          </div>
        </form>
        <p className="mt-4">
          New user? <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/register")} >Register here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;