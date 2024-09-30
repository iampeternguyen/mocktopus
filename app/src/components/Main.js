import React, { useState } from "react";
import mascot from "../assets/mascot.webp";
import { apiEndpoints } from "../assets/apiEndpoints";
import { styles } from "../assets/styles";
const API_REQUEST = `http://localhost:8999`;

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
      const response = await fetch(API_REQUEST + url, options);

      const contentType = response.headers.get("Content-Type");

      const mockHeader = response.headers.get("x-mocks");

      if (mockHeader) {
        setServerMode("Running on mocks");
      } else {
        setServerMode("Running on real server");
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setResponseFromServer(JSON.stringify(data, null, 2));
        console.log("DATA", data);
        setLoading(false);
      } else {
        const errorText = await response.text();
        console.log("Err", errorText);
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
    setUrl(option.url);
    setRequestMethod(option.requestType);
    setPayload(JSON.stringify(option.sampleRequestBody));
  };

  return (
    <>
      <header>
        <h1> Mocktopus </h1>
        <img style={styles.imgHeader} src={mascot} alt="Moctopus mascot" />
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
            placeholder="request type"
            value={requestMethod}
            onChange={(e) => setRequestMethod(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          ></input>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Enter payload JSON"
            rows={5}
            cols={40}
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
              <textarea value={responseFromServer} rows={15} cols={50} readOnly />
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
    </>
  );
};

export default Main;
