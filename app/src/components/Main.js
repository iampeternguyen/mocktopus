import React, { useState } from "react";
import mascot from "../assets/mascot.webp";
import { apiEndpoints } from "../assets/apiEndpoints";
import { getService } from "../utils/getService";
import { styles } from "../assets/styles";
import { checkJsonInput } from "../assets/utils";
import ServerHealthComponent from "./ServerHealth";

const API_REQUEST = `http://localhost:8004`;

const Main = () => {
  const [endpointId, setEndpointId] = useState(0);
  const [url, setUrl] = useState("");
  const [payload, setPayload] = useState("");
  const [requestMethod, setRequestMethod] = useState("");
  const [responseFromServer, setResponseFromServer] = useState("");
  const [serverMode, setServerMode] = useState("Server is running");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      alert("Please enter both a URL and a payload.");
      return;
    }

    setLoading(true);

    try {
      const options = {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (payload && payload !== "null") {
        options.body = payload;
      }
      console.log('Payload ', payload)
      const response = await fetch(API_REQUEST + url, options);
      const contentType = response.headers.get("Content-Type");
      const mockHeader = response.headers.get("x-mocks");

      setServerMode(mockHeader ? "Running on mocks" : "Running on real server");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setResponseFromServer(JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        setResponseFromServer(
          `Error: Server did not return JSON. Response: ${errorText}`
        );
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponseFromServer("Error fetching response: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetRequest = (endpointId) => {
    const option = apiEndpoints.find((endpoint) => endpoint.id == endpointId);
    setEndpointId(endpointId);
    setUrl(getService(endpointId) + option.url);
    setRequestMethod(option.requestType);
    setPayload(JSON.stringify(option.sampleRequestBody));
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <img style={styles.imgHeader} src={mascot} alt="Mocktopus mascot" />
        <h1 style={styles.title}>Mocktopus</h1>
        <div>
          <ServerHealthComponent
            name="payments"
            path={API_REQUEST + "/payments-services"}
          />
          <ServerHealthComponent
            name="accounts"
            path={API_REQUEST + "/accounts-services"}
          />
          <ServerHealthComponent
            name="exchange"
            path={API_REQUEST + "/exchange-services"}
          />
        </div>
      </header>

      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.leftSide}>
          <h3>Send Request</h3>

          {/* Dropdown for selecting URL */}
          <label htmlFor="url-select">Select a URL:</label>
          <select
            id="url-select"
            value={endpointId}
            onChange={(e) => handleSetRequest(e.target.value)}
            style={styles.select}
          >
            <option value="0" disabled>
              Select a URL
            </option>
            {apiEndpoints.map((option, index) => (
              <option key={index} value={option.id}>
                {option.requestType} {option.url}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Request Type"
            value={requestMethod}
            onChange={(e) => setRequestMethod(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />
          <textarea
            value={checkJsonInput(payload)}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Enter Payload JSON"
            rows={10}
            style={styles.textArea}
          />
          <button style={styles.submitButton} type="submit">
            Submit
          </button>
        </form>

        <div style={styles.rightSide}>
          <h3>Response from Server</h3>
          {loading ? (
            <div style={styles.spinner} />
          ) : (
            <>
              {serverMode && <p>{serverMode}</p>}
              <textarea
                value={responseFromServer}
                rows={15}
                style={styles.textArea}
                readOnly
              />
            </>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Main;
