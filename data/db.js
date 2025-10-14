// Database management using ChromaDB
import { ChromaClient } from 'chromadb';
import {
    CHROMA_SERVER_HOST,
    CHROMA_SERVER_PORT,
    COLLECTION_NAME
} from '../configs/openai.js';
// import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';

const BATCH_SIZE = 100;

// Custom embedding function that does nothing (we provide pre-computed embeddings)
// const embedder = new DefaultEmbeddingFunction();

// Configure ChromaClient for server mode
const chromaClient = new ChromaClient({
    path: `http://${CHROMA_SERVER_HOST}:${CHROMA_SERVER_PORT}`
});

console.log(`Connecting to ChromaDB server at http://${CHROMA_SERVER_HOST}:${CHROMA_SERVER_PORT}`);

// Get or create collection
async function getOrCreateCollection() {
    try {
        console.log(`Checking for existing collection: ${COLLECTION_NAME}`);
        // Try to get existing collection first
        const collection = await chromaClient.getCollection({ name: COLLECTION_NAME });
        console.log(`Found existing collection: ${COLLECTION_NAME}`);
        return collection;
    } catch (error) {
        // If collection doesn't exist, create it
        console.log(`Creating new collection: ${COLLECTION_NAME}`);
        // Use NoOp embedding function since we're providing pre-computed embeddings from OpenAI
        const collection = await chromaClient.createCollection({ 
            name: COLLECTION_NAME,
            embeddingFunction: null
        });
        console.log(`Created collection: ${COLLECTION_NAME}`);
        return collection;
    }
}

// Save embeddings with batch processing and error handling
export async function saveEmbeddings(embeddings) {
    try {
        if (!embeddings || !Array.isArray(embeddings) || embeddings.length === 0) {
            throw new Error('Invalid embeddings: must be a non-empty array');
        }

        const collection = await getOrCreateCollection();
        console.log(`Saving ${embeddings.length} embeddings to collection ${COLLECTION_NAME}`);

        // Process in batches to avoid memory issues
        for (let i = 0; i < embeddings.length; i += BATCH_SIZE) {
            try {
                const batch = embeddings.slice(i, i + BATCH_SIZE);
                const batchData = {
                    embeddings: batch.map(item => item.embedding),
                    metadatas: batch.map(item => item.metadata),
                    documents: batch.map(item => item.text || ''), // Add documents array
                    ids: batch.map((item, index) => `doc_${i + index}_${Date.now()}`)
                };

                await collection.add(batchData);
                console.log(`Saved batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(embeddings.length / BATCH_SIZE)}`);
            } catch (batchError) {
                console.error(`Error saving batch ${Math.floor(i / BATCH_SIZE) + 1}:`, batchError.message);
                throw batchError;
            }
        }

        console.log(`Successfully saved all ${embeddings.length} embeddings`);
    } catch (error) {
        console.error('Error saving embeddings:', error.message);
        throw error;
    }
}

// Query embeddings with validation and error handling
export async function queryEmbeddings(queryEmbedding, topK = 5, filters = {}) {
    try {
        if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
            throw new Error('Invalid queryEmbedding: must be an array');
        }

        if (topK <= 0 || topK > 1000) {
            throw new Error('Invalid topK: must be between 1 and 1000');
        }

        const collection = await chromaClient.getCollection({ name: COLLECTION_NAME });

        const queryParams = {
            queryEmbeddings: [queryEmbedding],
            nResults: topK,
            include: ['metadatas', 'documents', 'distances']
        };

        // Build ChromaDB filters (using $and operator for multiple conditions)
        const filterConditions = [];

        // Add workspace filter if provided
        if (filters.workspace) {
            filterConditions.push({ "workspace": { "$eq": filters.workspace } });
        }

        // Add type filter if provided
        if (filters.type) {
            filterConditions.push({ "type": { "$eq": filters.type } });
        }

        // Add title filter if provided
        if (filters.title) {
            filterConditions.push({ "title": { "$eq": filters.title } });
        }

        // Apply filters if any exist
        if (filterConditions.length > 0) {
            if (filterConditions.length === 1) {
                queryParams.where = filterConditions[0];
            } else {
                queryParams.where = { "$and": filterConditions };
            }
            console.log(`Applying filters:`, queryParams.where);
        }

        const results = await collection.query(queryParams);

        console.log(`Query returned ${results.ids[0].length} results`);
        return results;

    } catch (error) {
        console.error('Error querying embeddings:', error.message);
        throw error;
    }
}

// Utility function to get collection info
export async function getCollectionInfo() {
    try {
        const collection = await chromaClient.getCollection({ name: COLLECTION_NAME });
        const count = await collection.count();

        return {
            name: COLLECTION_NAME,
            count: count,
            server: `http://${CHROMA_SERVER_HOST}:${CHROMA_SERVER_PORT}`
        };
    } catch (error) {
        console.error('Error getting collection info:', error.message);
        return null;
    }
}

// Utility function to delete collection (for cleanup/reset)
export async function deleteCollection() {
    try {
        await chromaClient.deleteCollection({ name: COLLECTION_NAME });
        console.log(`Deleted collection: ${COLLECTION_NAME}`);
    } catch (error) {
        console.error('Error deleting collection:', error.message);
        throw error;
    }
}