import { useState } from "react";
import api, { setToken } from "../utils/api";

function Signup({ onAuthSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const response = await api.post("/auth/signup", form);
      setToken(response.data.token);
      onAuthSuccess(response.data.user);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h1 className="mb-4 text-2xl font-bold">Candidate Signup</h1>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <input
          name="name"
          type="text"
          placeholder="Full name"
          className="mb-3 w-full rounded border p-2"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded border p-2"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded border p-2"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 py-2 text-white"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="mt-3 w-full text-sm text-blue-700 underline"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default Signup;