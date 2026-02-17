import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import Metrics from "./Metrics";
import ReferralForm from "./ReferralForm";

function Dashboard({ user, onLogout }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  // React useEffect fetch pattern from React docs.
  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/referrals");
        setReferrals(response.data);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Failed to load referrals");
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const handleCreated = (newReferral) => {
    setReferrals((prev) => [newReferral, ...prev]);
  };

  const handleStatusChange = async (referralId, status) => {
    try {
      const response = await api.patch(`/referrals/${referralId}/status`, { status });

      setReferrals((prev) =>
        prev.map((item) => (item._id === referralId ? response.data : item))
      );
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to update status");
    }
  };

  const sortedReferrals = useMemo(() => {
    return [...referrals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [referrals]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidate Referral Dashboard</h1>
          <p className="text-sm text-gray-600">
            Logged in as {user?.name} ({user?.role})
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded bg-gray-900 px-4 py-2 text-white"
        >
          Logout
        </button>
      </header>

      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      <Metrics referrals={referrals} />

      {!isAdmin && <ReferralForm onCreated={handleCreated} />}

      <section className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Referrals</h2>

        {loading ? (
          <p>Loading...</p>
        ) : sortedReferrals.length === 0 ? (
          <p className="text-sm text-gray-600">No referrals found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Job Title</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Resume</th>
                  <th className="p-2">Referred By</th>
                </tr>
              </thead>

              <tbody>
                {sortedReferrals.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2">{item.phone}</td>
                    <td className="p-2">{item.jobTitle}</td>
                    <td className="p-2">
                      {isAdmin ? (
                        <select
                          value={item.status}
                          onChange={(event) =>
                            handleStatusChange(item._id, event.target.value)
                          }
                          className="rounded border p-1"
                        >
                          <option>Pending</option>
                          <option>Reviewed</option>
                          <option>Hired</option>
                          <option>Rejected</option>
                        </select>
                      ) : (
                        item.status
                      )}
                    </td>
                    <td className="p-2">
                      {item.resumeUrl ? (
                        <a
                          href={item.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">{item.referredBy?.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;