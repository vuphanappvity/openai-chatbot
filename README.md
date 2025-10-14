# OpenAI Chatbot - Developer Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [MCP Server](#mcp-server)
- [Vector Store & Embeddings](#vector-store--embeddings)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

This is an intelligent chatbot service built with OpenAI's GPT models, integrated with Model Context Protocol (MCP) for extended tool capabilities and ChromaDB for vector-based knowledge management. The system provides a streaming API for real-time conversational AI with context-aware responses.

### Key Features
- **Streaming Responses**: Server-Sent Events (SSE) for real-time response streaming
- **MCP Integration**: Extensible tool system using Model Context Protocol
- **Vector Knowledge Base**: ChromaDB integration for semantic search and RAG
- **Intelligent Orchestration**: Prompt analysis and automatic tool selection
- **Workspace-Aware**: Multi-tenant support with workspace and user context

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Express Server                       │
│                    (HTTP API Endpoint)                      │
└───────────────────────────────┬─────────────────────────────┘
                                │
                    ┌───────────┴───────────────┐
                    │                           │
                    ▼                           ▼
            ┌──────────────────┐      ┌──────────────────┐
            │  OpenAI GPT-4    │      │   MCP Server     │
            │  Orchestrator    │◄────►│  (Tool Registry) │
            └──────────────────┘      └──────────────────┘
                    │                           │
                    │                  ┌────────┴────────┐
                    │                  │                 │
                    ▼                  ▼                 ▼
            ┌──────────────────┐  ┌──────────┐  ┌──────────────┐
            │    ChromaDB      │  │  Users   │  │  Workspaces  │
            │ (Vector Store)   │  │   Tool   │  │     Tool     │
            └──────────────────┘  └──────────┘  └──────────────┘
```

### Component Flow
1. **HTTP Request** → Express server receives user prompt
2. **Prompt Analysis** → Orchestrator analyzes intent and determines required tools
3. **Tool Execution** → MCP client calls appropriate tools via MCP server
4. **Context Building** → Results combined with vector knowledge base
5. **Response Generation** → OpenAI generates response with full context
6. **Streaming** → Response streamed back to client via SSE

## 📦 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **ChromaDB Server**: Running instance (local or remote)
- **OpenAI API Key**: Valid API key with GPT-4 access

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd openai-chatbot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup ChromaDB Server

#### Option A: Using Docker
```bash
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

#### Option B: Using Python
```bash
pip install chromadb
chroma run --host localhost --port 8000
```

## ⚙️ Configuration

### 1. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Server Configuration
HOST=localhost
PORT=3000

# MCP Server Configuration
MCP_PORT=3005
MCP_ENABLED=true

# Application Settings
APP_DOMAIN=localhost
APP_NAME=AI CHATBOT SERVICE
APP_VERSION=1.0.1
APP_ENV=dev  # dev, qa, stage, prod
URL_DOMAIN=http://localhost:3000

# Request Settings
MAX_REQUEST_BODY_SIZE=50mb

# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4
VECTOR_STORE_ID=your-vector-store-id

# ChromaDB Configuration
CHROMA_SERVER_HOST=localhost
CHROMA_SERVER_PORT=8000
COLLECTION_NAME=360-knowledge-base
```

### 2. Configuration Files

#### `configs/global.js`
- Application-level settings (hostname, port, environment)
- Loaded from environment variables

#### `configs/openai.js`
- OpenAI API configuration
- Model selection
- ChromaDB connection settings

#### `configs/mcp.js`
- MCP server configuration
- Tool registration settings

#### `configs/request.js`
- HTTP request limits
- Body parsing settings

## 📁 Project Structure

```
openai-chatbot/
├── app/
│   └── index.js                    # Main Express application entry point
├── configs/
│   ├── global.js                   # Global app configuration
│   ├── mcp.js                      # MCP server configuration
│   ├── openai.js                   # OpenAI & ChromaDB configuration
│   └── request.js                  # Request handling configuration
├── data/
│   ├── db.js                       # ChromaDB client and operations
│   ├── generateVectors.js          # Vector generation utilities
│   ├── test.js                     # Data layer testing
│   ├── chroma/                     # ChromaDB backups
│   ├── docs/                       # Knowledge base documents
│   │   ├── 360_Plus.md
│   │   └── 360_Portal.md
│   ├── embeddings/
│   │   ├── embedDocs.js            # Document embedding generation
│   │   └── queryDocs.js            # Semantic search queries
│   ├── test-results/               # Test execution results
│   └── utils/
│       └── chunkText.js            # Text chunking for embeddings
├── mcp-server/
│   ├── server.js                   # MCP server initialization
│   └── tools/
│       ├── users.tool.js           # User management tool
│       ├── vectorKnowledge.tool.js # Vector search tool
│       └── workspaces.tool.js      # Workspace management tool
├── orchestrator/
│   ├── mcp/
│   │   └── client.js               # MCP client connection
│   ├── openai/
│   │   ├── orchestrator.js         # Main orchestration logic
│   │   └── promptAnalyzer.js       # Intent & tool detection
│   └── vector/
│       └── vectorStore.js          # Vector store operations
├── utils/
│   └── orchestrator/
│       └── messageBuilder.js       # System message construction
├── package.json                    # Project dependencies
└── .env                           # Environment configuration
```

## 🔧 Core Components

### 1. Express Application (`app/index.js`)

Main HTTP server that:
- Listens on configured port
- Handles CORS and security (Helmet)
- Manages body parsing for multiple content types
- Provides `/api/chatbot/ask` endpoint
- Connects to MCP server on startup
- Implements graceful shutdown

**Key Features:**
- Server-Sent Events (SSE) for streaming responses
- Request validation
- Error handling
- MCP client initialization

### 2. OpenAI Orchestrator (`orchestrator/openai/orchestrator.js`)

Core intelligence component that:
- Analyzes user prompts for intent
- Determines appropriate tools to call
- Executes tools via MCP client
- Builds context for OpenAI completion
- Streams responses using async generators

**Main Function:**
```javascript
async function* createChatCompletionStream(prompt, options = {})
```

**Flow:**
1. Analyze prompt → Detect intent & required tools
2. Call tool → Execute via MCP
3. Build context → Combine tool results with prompt
4. Generate response → Stream from OpenAI
5. Yield chunks → Return word-by-word stream

### 3. Prompt Analyzer (`orchestrator/openai/promptAnalyzer.js`)

Uses OpenAI to:
- Classify user intent
- Select appropriate tool(s)
- Extract parameters for tool execution
- Return structured analysis result

### 4. MCP Server (`mcp-server/server.js`)

Implements Model Context Protocol server:
- Registers available tools
- Handles tool execution requests
- Runs on stdio transport
- Provides tool discovery

**Registered Tools:**
- `workspaces` - Workspace information and management
- `users` - User data and operations
- `vectorKnowledge` - Semantic search in knowledge base

### 5. MCP Client (`orchestrator/mcp/client.js`)

Connects to MCP server:
- Establishes stdio transport
- Lists available tools
- Transforms tool schemas for OpenAI
- Executes tool calls
- Returns structured results

### 6. Vector Store (`data/db.js`)

ChromaDB operations:
- Collection management
- Batch embedding storage
- Similarity search
- Backup and restore functionality
- Error handling and retries

**Key Functions:**
```javascript
// Save embeddings to ChromaDB
saveEmbeddings(embeddings)

// Query similar documents
queryCollection(queryEmbeddings, options)

// Backup collection
backupCollection()

// Restore from backup
restoreCollection(backupFilePath)
```

### 7. Embeddings Management

#### `data/embeddings/embedDocs.js`
- Reads documents from `data/docs/`
- Chunks text into manageable pieces
- Generates embeddings using OpenAI
- Stores in ChromaDB

#### `data/embeddings/queryDocs.js`
- Queries vector store for similar content
- Returns relevant document chunks
- Used for RAG (Retrieval Augmented Generation)

## 🌐 API Documentation

### Endpoint: POST `/api/chatbot/ask`

Sends a prompt to the chatbot and receives a streaming response.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "What is the 360 Portal?",
  "options": {
    "userId": "user-123",
    "workspace": "workspace-abc",
    "tools": ["vectorKnowledge", "workspaces"]
  }
}
```

**Parameters:**
- `prompt` (string, required): User's question or instruction
- `options` (object, optional):
  - `userId` (string): User identifier for context
  - `workspace` (string): Workspace identifier
  - `tools` (array): Specific tools to use (defaults to all available)

#### Response

**Headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Body:** Server-Sent Events stream
```
data: The 

data: 360 

data: Portal 

data: is 

data: a 

data: comprehensive 

...

data: [DONE]
```

#### Example Usage

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is the 360 Portal?",
    "options": {
      "userId": "user-123",
      "workspace": "main"
    }
  }'
```

**Using JavaScript (Fetch API):**
```javascript
const response = await fetch('http://localhost:3000/api/chatbot/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'What is the 360 Portal?',
    options: {
      userId: 'user-123',
      workspace: 'main'
    }
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const content = line.slice(6);
      if (content !== '[DONE]') {
        console.log(content);
      }
    }
  }
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Prompt is required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error message description"
}
```

## 💻 Development Guide

### Running the Application

#### Development Mode
```bash
npm start
```

Or with Node.js directly:
```bash
node app/index.js
```

#### Watch Mode (with nodemon)
```bash
npm install -g nodemon
nodemon app/index.js
```

### Adding a New MCP Tool

1. **Create tool file** in `mcp-server/tools/`:

```javascript
// mcp-server/tools/myNewTool.tool.js
export function registerMyNewTool(server) {
    server.setRequestHandler({
        method: 'tools/call',
        schema: {
            name: 'myNewTool',
            description: 'Description of what this tool does',
            inputSchema: {
                type: 'object',
                properties: {
                    param1: {
                        type: 'string',
                        description: 'Description of param1'
                    },
                    param2: {
                        type: 'number',
                        description: 'Description of param2'
                    }
                },
                required: ['param1']
            }
        }
    }, async (request) => {
        const { param1, param2 } = request.params.arguments;
        
        // Your tool logic here
        const result = await performOperation(param1, param2);
        
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result)
            }]
        };
    });
    
    console.log('Tool registered: myNewTool');
}
```

2. **Register tool** in `mcp-server/server.js`:

```javascript
import { registerMyNewTool } from './tools/myNewTool.tool.js';

// Add to main() function
registerMyNewTool(server);
```

3. **Use tool** in prompts - the orchestrator will automatically detect when to use it.

### Working with Vector Store

#### Adding Documents

1. **Add markdown files** to `data/docs/`:
```bash
echo "# My Document\nContent here..." > data/docs/myDoc.md
```

2. **Generate embeddings**:
```bash
node data/embeddings/embedDocs.js
```

3. **Verify** embeddings were created:
```bash
node data/embeddings/queryDocs.js
```

#### Querying the Knowledge Base

```javascript
import { queryCollection } from './data/db.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate query embedding
const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: 'Your query here'
});

// Search for similar documents
const results = await queryCollection(
    embedding.data[0].embedding,
    { nResults: 5 }
);

console.log(results);
```

### Message Builder

Located at `utils/orchestrator/messageBuilder.js`, this utility constructs system messages for different contexts:

```javascript
import { buildSystemMessageContext } from './utils/orchestrator/messageBuilder.js';

// For asking questions
const systemMsg = buildSystemMessageContext('ask');

// For other contexts
const systemMsg = buildSystemMessageContext('summarize');
```

### Token Management

The project uses `tiktoken` for token counting. To manage token usage:

```javascript
import { encoding_for_model } from 'tiktoken';

const enc = encoding_for_model('gpt-4');
const tokens = enc.encode('Your text here');
console.log(`Token count: ${tokens.length}`);
enc.free();
```

## 🛠️ MCP Server

### Overview

The Model Context Protocol (MCP) server provides a standardized way to extend the chatbot with custom tools and capabilities.

### Available Tools

#### 1. Vector Knowledge Tool
**Name:** `vectorKnowledge`

**Description:** Searches the knowledge base for relevant information

**Parameters:**
- `query` (string): Search query
- `nResults` (number): Number of results to return
- `workspace` (string): Workspace context

**Usage:**
```json
{
  "tool": "vectorKnowledge",
  "parameters": {
    "query": "What is 360 Portal?",
    "nResults": 5,
    "workspace": "main"
  }
}
```

#### 2. Workspaces Tool
**Name:** `workspaces`

**Description:** Retrieves workspace information and settings

**Parameters:**
- `workspaceId` (string): Workspace identifier
- `action` (string): Action to perform (get, list, update)

#### 3. Users Tool
**Name:** `users`

**Description:** Manages user data and operations

**Parameters:**
- `userId` (string): User identifier
- `action` (string): Action to perform (get, list, update)

### Tool Development Best Practices

1. **Clear descriptions**: Write concise, accurate tool descriptions
2. **Schema validation**: Define strict input schemas
3. **Error handling**: Return meaningful error messages
4. **Async operations**: Use async/await for I/O operations
5. **Logging**: Log tool execution for debugging
6. **Testing**: Test tools independently before integration

## 📊 Vector Store & Embeddings

### ChromaDB Setup

ChromaDB stores document embeddings for semantic search:

**Collection Structure:**
- **Name:** Defined in `COLLECTION_NAME` env var
- **Embeddings:** OpenAI text-embedding-ada-002 (1536 dimensions)
- **Metadata:** Source document, chunk index, timestamps

### Document Processing Pipeline

1. **Read Documents** → Load from `data/docs/`
2. **Chunk Text** → Split into ~500 token chunks (using `data/utils/chunkText.js`)
3. **Generate Embeddings** → Create vectors with OpenAI
4. **Store in ChromaDB** → Save with metadata
5. **Query** → Retrieve relevant chunks by similarity

### Chunking Strategy

Located in `data/utils/chunkText.js`:

- **Chunk Size:** 500 tokens (adjustable)
- **Overlap:** 50 tokens (prevents context loss)
- **Splitting:** Sentence-aware splitting
- **Preservation:** Code blocks and formatting maintained

### Backup and Restore

#### Backup Collection
```bash
node data/db.js backup
```

Creates timestamped backup in `data/chroma/`:
- `chromadb-backup-YYYY-MM-DDTHH-mm-ss-SSSZ.json`
- `latest-backup.json` (symlink)

#### Restore Collection
```bash
node data/db.js restore data/chroma/latest-backup.json
```

### Performance Tuning

**Batch Size:**
```javascript
const BATCH_SIZE = 100; // In data/db.js
```

**Query Parameters:**
```javascript
const results = await queryCollection(embedding, {
    nResults: 10,        // Number of results
    whereDocument: {},   // Metadata filters
    include: ['documents', 'metadatas', 'distances']
});
```

## 🧪 Testing

### Manual Testing

#### Test API Endpoint
```bash
# Test with sample prompt
curl -X POST http://localhost:3000/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me about 360 Portal"}'
```

#### Test Vector Search
```bash
node data/embeddings/queryDocs.js
```

#### Test MCP Tools
```bash
node data/test.js
```

### Test Results

Test results are automatically saved to `data/test-results/` with timestamps:
- `test-results-YYYY-MM-DDTHH-mm-ss-SSSZ.json`

### Unit Testing (To Be Implemented)

To add unit tests:

1. Install testing framework:
```bash
npm install --save-dev jest
```

2. Update `package.json`:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

3. Create test files:
```
tests/
├── unit/
│   ├── orchestrator.test.js
│   ├── promptAnalyzer.test.js
│   └── vectorStore.test.js
└── integration/
    └── api.test.js
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `APP_ENV=prod` in `.env`
- [ ] Use production OpenAI API key
- [ ] Configure production ChromaDB server
- [ ] Set appropriate `MAX_REQUEST_BODY_SIZE`
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up health check endpoint
- [ ] Use process manager (PM2)

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start app/index.js --name "openai-chatbot"

# Monitor
pm2 monit

# View logs
pm2 logs openai-chatbot

# Restart
pm2 restart openai-chatbot

# Auto-restart on system reboot
pm2 startup
pm2 save
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "app/index.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  chatbot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - chroma
  
  chroma:
    image: chromadb/chroma
    ports:
      - "8000:8000"
    volumes:
      - chroma-data:/chroma/chroma

volumes:
  chroma-data:
```

Run with Docker:
```bash
docker-compose up -d
```

### Environment Variables for Production

```bash
# Production settings
APP_ENV=prod
HOST=0.0.0.0
PORT=3000
URL_DOMAIN=https://your-domain.com

# Security
MAX_REQUEST_BODY_SIZE=10mb

# ChromaDB (production instance)
CHROMA_SERVER_HOST=production-chroma-host
CHROMA_SERVER_PORT=8000

# OpenAI (production key)
OPENAI_API_KEY=sk-prod-key-here
```

## 🔍 Troubleshooting

### Common Issues

#### 1. ChromaDB Connection Failed

**Error:**
```
Error: Cannot connect to ChromaDB at http://localhost:8000
```

**Solution:**
- Verify ChromaDB server is running: `curl http://localhost:8000`
- Check `CHROMA_SERVER_HOST` and `CHROMA_SERVER_PORT` in `.env`
- Ensure no firewall blocking port 8000

#### 2. MCP Server Not Starting

**Error:**
```
Failed to connect MCP Client to MCP Server
```

**Solution:**
- Check MCP server logs in console
- Verify `mcp-server/server.js` path is correct
- Ensure no port conflicts on MCP_PORT

#### 3. OpenAI API Errors

**Error:**
```
OpenAI API Error: 401 Unauthorized
```

**Solution:**
- Verify `OPENAI_API_KEY` is valid and active
- Check API key has GPT-4 access
- Ensure no rate limits exceeded

#### 4. Streaming Response Not Working

**Error:**
Client receives no data or incomplete response

**Solution:**
- Check client supports Server-Sent Events (SSE)
- Verify `Content-Type: text/event-stream` header is set
- Ensure no reverse proxy buffering responses
- Check for timeout settings on intermediary services

#### 5. High Token Usage

**Issue:**
Unexpectedly high OpenAI API costs

**Solution:**
- Review prompt length in `promptAnalyzer.js`
- Limit vector search results (`nResults`)
- Optimize system message context
- Implement token counting and limits

### Debug Mode

Enable verbose logging:

```javascript
// In app/index.js, add:
process.env.DEBUG = 'mcp:*';

// Or set in .env:
DEBUG=mcp:*,openai:*
```

### Logging

Add detailed logging:

```javascript
// In orchestrator.js
console.log('Prompt Analysis:', JSON.stringify(analyzed, null, 2));
console.log('Tool Result:', JSON.stringify(toolResult, null, 2));
console.log('Token Usage:', tokenUsage);
```

### Health Check Endpoint

Add to `app/index.js`:

```javascript
app.get('/health', async (req, res) => {
    try {
        // Check ChromaDB
        const collection = await getOrCreateCollection();
        const count = await collection.count();
        
        // Check MCP
        const tools = await getTools();
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                chromadb: { status: 'connected', documents: count },
                mcp: { status: 'connected', tools: tools.length },
                openai: { status: 'configured' }
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});
```

## 📚 Additional Resources

### Documentation Links
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Model Context Protocol](https://github.com/modelcontextprotocol)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Related Projects
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [ChromaDB](https://github.com/chroma-core/chroma)
- [OpenAI Node.js Library](https://github.com/openai/openai-node)

## 📝 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines here]

## 📧 Support

For issues and questions:
- Create an issue in the repository
- Contact: hai15021999@gmail.com

---

**Last Updated:** October 14, 2025
