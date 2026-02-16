import { useState } from "react";
import CandidateCard from "./CandidateCard";

function Dashboard({ candidates, loading, refresh }) {
  const [search, setSearch] = useState("");

  const list = Array.isArray(candidates) ? candidates : [];
  const normalizedSearch = search.toLowerCase();

  const filtered = list.filter((candidate) => {
    const jobTitle = (candidate?.jobTitle ?? "").toLowerCase();
    const status = (candidate?.status ?? "").toLowerCase();

    return (
      jobTitle.includes(normalizedSearch) || status.includes(normalizedSearch)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by job title or status"
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((candidate, index) => (
            <CandidateCard
              key={candidate?._id ?? candidate?.email ?? index}
              candidate={candidate}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;