import { useState } from "react";
import api from "../api";

function ReferralForm({ refresh }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (file) {
      formData.append("resume", file);
    }

    try {
      await api.post("/candidates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
      });
      setFile(null);
      refresh();
      alert("Candidate added!");
    } catch (error) {
      console.error("Failed to add candidate", error);
      alert("Could not add candidate. Check backend/API.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Refer Candidate</h2>

      <input
        name="name"
        placeholder="Name"
        className="w-full border p-2 mb-2"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-2"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        className="w-full border p-2 mb-2"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <input
        name="jobTitle"
        placeholder="Job Title"
        className="w-full border p-2 mb-2"
        value={form.jobTitle}
        onChange={handleChange}
        required
      />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-2"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Submit
      </button>
    </form>
  );
}

export default ReferralForm;