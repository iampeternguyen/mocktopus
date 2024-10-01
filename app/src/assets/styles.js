export const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column", // Stack header and container vertically
    height: "100vh", // Full viewport height
    width: "100vw",
    background: "#D1D1D1", // Light gray background
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Light shadow for depth
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center", // Change to space-between for better layout
    alignItems: "stretch", // Stretch to fill the height
    padding: "20px", // Add padding for inner spacing
  },
  imgHeader: {
    width: "150px",
    height: "150px",
    marginBottom: "20px",
    borderRadius: "50%", // Circular image for a modern look
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)", // Soft shadow
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyItems: "center",
    backgroundColor: "#f9f9f9", // Slightly darker background for contrast
    gap: "10px",
    borderRadius: "10px", // Rounded corners for modern appeal
    padding: "20px", // Padding for inner spacing
    margin: "20px",
    marginBottom: "0px"
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
    backgroundColor: "#FF6200", // Dark background for contrast
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
    backgroundColor: "#FF6200", // Orange color for the button
    color: "#fff",
    padding: "8px 16px", // Reduced padding
    borderRadius: "4px", // Slightly smaller border radius
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    transition: "background-color 0.3s",
  },
  // spinner: {
  //   border: "4px solid rgba(0, 0, 0, 0.1)",
  //   borderTop: "4px solid #007bff",
  //   borderRadius: "50%",
  //   width: "24px", // Reduced size
  //   height: "24px", // Reduced size
  //   animation: "spin 1s linear infinite",
  // },
};
