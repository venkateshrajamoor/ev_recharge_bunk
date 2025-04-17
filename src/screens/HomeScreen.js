import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gray-900 text-white overflow-auto">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[60vh] flex items-center justify-center px-10" style={{ backgroundImage: "url('2.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-4 text-green-400 drop-shadow-lg animate-fadeIn">Welcome to EV Recharge Bunk ⚡</h1>
          <p className="text-lg mb-6 text-gray-300">
            Empowering the electric future. Fast, reliable & eco-friendly charging at your fingertips.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg transition duration-300 shadow-lg"
          >
            🚀 Get Started
          </button>
        </div>
      </div>

      {/* Why EV Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10">
        <div className="flex justify-center">
          <img
            src="1.jpg"
            alt="EV Charging Station"
            className="rounded-xl w-full max-w-md shadow-lg"
          />
        </div>

        <div className="text-left">
          <h2 className="text-4xl font-bold mb-4 text-yellow-400">Why Choose EV Recharge Bunk?</h2>
          <ul className="text-lg space-y-3 text-gray-300">
            <li>✅ Reduce air pollution & carbon emissions</li>
            <li>✅ Support sustainable and renewable energy</li>
            <li>✅ Convenient fast-charging stations across cities</li>
            <li>✅ Save fuel costs and enjoy long-term savings</li>
            <li>✅ Enhance your eco-friendly travel experience</li>
          </ul>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-green-800 py-10 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Ready to Power Up Your Ride?
        </h2>
        <p className="text-gray-200 text-lg mb-6">
          Join us in driving toward a cleaner, greener future.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
        >
          📝 Register Now
        </button>
      </div>
    </div>
  );
};

export default Home;
