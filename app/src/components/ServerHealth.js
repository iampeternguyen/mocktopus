import React, { useState, useEffect, useCallback } from "react";
import "./ServerHealth.css";

const ServerHealthComponent = ({ serverActions }) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState();

  const checkServerHealth = useCallback(
    async (override = false) => {
      try {
        if (loading || (!isHealthy && override === false)) {
          return;
        }
        setLoading(true);
        // Simulate an API call to check health based on the provided path
        const response = await fetch(`${selectedServer}/health`, { cache: "no-store" });
        setError(null);
        setIsHealthy((await response.json()) === "Server is healthy.");
      } catch (err) {
        setError("Failed to check server health.");
      } finally {
        setLoading(false);
      }
    },
    [loading, isHealthy, selectedServer]
  );

  // Simulate health check
  useEffect(() => {
    const intervalId = setInterval(checkServerHealth, 1000);

    return () => clearInterval(intervalId);
  }, [loading, isHealthy, serverActions, checkServerHealth]);

  const killServer = async () => {
    try {
      setLoading(true);
      // Simulate an API call to kill the server based on the provided path
      //
      const response = await fetch(`${selectedServer}/shutdown`, { cache: "no-store" });
      console.log(response);
    } catch (err) {
      setError("Failed to kill the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="server-health-container">
      <select
        value={selectedServer}
        onChange={(e) => setSelectedServer(e.target.value)}
        className="endpoint-dropdown"
      >
        {serverActions.map((server) => (
          <option key={server.path} value={server.path}>
            {server.name}
          </option>
        ))}
      </select>
      <div className="indicator">
        <div className="name">
          Server Status
        </div>
        <div className={`status-indicator ${isHealthy ? "healthy" : "unhealthy"}`}></div>
        <button className="button" onClick={killServer}>
          Switch to mock
        </button>
        <button className="button" onClick={() => checkServerHealth(true)}>
          Check Health
        </button>
      </div>
    </div>
  );
};

export default ServerHealthComponent;
