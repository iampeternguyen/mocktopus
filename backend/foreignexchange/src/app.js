// app.js

const express = require('express');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config({path: `${__dirname}/../../../.env`});


const app = express();
const PORT = process.env.EXCHANGE_API_PORT || 3000;

const swaggerFile = fs.readFileSync('src/exchange.yml', 'utf-8');

// Middleware to parse JSON requests
app.use(
  (req, res, next) => {
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

// ChatGPT endpoint
app.all('/*', async (req, res) => {
  const { method, body } = req;
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [{ role: 'user', content: "can you provide a response for "+method+ " for endpoint "+req.url+" with payload "+JSON.stringify(body)+ " based on open api specification "+swaggerFile+" without new line characters" }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const chatResponse = response.data.choices[0].message.content;
    console.log(chatResponse);
    res.json({ response: JSON.parse(chatResponse) });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Foreign exchange API server is running on port ${PORT}`);
});

// Endpoint to stop the server
app.get('/shutdown', (req, res) => {
  if (server) {
    res.send('Server is shutting down...');
    server.close(() => {
      console.log('Server has been shut down.');
      setTimeout(() => server.listen(PORT, () => {
        console.log('server is restarting')
      }), 10000)
    });
  } else { 
    res.send('Server is not running.');
  }
});

// Optionally add a health check endpoint
app.get('/health', (req, res) => {
  res.send('Server is healthy.');
});