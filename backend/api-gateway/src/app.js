const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const jsonSchemaGenerator = require('json-schema-generator');
require('dotenv').config({ path: `${__dirname}/../../../.env` });

const app = express();
app.use(bodyParser.json());

// External service URL (replace with the actual URL)
const servicesConfig = {
    '/accounts-service': {
        url: 'http://localhost:8002', // URL for service 1
        healthURL: 'http://localhost:8002/health',
        isHealthy: true
    },
    '/payments-service': {
        url: 'http://localhost:8001', // URL for service 2
        healthURL: 'http://localhost:8001/health',
        isHealthy: true
    },
    '/exchange-service': {
        url: 'http://localhost:8003', // URL for service 3
        healthURL: 'http://localhost:8003/health',
        isHealthy: true
    },
};
const chatGptAPIUrl = 'https://api.openai.com/v1/chat/completions'; // Replace with actual ChatGPT API endpoint
const chatGptApiKey = process.env.OPENAI_API_KEY; // Replace with your ChatGPT API key


// File to log requests and responses
const logFilePath = 'request_response_log.json';
const logFileData = fs.readFileSync(logFilePath, 'utf-8');
let requestResponseLog = JSON.parse(logFileData != "" ? logFileData : "[]");

// Function to log requests and responses
function logRequestResponse(url, method, reqBody, responseBody, isError) {
    const jsonSchema = jsonSchemaGenerator(responseBody);
    const logEntry = {
        url: url,
        method: method,
        request: reqBody,
        response: responseBody,
        isError: isError,
        schema: jsonSchema,
        timestamp: new Date().toISOString(),
    };
    requestResponseLog.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(requestResponseLog, null, 2)); // Append to log file
}

// Function to call the external service
async function callExternalService(url, method, reqBody, headers) {
    try {
        console.log('Request body is ', reqBody);
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
        console.error('Received error for ',url, method)
        const errorResponse = error.response?.data || {
            error: 'Unknown error',
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
    try {
        const response = await axios.post(chatGptAPIUrl, {
            model: "gpt-3.5-turbo", // or whichever model you're using
            messages: [
                { role: "user", content: `Based on the ${url} and method ${method}, generate a relevant response: ${JSON.stringify(logData)} in json format without newline characters. if matching response doesnt exist then search matching json schema and generate response with newline characters` }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${chatGptApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return JSON.parse(response.data.choices[0].message.content); // Extract the content from the response
    } catch (error) {
        console.error('Error getting response from ChatGPT:', error.message);
        return null; // Return null if the API call fails
    }
}
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
// Middleware to handle requests
app.use(async (req, res) => {


    // Log the incoming request
    const servicePath = Object.keys(servicesConfig).find(path => req.path.startsWith(path));

    if (!servicePath) {
        return res.status(404).json({ error: 'Service not found' });
    }

    const service = servicesConfig[servicePath];
    console.info('Request ', req.url, req.method, req.body)

    if (service.isHealthy) {
        // Log the incoming request
        var serviceUrlWithPath = `${service.url}/${req.path.split('/')[2]}`

        // Call the external service
        const externalResponse = await callExternalService(serviceUrlWithPath, req.method, req.body, req.headers);
        console.log('Response received for request ', req.url,req.method, externalResponse.data)

        if (externalResponse.status >= 200 && externalResponse.status < 400) {

            // Log the request and response

            logRequestResponse(req.path, req.method, req.body, externalResponse.data);

            // Send the response back to the client
            Object.keys(externalResponse.headers).forEach((header) => {
                res.setHeader(header, externalResponse.headers[header]);
              });
            return res.status(externalResponse.status).json(externalResponse.data);
        } else if (externalResponse.status >= 400 && externalResponse.status < 500) {
            return res.status(externalResponse.status).json(externalResponse.errorResponse)
        } else {
            // If the external service fails, switch to ChatGPT response
            console.log('External service is down. Switching to ChatGPT for response.');

            service.isHealthy = false;
            // Use the log data for ChatGPT to generate a response
            const aiResponse = await getChatGptResponse(serviceUrlWithPath, req.method, requestResponseLog);

            if (aiResponse) {
                return res.status(200).json({ response: aiResponse });
            } else {
                return res.status(500).json({ error: 'Unable to generate response from ChatGPT.' });
            }
        }
    } else {
        const aiResponse = await getChatGptResponse(serviceUrlWithPath, req.method, requestResponseLog);

        if (aiResponse) {
            res.setHeader('x-mocks', 'true')
            return res.status(200).json({ response: aiResponse });
        } else {
            return res.status(500).json({ error: 'Unable to generate response from ChatGPT.' });
        }
    }
});

async function monitorExternalService(serviceKey) {
    const service = servicesConfig[serviceKey];
    try {
        await axios.get(service.healthURL);  // Simple health check for the external service
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
// Start the API gateway server
const PORT = process.env.GATEWAY_API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
