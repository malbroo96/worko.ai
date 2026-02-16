import api from "../api";

function CandidateCard({ candidate, refresh }) {
  const updateStatus = async (status) => {
    try {
      await api.put(`/candidates/${candidate._id}/status`, { status });
      refresh();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Could not update candidate status.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold">{candidate?.name ?? "Unknown"}</h2>
      <p>{candidate?.jobTitle ?? "No job title"}</p>

      <select
        className="border p-1 mt-2"
        value={candidate?.status ?? "Pending"}
        onChange={(e) => updateStatus(e.target.value)}
      >
        <option>Pending</option>
        <option>Reviewed</option>
        <option>Hired</option>
      </select>

      {candidate?.resumeUrl && (
        <a
          href={candidate.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="block mt-2 text-blue-500 underline"
        >
          View Resume
        </a>
      )}
    </div>
  );
}

export default CandidateCard;