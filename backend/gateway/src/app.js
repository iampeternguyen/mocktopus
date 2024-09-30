const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config({ path: `${__dirname}/../../../.env` });

const app = express();

// Local API server mapping configuration based on provided ports
const apiServerMapping = {
  "/payments": `http://localhost:${process.env.PAYMENTS_API_PORT || 8001}`, // Payments API
  "/accounts": `http://localhost:${process.env.ACCOUNTS_API_PORT || 8002}`, // Accounts API
  "/exchange": `http://localhost:${process.env.EXCHANGE_API_PORT || 8003}`, // Exchange API
};

const fallbackServer = process.env.MOCK_API_PORT || 'http://localhost:9000'; // Example fallback server

// Hardcoded object to return on failure
const hardcodedResponse = {
  message: "Service temporarily unavailable.",
  reference: "fixed-1234",
  timestamp: "2024-09-30T14:22:35Z",
  status: "error",
};

// Middleware to route based on API path
const proxyMiddleware = (req, res, next) => {
  const path = req.path; // Get the requested path
  const matchedPath = Object.keys(apiServerMapping).find((apiPath) =>
    path.startsWith(apiPath)
  );

  if (!matchedPath) {
    return res
      .status(404)
      .send("No server mapping found for the requested API.");
  }

  const targetServer = apiServerMapping[matchedPath];
  console.log(
    `Routing to primary server: ${targetServer} for path: ${matchedPath}`
  );

  // Create the proxy middleware
  const proxy = createProxyMiddleware({
    target: targetServer,
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      // If the status code is an error (4xx or 5xx)
      if (proxyRes.statusCode >= 400) {
        console.error(
          `Error with primary server ${targetServer}:`,
          proxyRes.statusCode
        );

        if (fallbackServer) {
          console.log(`Routing to fallback server: ${fallbackServer}`);
          return res.redirect(fallbackServer);
        } else {
          res.status(502).send("Bad Gateway: All primary servers failed.");
        }
      }
    },
    onError: (err, req, res) => {
      console.error(
        `Network error with primary server ${targetServer}:`,
        err.message
      );
      return res.status(502).json(hardcodedResponse);
    },
  });

  return proxy(req, res, next);
};

// Apply proxy middleware for all routes
app.use("/", proxyMiddleware);

// Start the server
const PORT = process.env.GATEWAY_API_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
