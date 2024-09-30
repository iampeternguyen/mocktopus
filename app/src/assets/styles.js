export const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column", // Stack header and container vertically
    height: "100vh", // Full viewport height
    width: "100vw",
    background: "linear-gradient(to right, #e0eafc, #cfdef3)", // Soft gradient background
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Light shadow for depth
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center", // Change to space-between for better layout
    alignItems: "stretch", // Stretch to fill the height
    padding: "20px", // Add padding for inner spacing
    background: "linear-gradient(to right, #e0eafc, #cfdef3)", // Soft gradient background
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Light shadow for depth
  },
  imgHeader: {
    width: "150px",
    height: "150px",
    marginBottom: "20px",
    borderRadius: "50%", // Circular image for a modern look
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)", // Soft shadow
  },
  leftSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // Align items to the top
    backgroundColor: "#f9f9f9", // Slightly darker background for contrast
    gap: "10px",
    borderRadius: "10px", // Rounded corners for modern appeal
    padding: "20px", // Padding for inner spacing
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
    marginRight: "20px",
  },
  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // Align items to the top
    backgroundColor: "#ffffff",
    gap: "10px",
    borderRadius: "10px", // Rounded corners for modern appeal
    padding: "20px", // Padding for inner spacing
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  },
  submitButton: {
    padding: "12px 24px", // Slightly larger padding for buttons
    fontSize: "16px",
    backgroundColor: "#61dafb", // Primary button color
    color: "#fff", // White text for contrast
    border: "none", // No border for a cleaner look
    borderRadius: "5px", // Rounded corners for buttons
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s", // Smooth transition for background and scale
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for buttons
  },
  submitButtonHover: {
    backgroundColor: "#21a1f1", // Darker shade on hover
    transform: "scale(1.05)", // Scale effect on hover for depth
  },
  spinner: {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #FF6200",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "20px auto",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Shadow for spinner
  },
  header: {
    backgroundColor: "#282c34", // Dark background for contrast
    padding: "20px 40px", // Padding around the header
    display: "flex", // Use flexbox for alignment
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Shadow for depth
  },
  title: {
    fontSize: "3em", // Larger font size for the title
    color: "#ffffff", // White text color
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
    margin: "0 0 0 20px", // No margin on top/bottom, some margin on the left
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // Fun font family
  },
  imgHeader: {
    width: "100px", // Adjusted width for better fit
    height: "100px", // Adjusted height for better fit
    borderRadius: "50%", // Circular image for modern look
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for the mascot
    transition: "transform 0.3s", // Transition effect for hover
  },
  select: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    fontSize: "14px",
    transition: "border-color 0.2s",
    outline: "none",
    boxSizing: "border-box", // Ensures padding and border are included in width
    display: "block", // Ensure consistent display
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box", // Ensures padding and border are included in width
    display: "block", // Ensure consistent display
    "&:focus": {
      borderColor: "#007bff",
    },
  },
  textArea: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    fontSize: "14px",
    resize: "none",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box", // Ensures padding and border are included in width
    display: "block", // Ensure consistent display
    "&:focus": {
      borderColor: "#007bff",
    },
  },

  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 16px", // Reduced padding
    borderRadius: "4px", // Slightly smaller border radius
    border: "none",
    cursor: "pointer",
    fontSize: "14px", // Reduced font size
    transition: "background-color 0.3s",
  },
  spinner: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    width: "24px", // Reduced size
    height: "24px", // Reduced size
    animation: "spin 1s linear infinite",
  },
};
