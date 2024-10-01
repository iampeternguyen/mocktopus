const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const SwaggerParser = require("swagger-parser");
const YAML = require("yamljs");
const path = require("path");
const { OpenAI } = require("openai");
const stringSimilarity = require("string-similarity"); // For path similarity matching

require("dotenv").config({ path: `${__dirname}/../../../.env` });

const swaggerDir = `${__dirname}/swagger`;
const app = express();
app.use(bodyParser.json());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you set your API key in environment variables
});

// External service URL (replace with the actual URL)
const servicesConfig = {
  "/accounts-service": {
    url: "http://localhost:8002", // URL for service 1
    healthURL: "http://localhost:8002/health",
    isHealthy: true,
  },
  "/payments-service": {
    url: "http://localhost:8001", // URL for service 2
    healthURL: "http://localhost:8001/health",
    isHealthy: true,
  },
};
const chatGptAPIUrl = "https://api.openai.com/v1/chat/completions"; // Replace with actual ChatGPT API endpoint
const chatGptApiKey = process.env.OPENAI_API_KEY; // Replace with your ChatGPT API key

// File to log requests and responses
const logFilePath = "request_response_log.json";
const logFileData = fs.readFileSync(logFilePath, "utf-8");
let requestResponseLog = JSON.parse(logFileData != "" ? logFileData : "[]");

// Function to log requests and responses
function logRequestResponse(url, method, reqBody, responseBody, isError) {
  if (url.includes("health")) {
    return;
  }
  const logEntry = {
    url: url,
    method: method,
    request: reqBody,
    response: responseBody,
    isError: isError,
    timestamp: new Date().toISOString(),
  };
  requestResponseLog.push(logEntry);
  fs.writeFileSync(logFilePath, JSON.stringify(requestResponseLog, null, 2)); // Append to log file
}

// Function to call the external service
async function callExternalService(url, method, reqBody, headers) {
  try {
    const options = {
      method,
      url,
      data: reqBody,
      headers,
    };
    const response = await axios(options);
    response.data;
    return response; // Return the real response
  } catch (error) {
    console.error("Received error for ", url, method);
    const errorResponse = error.response?.data || {
      error: "Unknown error",
      status: error.response?.status || 500,
    };

    const statusCode = error.response?.status;
    // Learn only from 4XX errors
    if (statusCode >= 400 && statusCode < 500) {
      console.log(`Learning 4XX error response for route ${url}`);
      logRequestResponse(url, method, reqBody, errorResponse, true);
    }

    return { error: true, response: errorResponse, status: statusCode };
  }
}

// Function to get a response from ChatGPT based on the monitored data
async function getChatGptResponse(url, method, logData) {
  if (!url || !method) {
    return null;
  }
  try {
    const response = await axios.post(
      chatGptAPIUrl,
      {
        model: "gpt-3.5-turbo", // or whichever model you're using
        messages: [
          {
            role: "user",
            content: `Based on the ${url} and method ${method}, generate a relevant response: ${JSON.stringify(
              logData
            )} in json format without newline characters. if matching response doesnt exist then search matching json schema and generate response with newline characters`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${chatGptApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);

    console.log(response.data.choices[0].message.content);
    return JSON.parse(response.data.choices[0].message.content); // Extract the content from the response
  } catch (error) {
    console.error("Error getting response from ChatGPT:", error.message);
    return null; // Return null if the API call fails
  }
}
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Allow specific methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow specific headers
  next();
}, express.json());
// Middleware to handle requests
app.use(async (req, res, next) => {
  // Log the incoming request
  const servicePath = Object.keys(servicesConfig).find((path) =>
    req.path.startsWith(path)
  );

  if (!servicePath) {
    console.log("Request received in api gateway ", req.path, req.method);
    if (req.method === "OPTIONS") {
      console.log("Doing preflight response");
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      ); // Allow specific methods
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.status(200);
      res.send("Done");
      return;
    }
    var serviceUrlWithPath = req.path.split("/")[2];

    var respondData = await handleRequest(serviceUrlWithPath, req.method);
    console.log("Response from swagger ", respondData);
    if (respondData) {
      console.log("Response found");
      return res.status(200).json(respondData);
    }
    console.log("Sending 404");
    return res.status(404).json("{}");
  }

  const service = servicesConfig[servicePath];

  if (service.isHealthy) {
    // Log the incoming request
    var serviceUrlWithPath = `${service.url}/${req.path.split("/")[2]}`;

    // Call the external service
    const externalResponse = await callExternalService(
      serviceUrlWithPath,
      req.method,
      req.body,
      req.headers
    );

    if (externalResponse.status >= 200 && externalResponse.status < 400) {
      // Log the request and response

      logRequestResponse(req.path, req.method, req.body, externalResponse.data);

      // Send the response back to the client
      if (externalResponse.headers) {
        Object.keys(externalResponse.headers).forEach((header) => {
          res.setHeader(header, externalResponse.headers[header]);
        });
      }
      return res.status(externalResponse.status).json(externalResponse.data);
    } else if (
      externalResponse.status >= 400 &&
      externalResponse.status < 500
    ) {
      return res
        .status(externalResponse.status)
        .json(externalResponse.errorResponse);
    } else {
      // If the external service fails, switch to ChatGPT response
      console.log(
        "External service is down. Switching to ChatGPT for response."
      );

      service.isHealthy = false;
      // Use the log data for ChatGPT to generate a response
      const aiResponse = await getChatGptResponse(
        serviceUrlWithPath,
        req.method,
        requestResponseLog
      );

      if (aiResponse) {
        return res.status(200).json({ response: aiResponse });
      } else {
        return res
          .status(500)
          .json({ error: "Unable to generate response from ChatGPT." });
      }
    }
  } else {
    const aiResponse = await getChatGptResponse(
      serviceUrlWithPath,
      req.method,
      requestResponseLog
    );

    if (aiResponse) {
      res.setHeader("x-mocks", "true");
      return res.status(200).json({ response: aiResponse });
    } else {
      return res
        .status(500)
        .json({ error: "Unable to generate response from ChatGPT." });
    }
  }
});

async function monitorExternalService(serviceKey) {
  const service = servicesConfig[serviceKey];
  try {
    await axios.get(service.healthURL); // Simple health check for the external service
    console.log(`Service ${serviceKey} is UP.`);
    service.isHealthy = true; // Mark service as healthy
  } catch (error) {
    console.log(`Service ${serviceKey} is DOWN.`);
    service.isHealthy = false; // Mark service as unhealthy
  }
}
async function monitorAllServices() {
  setInterval(async () => {
    for (const serviceKey in servicesConfig) {
      if (!servicesConfig[serviceKey].isHealthy)
        await monitorExternalService(serviceKey);
    }
  }, 10000); // Check every 10 seconds
}
monitorAllServices();

// Function to load and parse a single Swagger file (JSON or YAML)
async function loadSwaggerFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const isYaml = filePath.endsWith(".yaml") || filePath.endsWith(".yml");
  return isYaml ? YAML.parse(fileContent) : JSON.parse(fileContent);
}

// Function to load all Swagger files in a directory
async function loadAllSwaggerFiles(directory) {
  const files = fs.readdirSync(directory);
  const swaggerFiles = files.filter(
    (file) =>
      file.endsWith(".yml") || file.endsWith(".yaml") || file.endsWith(".json")
  );

  const swaggerDocs = [];
  for (const file of swaggerFiles) {
    const fullPath = path.join(directory, file);
    const swaggerDoc = await loadSwaggerFile(fullPath);
    swaggerDocs.push(swaggerDoc);
  }

  return swaggerDocs;
}

// Function to find the matching path and method across all Swagger files
function findPathAndMethodInAll(swaggerDocs, requestedPath, method) {
  const lowerCaseMethod = method.toLowerCase();
  let bestMatch = null;
  let highestSimilarity = 0;

  for (const swagger of swaggerDocs) {
    const paths = swagger.paths;

    // Compare the requested path with each path in the Swagger file using string similarity
    for (const swaggerPath in paths) {
      const similarity = stringSimilarity.compareTwoStrings(
        requestedPath,
        swaggerPath
      );

      // Check if the similarity is higher than the previous best match
      if (similarity > highestSimilarity) {
        const methods = paths[swaggerPath];
        if (methods && methods[lowerCaseMethod]) {
          bestMatch = {
            swagger,
            path: swaggerPath,
            method: lowerCaseMethod,
            operation: methods[lowerCaseMethod],
          };
          highestSimilarity = similarity;
        }
      }
    }
  }

  return bestMatch; // Return the best match with the highest similarity
}

// Function to extract schema for a given path and method
function extractSchema(operation) {
  if (!operation.responses) {
    console.log("No responses found for the operation");
    return null;
  }

  const response = operation.responses["200"] || operation.responses.default;
  if (!response || !response.content || !response.content["application/json"]) {
    console.log("No JSON schema found in the response");
    return null;
  }

  return response.content["application/json"].schema;
}

// Function to call ChatGPT and generate response based on schema
async function generateChatGPTResponse(schema) {
  const prompt = `Generate a JSON response based on the following schema:\n\n${JSON.stringify(
    schema,
    null,
    2
  )}`;

  try {
    const response = await axios.post(
      chatGptAPIUrl,
      {
        model: "gpt-3.5-turbo", // or whichever model you're using
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that generates JSON responses based on provided schemas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${chatGptApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content); // Parse and return the generated JSON response
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    return null;
  }
}

async function handleRequest(requestedPath, method) {
  try {
    // Load all Swagger files into memory
    const swaggerDocs = await loadAllSwaggerFiles(swaggerDir);
    console.log(`Loaded ${swaggerDocs.length} Swagger files`);

    // Find the matching path and method
    const matchedOperation = findPathAndMethodInAll(
      swaggerDocs,
      requestedPath,
      method
    );

    if (!matchedOperation) {
      console.log("No matching path or method found in any Swagger file.");
      return null;
    }

    console.log(`Matched Path: ${matchedOperation.path}`);
    console.log(`Matched Method: ${matchedOperation.method}`);

    // Extract the schema from the matched operation
    const schema = extractSchema(matchedOperation.operation);
    if (schema) {
      console.log("Extracted Schema:", JSON.stringify(schema, null, 2));

      // Call ChatGPT to generate a response based on the schema
      const aiResponse = await generateChatGPTResponse(schema);
      console.log(
        "Generated AI Response:",
        JSON.stringify(aiResponse, null, 2)
      );
      return aiResponse;
    } else {
      console.log("No schema found for the matched path and method.");
      return null;
    }
  } catch (err) {
    console.error("Error processing Swagger files:", err);
  }
}
// Start the API gateway server
const PORT = process.env.GATEWAY_API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
