# OpenAI Chatbot with MCP Integration

A sophisticated AI chatbot application built with OpenAI's GPT-4, featuring Model Context Protocol (MCP) server integration, vector-based context retrieval, and streaming responses.

## 🚀 Features

- **OpenAI GPT-4 Integration**: Leverages OpenAI's powerful language model for intelligent responses
- **Model Context Protocol (MCP)**: Custom MCP server with extensible tool system
- **Streaming Responses**: Real-time streaming of AI responses via Server-Sent Events (SSE)
- **Vector Store Integration**: Context-aware responses using vector-based information retrieval
- **Prompt Analysis**: Intelligent prompt processing and translation
- **RESTful API**: Easy-to-use HTTP endpoints for chatbot interaction
- **Graceful Shutdown**: Proper cleanup and resource management
- **Security**: Helmet.js integration for enhanced security headers

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- OpenAI API Key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd openai-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Server Configuration
HOST=localhost
PORT=3000
APP_NAME=OpenAI Chatbot
APP_ENV=development
APP_DOMAIN=localhost
APP_VERSION=1.0.0
URL_DOMAIN=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Request Configuration (optional)
MAX_REQUEST_BODY_SIZE=10mb
```

## 🚀 Usage

### Starting the Server

```bash
node app/index.js
```

The server will start on the configured port (default: 3000) and automatically:
- Initialize the MCP server
- Connect the MCP client
- Set up the Express API endpoints

### API Endpoints

#### Chat Completion (Streaming)

**Endpoint:** `POST /api/chatbot/ask`

**Request Body:**
```json
{
  "prompt": "Your question or message here",
  "options": {
    "tools": ["workspaces", "users"]
  }
}
```

**Response:** Server-Sent Events (SSE) stream with real-time AI responses

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how can you help me?"}'
```

**Example using JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:3000/api/chatbot/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'What can you tell me about my workspaces?',
    options: {
      tools: ['workspaces']
    }
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log(chunk);
}
```

## 🏗️ Project Structure

```
openai-chatbot/
├── app/
│   └── index.js                    # Main application entry point
├── configs/
│   ├── global.js                   # Global configuration
│   ├── mcp.js                      # MCP configuration
│   ├── openai.js                   # OpenAI configuration
│   └── request.js                  # Request configuration
├── data/                           # Data storage directory
├── mcp-server/
│   ├── server.js                   # MCP server implementation
│   └── tools/
│       ├── users.tool.js           # Users tool implementation
│       └── workspaces.tool.js      # Workspaces tool implementation
├── orchestrator/
│   ├── mcp/
│   │   └── client.js               # MCP client implementation
│   ├── openai/
│   │   ├── orchestrator.js         # OpenAI orchestration logic
│   │   └── promptAnalyzer.js       # Prompt analysis and translation
│   └── vector/
│       └── vectorStore.js          # Vector-based context retrieval
├── utils/
│   └── orchestrator/
│       └── messageBuilder.js       # Message formatting utilities
├── .env                            # Environment variables (not in repo)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies
├── package-lock.json               # Locked dependency versions
└── README.md                       # This file
```

## 📂 Source Code Structure

### `/app` - Application Layer

#### `index.js` - Main Entry Point
The primary application file that:
- Initializes Express.js server with middleware (CORS, Helmet, body parsers)
- Starts the MCP server on application launch
- Connects the MCP client to the server
- Defines API routes (`/api/chatbot/ask`)
- Handles graceful shutdown on SIGINT
- Manages Server-Sent Events (SSE) for streaming responses

**Key Dependencies:**
- Express.js for HTTP server
- MCP server initialization
- OpenAI orchestrator integration

---

### `/configs` - Configuration Layer

#### `global.js` - Global Settings
Exports environment-based configuration:
- `HOSTNAME` - Server host address
- `HOST_PORT` - Server port number
- `APP_NAME` - Application name
- `APP_ENV` - Environment (development/production)
- `APP_DOMAIN` - Application domain
- `URL_DOMAIN` - Full URL domain

#### `openai.js` - OpenAI Configuration
- `OPENAI_API_KEY` - OpenAI API authentication key
- `VECTOR_STORE_ID` - OpenAI Vector Store identifier for context retrieval
- Model configurations and API settings

#### `mcp.js` - MCP Configuration
Model Context Protocol server and client configurations

#### `request.js` - Request Settings
- `MAX_REQUEST_BODY_SIZE` - Maximum allowed request payload size
- Other HTTP request-related configurations

---

### `/mcp-server` - Model Context Protocol Server

#### `server.js` - MCP Server Core
Implements the Model Context Protocol server:
- Creates `McpServer` instance with name and version
- Registers custom tools (workspaces, users)
- Establishes StdioServerTransport for communication
- Handles tool invocations from the MCP client

**Key Features:**
- Tool registration system
- Stdio-based transport layer
- Error handling and logging

#### `/tools` - MCP Tool Implementations

##### `workspaces.tool.js` - Workspace Management Tool
Provides workspace-related functionality:

**Tools:**
- `get_list_workspaces` - Retrieves all available workspaces
  - Returns: List of workspace objects (id, name)
  - Example: 360 Plus, SRA, Portal

- `get_workspace_details` - Gets detailed information about a specific workspace
  - Parameters: `workspace_id` (string)
  - Returns: Workspace details or not found message

##### `users.tool.js` - User Management Tool
Provides user-related functionality:

**Tools:**
- `get_list_users` - Retrieves all users
  - Returns: List of user objects (id, name)
  - Example: Alice, Bob, Charlie

- `get_user_details` - Gets detailed information about a specific user
  - Parameters: `user_id` (string)
  - Returns: User details (id, name, job) or not found message

---

### `/orchestrator` - Business Logic Layer

#### `/mcp` - MCP Client Module

##### `client.js` - MCP Client Implementation
Manages communication with the MCP server:

**Functions:**
- `connectLocalMCPServer()` - Establishes connection to local MCP server
  - Uses StdioClientTransport
  - Spawns MCP server as a child process
  - Returns connected client instance

- `getTools(name = [])` - Lists available tools
  - Parameters: Optional array of tool names to filter
  - Returns: Array of tool definitions with schemas

- `callTool(toolName, parameters = {})` - Invokes a specific tool
  - Parameters: Tool name and arguments
  - Returns: Tool execution result

**Configuration:**
- Client name: "mcp-client"
- Version: "1.0.0"
- Capabilities: tools support

---

#### `/openai` - OpenAI Integration Module

##### `orchestrator.js` - OpenAI Orchestration
Main orchestrator for AI interactions:

**Functions:**
- `createChatCompletionStream(prompt, options = {})` - Generates streaming chat completions
  - Analyzes and translates prompts
  - Retrieves vector context
  - Builds message history
  - Registers available MCP tools
  - Streams GPT-4 responses
  - Handles tool calls during streaming
  - Tracks token usage

**Workflow:**
1. Prompt analysis and translation
2. Vector context retrieval
3. Message construction
4. Tool registration with OpenAI
5. Streaming response generation
6. Tool call detection and execution
7. Token usage tracking

**Model:** GPT-4 with streaming enabled

##### `promptAnalyzer.js` - Prompt Analysis
Analyzes and processes user prompts:

**Functions:**
- `analyzePrompt(prompt)` - Detects language and translates if needed
  - Uses GPT-4o-mini for efficiency
  - Detects non-English prompts
  - Translates to English if necessary
  - Returns: `{ translatedPrompt, language }`

**Purpose:** Ensures consistent English processing while supporting multilingual input

---

#### `/vector` - Vector Store Module

##### `vectorStore.js` - Context Retrieval
Manages vector-based context retrieval:

**Functions:**
- `getVectorContext(prompt)` - Retrieves relevant context from vector store
  - Searches OpenAI Vector Store with semantic similarity
  - Parameters:
    - `max_num_results`: 5 (top 5 relevant results)
    - `score_threshold`: 0.6 (minimum relevance score)
    - `rewrite_query`: true (query optimization)
  - Summarizes results using GPT-4o-mini
  - Returns concise key points (max 150 tokens)

**Error Handling:** Gracefully handles vector store failures, returns empty string

**Purpose:** Enhances AI responses with relevant contextual information from knowledge base

---

### `/utils` - Utility Functions

#### `/orchestrator` - Orchestration Utilities

##### `messageBuilder.js` - Message Construction
Formats messages for OpenAI API:

**Functions:**
- `buildMessages(type, userPrompt, vectorContext, toolCalls)` - Constructs message array
  - Parameters:
    - `type` - Message type ('ask' or other)
    - `userPrompt` - User's question/message
    - `vectorContext` - Retrieved context from vector store
    - `toolCalls` - Array of tool call results
  - Returns: Formatted message array for OpenAI API

- `buildSystemMessageContext(type)` - Creates system message
  - Defines AI assistant behavior and rules
  - Sets response guidelines and constraints

- `buildUserMessageContext(userPrompt, vectorContext)` - Creates user message
  - Combines user prompt with available context
  - Provides detailed instructions for AI:
    - Use context to inform answers
    - Provide clear and concise responses
    - Cite context when relevant
    - Respond in user's language
    - Suggest follow-up questions
    - Format in markdown when appropriate

**Message Structure:**
```javascript
[
  { role: 'system', content: '...' },
  { role: 'user', content: '...' },
  // Optional tool call messages
  { role: 'assistant', content: null, tool_call: {...} },
  { role: 'tool', name: '...', content: '...', tool_call_id: '...' }
]
```

---

### `/data` - Data Storage
Directory for storing application data, vector store files, or other persistent storage needs.

---

## 🔄 Request Flow

1. **Client Request** → `POST /api/chatbot/ask` with prompt and options
2. **Prompt Analysis** → `promptAnalyzer.js` detects language and translates if needed
3. **Context Retrieval** → `vectorStore.js` fetches relevant context from vector store
4. **Message Building** → `messageBuilder.js` constructs OpenAI API messages
5. **Tool Registration** → `client.js` fetches available MCP tools
6. **AI Generation** → `orchestrator.js` streams GPT-4 responses
7. **Tool Execution** → If AI requests tool usage, `client.js` calls MCP tools
8. **Response Stream** → Server-Sent Events stream response to client

---

## 🧩 Key Design Patterns

### Modular Architecture
- Clear separation of concerns (app, orchestrator, configs, utils)
- Each module handles a specific responsibility

### Streaming Pattern
- Server-Sent Events (SSE) for real-time response streaming
- Async generators for efficient data flow

### MCP Tool System
- Extensible tool registration
- Schema-based parameter validation
- Stdio-based inter-process communication

### Context Enhancement
- Vector store integration for knowledge augmentation
- Prompt analysis for multilingual support
- Message building with context injection

### Error Resilience
- Graceful degradation when vector store unavailable
- Error handling at each layer
- Fallback responses for missing data

## 🔧 Architecture

### Components

1. **Express Server** (`app/index.js`)
   - HTTP server setup with CORS and security middleware
   - API endpoint routing
   - MCP server initialization

2. **MCP Server** (`mcp-server/`)
   - Custom Model Context Protocol server
   - Extensible tool system
   - Available tools: Workspaces, Users

3. **OpenAI Orchestrator** (`orchestrator/openai/`)
   - Manages OpenAI API interactions
   - Handles streaming responses
   - Integrates tool calls and context

4. **Vector Store** (`orchestrator/vector/`)
   - Retrieves relevant context for prompts
   - Enhances AI responses with contextual information

5. **Prompt Analyzer** (`orchestrator/openai/promptAnalyzer.js`)
   - Analyzes and processes user prompts
   - Handles translation if necessary

## 🔌 MCP Tools

The chatbot includes custom MCP tools that extend its capabilities:

### Available Tools

1. **Workspaces Tool**: Manages and retrieves workspace information
2. **Users Tool**: Handles user-related operations

### Adding New Tools

To add a new tool:

1. Create a new tool file in `mcp-server/tools/`:
```javascript
export function registerYourTool(server) {
  server.tool("your-tool-name", "Tool description", {
    // tool parameters schema
  }, async (params) => {
    // tool implementation
    return { result: "your result" };
  });
}
```

2. Register the tool in `mcp-server/server.js`:
```javascript
import { registerYourTool } from "./tools/your-tool.js";
registerYourTool(server);
```

## 🔒 Security

- **Helmet.js**: Adds security headers to HTTP responses
- **CORS**: Configured for cross-origin resource sharing
- **Request Size Limits**: Prevents oversized payloads
- **Environment Variables**: Sensitive data stored in `.env` file

## 🐛 Troubleshooting

### Common Issues

1. **MCP Client Connection Failed**
   - Ensure the MCP server is starting correctly
   - Check console logs for error messages

2. **OpenAI API Errors**
   - Verify your `OPENAI_API_KEY` is correct
   - Check your OpenAI account quota and billing

3. **Port Already in Use**
   - Change the `PORT` in your `.env` file
   - Stop any processes using the configured port

## 📝 Development

### Running in Development Mode

```bash
node app/index.js
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HOST` | Server hostname | `localhost` |
| `PORT` | Server port | `3000` |
| `APP_NAME` | Application name | `OpenAI Chatbot` |
| `APP_ENV` | Environment | `development` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `MAX_REQUEST_BODY_SIZE` | Max request size | `10mb` |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the GPT-4 API
- [Model Context Protocol](https://github.com/modelcontextprotocol) for the MCP SDK
- [Express.js](https://expressjs.com/) for the web framework

---

**Note**: This is an AI research application. Make sure to review and test thoroughly before deploying to production.
