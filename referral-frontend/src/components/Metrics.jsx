function Metrics({ referrals }) {
  const list = Array.isArray(referrals) ? referrals : [];

  const pending = list.filter((item) => item.status === "Pending").length;
  const reviewed = list.filter((item) => item.status === "Reviewed").length;
  const hired = list.filter((item) => item.status === "Hired").length;
  const rejected = list.filter((item) => item.status === "Rejected").length;

  return (
    <div className="mb-6 grid gap-3 md:grid-cols-4">
      <div className="rounded bg-white p-4 shadow">Pending: {pending}</div>
      <div className="rounded bg-blue-100 p-4">Reviewed: {reviewed}</div>
      <div className="rounded bg-green-100 p-4">Hired: {hired}</div>
      <div className="rounded bg-red-100 p-4">Rejected: {rejected}</div>
    </div>
  );
}

export default Metrics;