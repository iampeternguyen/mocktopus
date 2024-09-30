const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

require("dotenv").config({path: `${__dirname}/../../../.env`});

const app = express();

// Local API server mapping configuration based on provided ports
const apiServerMapping = {
  "/payments": `http://localhost:${process.env.PAYMENTS_API_PORT || 8001}`,  // Payments API
  "/accounts": `http://localhost:${process.env.ACCOUNTS_API_PORT || 8002}`,  // Accounts API
  "/exchange": `http://localhost:${process.env.EXCHANGE_API_PORT || 8003}`   // Exchange API
};

// Hardcoded object to return on failure
const hardcodedResponse = {
  message: "Service temporarily unavailable.",
  reference: "fixed-1234",
  timestamp: "2024-09-30T14:22:35Z",
  status: "error"
};

// Middleware to route based on API path
const proxyMiddleware = (req, res, next) => {
  const path = req.path;  // Get the requested path
  const matchedPath = Object.keys(apiServerMapping).find(apiPath => path.startsWith(apiPath));

  if (!matchedPath) {
    return res.status(404).send("No server mapping found for the requested API.");
  }

  const targetServer = apiServerMapping[matchedPath];
  console.log(`Routing to primary server: ${targetServer} for path: ${matchedPath}`);

  // Create the proxy middleware
  const proxy = createProxyMiddleware({
    target: targetServer,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error(`Error with primary server ${targetServer}:`, err.message);

      // Send hardcoded response instead of redirecting
      console.log('Returning hardcoded response:', hardcodedResponse);
      res.status(502).json(hardcodedResponse);

      // Redirect logic commented out
      /*
      if (fallbackServer) {
        console.log(`Routing to fallback server: ${fallbackServer}`);
        return res.redirect(fallbackServer);
      } else {
        res.status(502).send('Bad Gateway: All primary servers failed.');
      }
      */
    }
  });

  return proxy(req, res, next);
};

// Middleware to parse JSON requests
app.use(
  (req, res, next) => {
    console.log("middleware running");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    ); // Allow specific methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow specific headers
    next();
  },
  express.json()
);
app.use('/', proxyMiddleware);

// Start the server
const PORT = process.env.MOCK_API_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
