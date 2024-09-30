
export const styles = {
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
    spinner: {
        border: "8px solid #f3f3f3",
        borderTop: "8px solid #FF6200",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        animation: "spin 1s linear infinite",
        margin: "20px auto",
    },
};
