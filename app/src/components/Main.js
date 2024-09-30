import React, { useState } from "react";
import mascot from "../assets/mascot.webp";

const API_REQUEST = `http://localhost:8001/payments`;

const Main = () => {
  const [url, setUrl] = useState(API_REQUEST);

  const [payload, setPayload] = useState("{}");

  const [responseFromServer, setResponseFromServer] = useState("");

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
    },
    imgHeader: {
      width: "150px",
      height: "150px",
      marginBottom: "20px",
    },
    leftSide: {
      flex: 1,
      display: "flex",
      paddingTop: "50px",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      gap: "20px",
      height: "100vh",
      width: "100vw",
    },
    rightSide: {
      flex: 1,
      display: "flex",
      paddingTop: "50px",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#ffffff",
      gap: "20px",
      height: "100vh",
      width: "100vw",
    },
    submitButton: {
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "transparent",
      color: "#333",
      border: "1px solid #333",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s, color 0.3s",
    },
  };

  // const onSubmit = async () => {
  //   console.log("submitted");
  //   const response = await fetch(API_REQUEST, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       message: "hello chat gpt",
  //     }),
  //   });
  //   console.log(await response.json());

  // }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!url || !payload) {
      alert("Please enter both a URL and a payload.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload, // Assuming payload is a valid JSON string
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setResponseFromServer(JSON.stringify(data, null, 2));
        console.log("DATA", data)
      } else {
        const errorText = await response.text();
        console.log("Err", errorText)
        setResponseFromServer(`Error: Server did not return JSON. Response: ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponseFromServer("Error fetching response: " + error.message);
    }
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
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter backend URL"
            rows={2}
            cols={40}
          />
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
          <textarea value={responseFromServer} rows={10} cols={50} readOnly />
        </div>
      </div>
    </>
  );
};

export default Main;
