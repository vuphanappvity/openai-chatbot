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
┌─────────────────────────────────────────────────────────────────┐
│                    LLM Orchestrator (OpenAI)                    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐      │
│    │                   MCP Client                        │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     MCP Server       │
                    │   (Tool Registry)    │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┬──────────────┐
          │                    │                    │              │
          ▼                    ▼                    ▼              ▼
    ┌──────────┐         ┌──────────┐        ┌──────────┐   ┌──────────┐
    │Workspace │         │   User   │        │  Other   │   │  Vector  │
    │   Tool   │         │   Tool   │        │   Tool   │   │   Tool   │
    └────┬─────┘         └────┬─────┘        └────┬─────┘   └────┬─────┘
         │                    │                   │              │ 
         ▼                    ▼                   ▼              ▼
    ┌──────────┐         ┌──────────┐        ┌──────────┐    ┌──────────┐
    │   API    │         │   API    │        │   API    │    │  Vector  │
    │Connection│         │Connection│        │Connection│    │ Database │
    └──────────┘         └──────────┘        └──────────┘    │(ChromaDB)│
                                                             └──────────┘
```

### Component Flow
1. **User Request** → Client sends prompt to the LLM Orchestrator (OpenAI)
2. **Prompt Analysis** → Orchestrator analyzes intent and determines required tools
3. **MCP Client** → Routes tool requests through Model Context Protocol client
4. **MCP Server** → Central tool registry that manages and dispatches tool calls
5. **Tool Execution** → Individual tools execute their specific operations:
   - **Workspace Tool** → Manages workspace data via API connection
   - **User Tool** → Handles user information via API connection
   - **Vector Tool** → Performs semantic search in ChromaDB Vector Database
   - **Other Tools** → Additional custom tools with their API connections
6. **Response Aggregation** → Tool results are returned to the MCP Server
7. **Context Building** → MCP Client combines results and sends to Orchestrator
8. **Response Generation** → OpenAI generates final response with full context
9. **Streaming** → Response streamed back to client via SSE

### Key Components

#### LLM Orchestrator (OpenAI)
- **MCP Client Integration**: Embedded client that communicates with MCP Server
- **Intelligent Routing**: Analyzes prompts and determines which tools to invoke
- **Response Generation**: Creates natural language responses using GPT-4
- **Streaming Support**: Real-time response streaming to end users

#### MCP Server
- **Tool Registry**: Central hub for all available tools
- **Request Routing**: Dispatches tool calls to appropriate handlers
- **Protocol Implementation**: Implements Model Context Protocol standard
- **Extensibility**: Easy addition of new tools without modifying core logic

#### Tools Layer
Each tool provides specific capabilities:
- **Workspace Tool**: Access and manage workspace configurations and settings
- **User Tool**: Retrieve and update user profiles and preferences
- **Vector Tool**: Semantic search across knowledge base using embeddings
- **Custom Tools**: Extensible architecture allows for unlimited tool additions

#### Data Layer
- **API Connections**: RESTful APIs for workspace, user, and other services
- **Vector Database**: ChromaDB for efficient similarity search and RAG
- **Persistent Storage**: Maintains embeddings and metadata for knowledge retrieval

## 📦 Prerequisites

- **Node.js**: v18.0.0 or higher (ES Modules support required)
- **npm**: v9.0.0 or higher
- **ChromaDB Server**: Running instance (local or remote) on port 8000
- **OpenAI API Key**: Valid API key with access to:
  - GPT-4 models (or gpt-4o-mini)
  - Embedding models (text-embedding-3-small)
- **Operating System**: 
  - Windows: May require Visual C++ Redistributables (if using default ChromaDB embeddings)
  - Linux/macOS: Native support

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

**Key Dependencies:**
- `express`: ^5.1.0 - Web framework
- `openai`: ^6.0.0 - OpenAI API client
- `chromadb`: ^3.0.17 - Vector database client
- `@modelcontextprotocol/sdk`: ^1.18.2 - MCP protocol implementation
- `tiktoken`: ^1.0.22 - Token counting for OpenAI models
- Additional: cors, helmet, dotenv
npm install
```

### 3. Setup ChromaDB Server

#### Using Docker
```bash
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma --name agentic-chroma
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
URL_DOMAIN=http://localhost:8300

# Request Settings
MAX_REQUEST_BODY_SIZE=50mb

# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini  # or gpt-4, gpt-4-turbo
EMBEDDING_MODEL=text-embedding-3-small  # or text-embedding-ada-002
MAX_TOKENS=1000
TEMPERATURE=0.7
VECTOR_STORE_ID=your-vector-store-id  # Optional

# ChromaDB Configuration
CHROMA_SERVER_HOST=localhost
CHROMA_SERVER_PORT=8000
COLLECTION_NAME=360_docs  # Collection name for ChromaDB
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
- **Automatically starts MCP server** on startup (imports `mcp-server/server.js`)
- **Automatically generates vectors** on startup (imports `data/generateVectors.js`)
- Connects MCP client to MCP server
- Implements graceful shutdown on SIGINT

**Key Features:**
- Server-Sent Events (SSE) for streaming responses with JSON format
- Request validation (requires `prompt` in body)
- Comprehensive error handling
- MCP client initialization and connection
- Auto-generation of embeddings from documents

**Startup Sequence:**
1. Load environment variables
2. Start MCP server (via import)
3. Generate/update vectors (via import)
4. Start HTTP server
5. Connect MCP client to server
6. Ready to accept requests

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
- Collection management with custom embedding function handling
- Batch embedding storage (batch size: 100)
- Similarity search with filtering
- Collection info and deletion utilities
- Uses `embeddingFunction: null` to provide pre-computed embeddings from OpenAI

**Key Functions:**
```javascript
// Save pre-computed embeddings to ChromaDB
saveEmbeddings(embeddings)

// Query using pre-computed embeddings
queryEmbeddings(queryEmbedding, topK, filters)

// Get collection information
getCollectionInfo()

// Delete collection (for cleanup/reset)
deleteCollection()
```

**Important:** This project uses OpenAI's `text-embedding-3-small` for generating embeddings, not ChromaDB's default embedding function. This avoids dependency issues and provides higher quality embeddings.

### 7. Embeddings Management

#### `data/embeddings/embedDocs.js`
- Reads documents from `data/docs/`
- Chunks text into manageable pieces using `data/utils/chunkText.js`
- Generates embeddings using OpenAI's embedding model
- Returns embeddings ready for ChromaDB storage

#### `data/embeddings/queryDocs.js`
- Queries vector store for similar content
- Returns relevant document chunks with metadata
- Used for RAG (Retrieval Augmented Generation)

#### `data/generateVectors.js`
- Script to generate and save vectors from markdown documents
- Automatically runs on application startup
- Handles collection backup and restoration
- Processes all `.md` files in `data/docs/` folder

### 8. Text Chunking (`data/utils/chunkText.js`)

Intelligent text chunking for embeddings:
- Token-based chunking (default: 650 tokens per chunk)
- Overlap between chunks (default: 75 tokens)
- Preserves sentence boundaries
- Optimizes for embedding model context windows

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
data: {"content":"The "}

data: {"content":"360 "}

data: {"content":"Portal "}

data: {"content":"is "}

data: {"content":"a "}

...

data: {"done":true}
```

**Response Format:**
Each data event contains a JSON object:
- During streaming: `{"content": "word "}`
- On completion: `{"done": true}`
- On error: `{"error": "error message"}`

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
      const jsonStr = line.slice(6);
      try {
        const data = JSON.parse(jsonStr);
        if (data.done) {
          console.log('Stream completed');
        } else if (data.content) {
          process.stdout.write(data.content);
        } else if (data.error) {
          console.error('Error:', data.error);
        }
      } catch (e) {
        // Skip invalid JSON
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
node app/index.js
```

**Note:** The application automatically:
- Starts the MCP server
- Generates vectors from documents in `data/docs/` (if not already done)
- Connects MCP client to MCP server
- Starts the HTTP server on the configured port

#### Watch Mode (with nodemon)
```bash
npm install -g nodemon
nodemon app/index.js
```

#### Important Startup Behavior
The app imports `data/generateVectors.js` on startup, which:
- Checks for existing vector collections
- Generates embeddings if needed
- Creates backups automatically

To skip automatic vector generation, comment out this line in `app/index.js`:
```javascript
// import '../data/generateVectors.js';
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

2. **Generate embeddings** (two options):

**Option A: Restart the application** (automatic generation):
```bash
node app/index.js
```

**Option B: Run the generation script** manually:
```bash
node data/generateVectors.js
```

This script will:
- Read all `.md` files from `data/docs/`
- Delete existing collection (if any)
- Generate embeddings using OpenAI
- Save to ChromaDB
- Create automatic backup in `data/chroma/`

3. **Verify** embeddings were created:
```bash
node data/embeddings/queryDocs.js
```

#### Querying the Knowledge Base

```javascript
import { queryEmbeddings } from './data/db.js';
import { OpenAI } from 'openai';
import { OPENAI_API_KEY, EMBEDDING_MODEL } from './configs/openai.js';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Generate query embedding
const embedding = await openai.embeddings.create({
    model: EMBEDDING_MODEL, // 'text-embedding-3-small'
    input: 'Your query here'
});

// Search for similar documents with filters
const results = await queryEmbeddings(
    embedding.data[0].embedding,
    5, // topK
    { 
        workspace: '360',
        type: 'Portal'
    }
);

console.log(results);
```
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

1. **Read Documents** → Load all `.md` files from `data/docs/`
2. **Parse Metadata** → Extract workspace and type from filename (e.g., `360_Portal.md` → workspace: "360", type: "Portal")
3. **Chunk Text** → Split into ~650 token chunks with 75-token overlap (using `data/utils/chunkText.js`)
4. **Generate Embeddings** → Create vectors with OpenAI's `text-embedding-3-small` model
5. **Store in ChromaDB** → Save embeddings with metadata to collection
6. **Auto Backup** → Automatically creates backup after successful generation

### Chunking Strategy

Located in `data/utils/chunkText.js`:

- **Chunk Size:** 650 tokens (configurable, optimized for embedding model)
- **Overlap:** 75 tokens (prevents context loss between chunks)
- **Splitting:** Sentence-aware splitting for semantic coherence
- **Preservation:** Maintains code blocks and formatting
- **Token Counting:** Uses `tiktoken` library for accurate token counting

### Backup and Restore

Backups are **automatically created** after running `node data/generateVectors.js`.

**Manual Backup:**
The `generateVectors.js` script automatically backs up collections to:
- `data/chroma/chromadb-backup-YYYY-MM-DDTHH-mm-ss-SSSZ.json` (timestamped)
- `data/chroma/latest-backup.json` (always points to latest)

**Backup includes:**
- Collection metadata
- All document IDs
- All embeddings
- All metadata
- All document texts

### Performance Tuning

**Batch Size:**
```javascript
const BATCH_SIZE = 100; // In data/db.js - controls batch processing
```

**Query Parameters:**
```javascript
const results = await queryEmbeddings(
    queryEmbedding,
    10,  // topK - Number of results to return
    {
        workspace: '360',  // Optional filter by workspace
        type: 'Portal',    // Optional filter by type
        title: '360_Portal' // Optional filter by title
    }
);
```

**Embedding Model Configuration:**
```javascript
// In configs/openai.js
EMBEDDING_MODEL = 'text-embedding-3-small'  // Fast and cost-effective
// Alternative: 'text-embedding-ada-002' or 'text-embedding-3-large'
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
- Check API key has access to the configured model (`gpt-4o-mini` or `gpt-4`)
- Ensure no rate limits exceeded
- Verify embedding model is accessible (`text-embedding-3-small`)

#### 4. ChromaDB Embedding Function Error

**Error:**
```
Error: A dynamic link library (DLL) initialization routine failed.
onnxruntime_binding.node
Cannot instantiate a collection with the DefaultEmbeddingFunction
```

**Solution:**
This project uses **pre-computed embeddings from OpenAI**, not ChromaDB's default embedding function. The `db.js` file should have `embeddingFunction: null` when creating collections.

**Check `data/db.js`:**
```javascript
const collection = await chromaClient.createCollection({ 
    name: COLLECTION_NAME,
    embeddingFunction: null  // Must be null
});
```

**Benefits of this approach:**
- ✅ Avoids onnxruntime dependency issues on Windows
- ✅ Higher quality embeddings from OpenAI
- ✅ No DLL/native module compilation required
- ✅ Consistent embeddings across all operations

#### 5. Streaming Response Not Working

**Error:**
Client receives no data or incomplete response

**Solution:**
- Check client supports Server-Sent Events (SSE)
- Verify `Content-Type: text/event-stream` header is set
- Parse JSON from each `data:` line (format: `{"content": "word"}`)
- Ensure no reverse proxy buffering responses
- Check for timeout settings on intermediary services
- Look for `X-Accel-Buffering: no` header

#### 6. High Token Usage

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
