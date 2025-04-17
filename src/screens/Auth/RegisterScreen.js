import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), { fullName, email, role });
      toast.success("Registration successful!");
      
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      toast.error("Registration failed. Try again.");
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 h-full">
        <img src="3.jpg" alt="EV Recharge Bunk" className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-900 text-white p-10">
        <h1 className="text-3xl font-bold mb-4">Register</h1>
        <form onSubmit={handleRegister} className="w-80 flex flex-col gap-4">
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="p-3 rounded bg-gray-800 text-white" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 rounded bg-gray-800 text-white" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 rounded bg-gray-800 text-white" required />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="p-3 rounded bg-gray-800 text-white" required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-center gap-4">
            <button type="submit" className="bg-green-500 px-6 py-3 rounded">Register</button>
            <button onClick={() => navigate("/")} className="bg-red-500 px-6 py-3 rounded">Back to Main Page</button>
          </div>
        </form>
        <p className="mt-4">
          Already an existing user? <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
