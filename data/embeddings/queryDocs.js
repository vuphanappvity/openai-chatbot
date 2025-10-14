// Function to query documents using embeddings with improved error handling and result processing
import { queryEmbeddings } from '../db.js';
import OpenAI from 'openai';
import { 
    OPENAI_API_KEY, 
    EMBEDDING_MODEL
} from '../../configs/openai.js';

const openai = new OpenAI({ 
    apiKey: OPENAI_API_KEY 
});

// Create query embedding
async function createQueryEmbedding(query) {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: query
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Failed to create query embedding:', error.message);
        throw error;
    }
}

// Process and format query results
function processQueryResults(rawResults) {
    if (!rawResults || !rawResults.ids || !rawResults.ids[0]) {
        return [];
    }

    const results = [];
    const ids = rawResults.ids[0];
    const distances = rawResults.distances[0];
    const metadatas = rawResults.metadatas[0];
    const documents = rawResults.documents ? rawResults.documents[0] : [];

    for (let i = 0; i < ids.length; i++) {
        results.push({
            id: ids[i],
            similarity: 1 - distances[i], // Convert distance to similarity
            metadata: metadatas[i] || {},
            content: documents[i] || '',
            rank: i + 1
        });
    }

    return results;
}

export async function queryDocs(userQuery, topK = 5, filters = {}) {
    try {
        // Input validation
        if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
            throw new Error('Invalid userQuery: must be a non-empty string');
        }

        if (topK <= 0 || topK > 100) {
            throw new Error('Invalid topK: must be between 1 and 100');
        }

        // Support backward compatibility - if filters is a string, treat as workspace
        if (typeof filters === 'string') {
            filters = { workspace: filters };
        }

        console.log(`Querying: "${userQuery.substring(0, 50)}${userQuery.length > 50 ? '...' : ''}"`);
        console.log(`Params: topK=${topK}, filters=${JSON.stringify(filters)}`);

        try {
            // Create embedding for the query
            const queryEmbedding = await createQueryEmbedding(userQuery.trim());
            
            // Query the vector database with dynamic filters
            const rawResults = await queryEmbeddings(queryEmbedding, topK, filters);
            
            // Process and format results
            const processedResults = processQueryResults(rawResults);
            
            console.log(`Found ${processedResults.length} results`);
            
            // Log top result for debugging
            if (processedResults.length > 0) {
                const topResult = processedResults[0];
                console.log(`Top result: similarity=${topResult.similarity.toFixed(3)}, title=${topResult.metadata.title || 'N/A'}`);
            }
            
            return {
                query: userQuery,
                results: processedResults,
                totalResults: processedResults.length,
                timestamp: new Date().toISOString()
            };
            
        } catch (embeddingError) {
            console.error('Error creating embedding or querying database:', embeddingError.message);
            throw embeddingError;
        }
        
    } catch (error) {
        console.error('Error in queryDocs:', error.message);
        throw error;
    }
}