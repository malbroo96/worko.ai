import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import ReferralForm from "./components/ReferralForm";
import Metrics from "./components/Metrics";
// import Login from "./components/Login";
import api from "./api";

function App() {
  // const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // if (token) {
    //   fetchCandidates();
    // }
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/candidates");
      const payload = res.data;

      const normalizedCandidates = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.candidates)
        ? payload.candidates
        : [];

      setCandidates(normalizedCandidates);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
      setCandidates([]);

      // if (err?.response?.status === 401) {
      //   localStorage.removeItem("token");
      //   setToken("");
      //   setError("Session expired. Please login again.");
      // } else {
      //   setError("Could not load candidates. Check backend server on port 5000.");
      // }
      setError("Could not load candidates. Check backend server on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   setToken("");
  //   setCandidates([]);
  //   setError("");
  // };

  // if (!token) {
  //   return <Login onLogin={setToken} />;
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidate Referral System</h1>
        {/*
        <button
          type="button"
          onClick={handleLogout}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
        */}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ReferralForm refresh={fetchCandidates} />
      <Metrics candidates={candidates} />
      <Dashboard
        candidates={candidates}
        loading={loading}
        refresh={fetchCandidates}
      />
    </div>
  );
}

export default App;