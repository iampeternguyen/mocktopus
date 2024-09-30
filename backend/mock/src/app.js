require('dotenv').config();
const express = require('express');
const swaggerParser = require('swagger-parser');
const { OpenAI } = require('openai'); // Correct imports
const fs = require('fs');
const path = require('path');
const { console } = require('inspector');

const app = express();
app.use(express.json());

require("dotenv").config({path: `${__dirname}/../../../.env`});

const PORT = process.env.MOCK_API_PORT || 9000;

// OpenAI API setup - correctly instantiate Configuration and OpenAIApi
const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY,
});

// Load Swagger files (Assuming they are in a `swagger` folder)
const swaggerFiles = {
  payments: path.join(__dirname, '../../swagger/payments.yml'),
  accounts: path.join(__dirname, '../../swagger/accounts.yml'),
  exchange: path.join(__dirname, '../../swagger/exchange.yml'),
};

// Helper function to load and parse Swagger files
async function loadSwagger(api) {
  try {
    const apiPath = swaggerFiles[api];
    if (!apiPath) throw new Error(`No Swagger file found for API: ${api}`);
    return await swaggerParser.dereference(apiPath);
  } catch (error) {
    console.error(`Error loading Swagger for ${api}:`, error.message);
    return null;
  }
}

// Find the corresponding endpoint specification in the Swagger file
function findEndpointSpec(swaggerDoc, req) {
  const { method, path } = req;
  const paths = swaggerDoc.paths;

  for (const swaggerPath in paths) {
    if (path === swaggerPath || path.startsWith(swaggerPath)) {
      const endpoint = paths[swaggerPath][method.toLowerCase()];
      if (endpoint) {
        return endpoint;
      }
    }
  }
  return null;
}

// Generate a mock response using OpenAI
async function generateMockResponse(endpoint) {
  const prompt = `Generate a mock JSON response for an API endpoint with the following schema: ${JSON.stringify(endpoint.responses['200'].content['application/json'].schema, null, 2)}`;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Ensure this model is available to your API key
      prompt: prompt,
      max_tokens: 150,
    });
    
    console.log("response");
    console.log(response);
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating mock response:', error.message);
    return { error: 'Unable to generate mock response' };
  }
}

// Main route handler for all APIs
app.all('/:api/*', async (req, res) => {
  const api = req.params.api; // Extract the API name (payments, accounts, exchange)
  const method = req.method.toLowerCase(); // GET, POST, etc.
  const path = req.path.replace(`/${api}`, ''); // Extract the specific endpoint path

  // Load Swagger for the API
  const swaggerDoc = await loadSwagger(api);
  if (!swaggerDoc) {
    return res.status(500).json({ error: `Failed to load Swagger for ${api}` });
  }

  // Find the endpoint specification in the Swagger file
  const endpointSpec = findEndpointSpec(swaggerDoc, { method, path });
  if (!endpointSpec) {
    return res.status(404).json({ error: `Endpoint ${path} not found for ${api} API` });
  }

  console.log('hahaha');

  // Generate a mock response using OpenAI
  const mockResponse = await generateMockResponse(endpointSpec);

  // Send back the generated response
  res.status(200).json(JSON.parse(mockResponse));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server is running on port ${PORT}`);
});
