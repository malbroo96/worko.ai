function Metrics({ candidates }) {
  const list = Array.isArray(candidates) ? candidates : [];

  const total = list.length;
  const pending = list.filter((c) => c?.status === "Pending").length;
  const reviewed = list.filter((c) => c?.status === "Reviewed").length;
  const hired = list.filter((c) => c?.status === "Hired").length;

  return (
    <div className="grid md:grid-cols-4 gap-4 my-6">
      <div className="bg-white p-4 rounded shadow">Total: {total}</div>
      <div className="bg-yellow-200 p-4 rounded">Pending: {pending}</div>
      <div className="bg-blue-200 p-4 rounded">Reviewed: {reviewed}</div>
      <div className="bg-green-200 p-4 rounded">Hired: {hired}</div>
    </div>
  );
}

export default Metrics;