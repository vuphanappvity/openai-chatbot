// Function to embed documents using OpenAI with improved error handling and batch processing
import { chunkText } from '../utils/chunkText.js';
import OpenAI from 'openai';
import { 
    OPENAI_API_KEY, 
    EMBEDDING_MODEL
} from '../../configs/openai.js';

const openai = new OpenAI({ 
    apiKey: OPENAI_API_KEY 
});

// Create embedding
async function createEmbedding(text) {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Failed to create embedding:', error.message);
        throw error;
    }
}

export async function embedDocs(docs) {
    try {
        if (!docs || !Array.isArray(docs) || docs.length === 0) {
            throw new Error('Invalid docs: must be a non-empty array');
        }

        console.log(`Starting embedding process for ${docs.length} documents`);
        
        const embeddings = [];
        let totalChunks = 0;
        
        for (let docIndex = 0; docIndex < docs.length; docIndex++) {
            const doc = docs[docIndex];
            
            if (!doc.content || typeof doc.content !== 'string') {
                console.warn(`Skipping document ${docIndex}: invalid content`);
                continue;
            }

            console.log(`Processing document ${docIndex + 1}/${docs.length}: ${doc.metadata?.title || 'Untitled'}`);
            
            try {
                console.log(`  Content type: ${typeof doc.content}, length: ${doc.content.length}`);
                const chunks = chunkText(doc.content);
                console.log(`  Generated ${chunks.length} chunks`);
                totalChunks += chunks.length;
                
                for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
                    const chunk = chunks[chunkIndex];
                    
                    try {
                        const embedding = await createEmbedding(chunk.content);
                        
                        embeddings.push({
                            embedding: embedding,
                            text: chunk.content, // Add text field for ChromaDB
                            metadata: { 
                                ...chunk.metadata, 
                                ...doc.metadata,
                                docIndex: docIndex,
                                chunkIndex: chunkIndex,
                                chunkId: `${docIndex}_${chunkIndex}`,
                                createdAt: new Date().toISOString()
                            }
                        });
                        
                        if ((chunkIndex + 1) % 10 === 0) {
                            console.log(`  Processed ${chunkIndex + 1}/${chunks.length} chunks`);
                        }
                    } catch (error) {
                        console.error(`Failed to embed chunk ${chunkIndex} of document ${docIndex}:`, error.message);
                        // Continue with other chunks instead of failing completely
                    }
                }
            } catch (error) {
                console.error(`Failed to process document ${docIndex}:`, error.message);
                // Continue with other documents
            }
        }
        
        console.log(`Successfully embedded ${embeddings.length}/${totalChunks} chunks from ${docs.length} documents`);
        return embeddings;
        
    } catch (error) {
        console.error('Error in embedDocs:', error.message);
        throw error;
    }
}