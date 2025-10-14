import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import '../mcp-server/server.js'; // Ensure MCP server starts
import '../data/generateVectors.js'; // Ensure vectors are generated on startup
import { connectLocalMCPServer } from '../orchestrator/mcp/client.js';
import { createChatCompletionStream } from '../orchestrator/openai/orchestrator.js';
import { HOST_PORT, HOSTNAME, APP_ENV, APP_NAME } from '../configs/global.js';
import { MAX_REQUEST_BODY_SIZE } from '../configs/request.js';

dotenv.config();
const app = express();


const server = app.listen(HOST_PORT, () => {
    console.log(`${APP_NAME}'s HTTP Server is running at http://${HOSTNAME}:${HOST_PORT}/ in ${APP_ENV} environment`);

    connectLocalMCPServer().then(() => {
        console.log("MCP Client connected to MCP Server.");
    }).catch(error => {
        console.error("Failed to connect MCP Client to MCP Server:");
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    server.close(() => {
        process.exit(0);
    });  
});

app.use(cors());
app.use(express.json({ limit: MAX_REQUEST_BODY_SIZE }));
app.use(express.raw({ limit: MAX_REQUEST_BODY_SIZE }));
app.use(express.text({ limit: MAX_REQUEST_BODY_SIZE, type: ['text/plain', 'application/xml'] }));
app.use(express.urlencoded({ limit: MAX_REQUEST_BODY_SIZE, extended: true }));

app.use(helmet());

app.use('/api/chatbot/ask', async (req, res) => {
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