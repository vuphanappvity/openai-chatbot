import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import '../mcp-server/server.js'; // Ensure MCP server starts
import '../data/generateVectors.js'; // Ensure vectors are generated on startup
import { connectLocalMCPServer } from '../orchestrator/mcp/client.js';
import { createChatCompletionStream } from '../orchestrator/openai/orchestrator.js';
import { HOST_PORT, HOSTNAME, APP_ENV, APP_NAME, HTTPS_PORT, ENABLE_HTTPS } from '../configs/global.js';
import { MAX_REQUEST_BODY_SIZE } from '../configs/request.js';

dotenv.config();
const app = express();

// Configure middleware before starting server
app.use(cors());
app.use(express.json({ limit: MAX_REQUEST_BODY_SIZE }));
app.use(express.raw({ limit: MAX_REQUEST_BODY_SIZE }));
app.use(express.text({ limit: MAX_REQUEST_BODY_SIZE, type: ['text/plain', 'application/xml'] }));
app.use(express.urlencoded({ limit: MAX_REQUEST_BODY_SIZE, extended: true }));
app.use(helmet());


app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.post('/api/chatbot/ask', async (req, res) => {
    const { prompt, options } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Set headers for Server-Sent Events
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const stream = createChatCompletionStream(prompt, options);


        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }
        // Send completion signal
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch (error) {
        console.error('Error in streaming endpoint:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
        res.end();
    }
});

// Server startup logic based on ENABLE_HTTPS flag
let httpServer = null;
let httpsServer = null;

if (ENABLE_HTTPS) {
    // Production mode - HTTPS only
    console.log('Starting in HTTPS mode (Production)...');
    try {
        const options = {
            key: fs.readFileSync('./certs/server.key'),
            cert: fs.readFileSync('./certs/server.crt'),
            ca: fs.readFileSync('./certs/ca.crt'),
            requestCert: true,
            rejectUnauthorized: true
        };

        httpsServer = https.createServer(options, app).listen(HTTPS_PORT, () => {
            console.log(`${APP_NAME}'s HTTPS Server is running at https://${HOSTNAME}:${HTTPS_PORT}/ in ${APP_ENV} environment`);
            console.log(`Access: https://${HOSTNAME}:${HTTPS_PORT}/ping`);
        });
    } catch (error) {
        console.error('Error starting HTTPS server:', error);
        console.log('Make sure SSL certificates exist in ./certs/ directory');
        process.exit(1);
    }
} else {
    // Development mode - HTTP only
    console.log('Starting in HTTP mode (Development)...');
    httpServer = app.listen(HOST_PORT, () => {
        console.log(`${APP_NAME}'s HTTP Server is running at http://${HOSTNAME}:${HOST_PORT}/ in ${APP_ENV} environment`);
        console.log(`Access: http://${HOSTNAME}:${HOST_PORT}/ping`);
    });
}

// Initialize MCP connection
connectLocalMCPServer().then(() => {
    console.log("MCP Client connected to MCP Server.");
}).catch(error => {
    console.error("Failed to connect MCP Client to MCP Server:", error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');

    const closeServer = (server, name) => {
        return new Promise((resolve) => {
            if (server) {
                server.close(() => {
                    console.log(`${name} server closed.`);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    };

    Promise.all([
        closeServer(httpServer, 'HTTP'),
        closeServer(httpsServer, 'HTTPS')
    ]).then(() => {
        console.log('All servers closed.');
        process.exit(0);
    });
});