const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config({path: `${__dirname}/../../../.env`});

const app = express();
app.use(bodyParser.json());

// External service URL (replace with the actual URL)
const servicesConfig = {
  '/accounts-service': {
      url: 'http://localhost:8002', // URL for service 1
  },
  '/payments-service': {
      url: 'http://localhost:8001', // URL for service 2
  },
  '/exchange-service': {
      url: 'http://localhost:8003', // URL for service 3
  },
};
const chatGptAPIUrl = 'https://api.openai.com/v1/chat/completions'; // Replace with actual ChatGPT API endpoint
const chatGptApiKey = process.env.OPENAI_API_KEY; // Replace with your ChatGPT API key

// File to log requests and responses
const logFilePath = 'request_response_log.json';
let requestResponseLog = [];

// Function to log requests and responses
function logRequestResponse(url,method, reqBody, responseBody) {
    const logEntry = {
        url: url,
        method: method,
        request: reqBody,
        response: responseBody,
        timestamp: new Date().toISOString(),
    };
    requestResponseLog.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(requestResponseLog, null, 2)); // Append to log file
}

// Function to call the external service
async function callExternalService(url, method, reqBody) {
    try {
        console.log(method, url, reqBody)
        const response = await axios({method,url, body:reqBody});
        return response.data; // Return the real response
    } catch (error) {
        console.error('Error calling external service:', error.message);
        return null; // Return null to indicate failure
    }
}

// Function to get a response from ChatGPT based on the monitored data
async function getChatGptResponse(logData) {
    try {
        const response = await axios.post(chatGptAPIUrl, {
            model: "gpt-3.5-turbo", // or whichever model you're using
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Based on the following request and responses, generate a relevant response: ${JSON.stringify(logData)}` }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${chatGptApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content; // Extract the content from the response
    } catch (error) {
        console.error('Error getting response from ChatGPT:', error.message);
        return null; // Return null if the API call fails
    }
}

// Middleware to handle requests
app.use(async (req, res) => {
    // Log the incoming request
    const servicePath = Object.keys(servicesConfig).find(path => req.path.startsWith(path));

    if (!servicePath) {
        return res.status(404).json({ error: 'Service not found' });
    }

    const serviceURL = servicesConfig[servicePath].url;

    // Log the incoming request
    var serviceUrlWithPath = `${serviceURL}/${req.path.split('/')[2]}`
    // Call the external service
    const externalResponse = await callExternalService(serviceUrlWithPath,req.method, req.body);

    if (externalResponse) {
        console.log(externalResponse)
        // Log the request and response
        logRequestResponse(req.path, req.method,req.body, externalResponse);

        // Send the response back to the client
        return res.status(200).json(externalResponse);
    } else {
        // If the external service fails, switch to ChatGPT response
        console.log('External service is down. Switching to ChatGPT for response.');

        // Use the log data for ChatGPT to generate a response
        const aiResponse = await getChatGptResponse(requestResponseLog);
        
        if (aiResponse) {
            return res.status(200).json({ response: aiResponse });
        } else {
            return res.status(500).json({ error: 'Unable to generate response from ChatGPT.' });
        }
    }
});
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
// Start the API gateway server
const PORT = process.env.GATEWAY_API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
