import { useState } from "react";
import api from "../utils/api";

function ReferralForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("jobTitle", form.jobTitle);

      if (resume) {
        payload.append("resume", resume);
      }

      // FormData + axios syntax from axios docs.
      const response = await api.post("/referrals", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ name: "", email: "", phone: "", jobTitle: "" });
      setResume(null);
      onCreated(response.data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to submit referral");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold">Referral Form</h2>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="name"
          placeholder="Candidate name"
          className="rounded border p-2"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Candidate email"
          className="rounded border p-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          className="rounded border p-2"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="jobTitle"
          placeholder="Job title"
          className="rounded border p-2"
          value={form.jobTitle}
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => setResume(event.target.files?.[0] || null)}
        className="mt-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white"
      >
        {loading ? "Submitting..." : "Submit Referral"}
      </button>
    </form>
  );
}

export default ReferralForm;