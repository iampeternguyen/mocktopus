import React, { useState } from "react";
import mascot from "../assets/mascot.webp";
import JSONTextArea from "./JsonInput";

const API_REQUEST = `http://localhost:8001/payments`;

const Main = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
    },
    side: (isActive) => ({
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isActive ? "#000" : "#ccc",
      color: "#fff",
      fontSize: "2rem",
      height: "100%",
      transition: "background-color 0.5s ease",
    }),
    switchContainer: {
      display: "flex",
      justifyContent: "center",
      margin: "20px",
    },
    switch: {
      position: "relative",
      display: "inline-block",
      width: "40px",
      height: "20px",
    },
    input: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    imgHeader: {
      width: "150px",
      height: "150px",
    },
    slider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isOn ? "#2196F3" : "#ccc",
      transition: "0.4s",
      borderRadius: "20px",
    },
    sliderBefore: {
      position: "absolute",
      content: '""',
      height: "16px",
      width: "16px",
      left: isOn ? "20px" : "2px",
      bottom: "2px",
      backgroundColor: "white",
      transition: "0.4s",
      borderRadius: "50%",
    },
  };

  const onSubmit = async () => {
    console.log("submitted");
    const response = await fetch(API_REQUEST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "hello chat gpt",
      }),
    });
    console.log(await response.json());
  };

  return (
    <>
      <h1>Mocktopus</h1>
      <img style={styles.imgHeader} src={mascot} alt="Moctopus mascot" />
      <div style={styles.switchContainer}>
        <label style={styles.switch}>
          <input
            type="checkbox"
            style={styles.input}
            checked={isOn}
            onChange={toggleSwitch}
          />
          <span style={styles.slider}>
            <span style={styles.sliderBefore}></span>
          </span>
        </label>
      </div>
      <div style={styles.container}>
        <div style={styles.side(!isOn)}>
          <JSONTextArea />
          <button type="submit" onClick={onSubmit}>
            submit{" "}
          </button>
        </div>
        <div style={styles.side(isOn)}>Generated AI Mock Server</div>
      </div>
    </>
  );
};

export default Main;
