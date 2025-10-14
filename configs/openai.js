import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 1000;
const TEMPERATURE = parseFloat(process.env.TEMPERATURE) || 0.7;
const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID || '';

// Validate required environment variables
if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required in environment variables');
}

export { OPENAI_API_KEY, OPENAI_MODEL, MAX_TOKENS, TEMPERATURE, VECTOR_STORE_ID };