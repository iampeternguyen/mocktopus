import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ServerHealth.css"; // Importing CSS for styles

const ServerHealthComponent = ({ path, name }) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate health check
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        if (loading) {
          return;
        }
        setError(null);
        setLoading(true);
        // Simulate an API call to check health based on the provided path
        const response = await fetch(`${path}/health`, { cache: "no-store" });
        const isHealthy = (await response.json()) === "Server is healthy.";
        setIsHealthy(isHealthy);
      } catch (err) {
        setError("Failed to check server health.");
      } finally {
        setLoading(false);
      }
    };

    const intervalId = setInterval(checkServerHealth, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const killServer = async () => {
    try {
      setLoading(true);
      // Simulate an API call to kill the server based on the provided path
      //
      const response = await fetch(`${path}/shutdown`, { cache: "no-store" });
      console.log(response);
    } catch (err) {
      setError("Failed to kill the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="indicator">
        <div className="name">{name}</div>
        <div
          className={`status-indicator ${isHealthy ? "healthy" : "unhealthy"}`}
        ></div>
        <button onClick={killServer} disabled={!isHealthy || loading}>
          Kill Server
        </button>
      </div>
    </div>
  );
};

ServerHealthComponent.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default ServerHealthComponent;
