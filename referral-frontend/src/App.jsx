import { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import api, { clearToken, getToken } from "./utils/api";

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const bootstrapUser = async () => {
      const token = getToken();
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    bootstrapUser();
  }, []);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setAuthMode("login");
  };

  if (loadingUser) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return authMode === "login" ? (
      <Login
        onAuthSuccess={handleAuthSuccess}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    ) : (
      <Signup
        onAuthSuccess={handleAuthSuccess}
        onSwitchToLogin={() => setAuthMode("login")}
      />
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;