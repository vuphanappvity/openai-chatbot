import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 1000;
const TEMPERATURE = parseFloat(process.env.TEMPERATURE) || 0.7;
const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID || '';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

// ChromaDB Configuration
const CHROMA_SERVER_HOST = process.env.CHROMA_SERVER_HOST || 'localhost';
const CHROMA_SERVER_PORT = process.env.CHROMA_SERVER_PORT || '8000';
const COLLECTION_NAME = '360_docs';

// Validate required environment variables
if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required in environment variables');
}

export { OPENAI_API_KEY, OPENAI_MODEL, MAX_TOKENS, TEMPERATURE, VECTOR_STORE_ID, EMBEDDING_MODEL, CHROMA_SERVER_HOST, CHROMA_SERVER_PORT, COLLECTION_NAME };