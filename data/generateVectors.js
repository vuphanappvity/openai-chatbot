// Script to generate vector data from docs
import fs from 'fs';
import path from 'path';
import { ChromaClient } from 'chromadb';
import { embedDocs } from './embeddings/embedDocs.js';
import { saveEmbeddings, getCollectionInfo, deleteCollection } from './db.js';
import { CHROMA_SERVER_HOST, CHROMA_SERVER_PORT } from '../configs/openai.js';

console.log('Starting vector generation process...');

// Backup function
async function createBackup() {
    try {
        const client = new ChromaClient({
            path: `http://${CHROMA_SERVER_HOST}:${CHROMA_SERVER_PORT}`
        });
        
        // Create backup directory
        const backupDir = './data/chroma';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        console.log('Getting collections from ChromaDB...');
        const collections = await client.listCollections();
        
        if (collections.length === 0) {
            console.log('No collections found to backup');
            return;
        }
        
        const backupData = {
            timestamp: new Date().toISOString(),
            server: `http://${CHROMA_SERVER_HOST}:${CHROMA_SERVER_PORT}`,
            collections: []
        };
        
        for (const collectionInfo of collections) {
            console.log(`Backing up collection: ${collectionInfo.name}`);
            
            const collection = await client.getCollection({ name: collectionInfo.name });
            const count = await collection.count();
            
            // Get all data from collection
            const data = await collection.get({
                include: ['embeddings', 'metadatas', 'documents']
            });
            
            const collectionBackup = {
                name: collectionInfo.name,
                id: collectionInfo.id,
                count: count,
                data: {
                    ids: data.ids || [],
                    embeddings: data.embeddings || [],
                    metadatas: data.metadatas || [],
                    documents: data.documents || []
                }
            };
            
            backupData.collections.push(collectionBackup);
            console.log(`Backed up ${data.ids.length} documents from collection: ${collectionInfo.name}`);
        }
        
        // Save backup to file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(backupDir, `chromadb-backup-${timestamp}.json`);
        
        fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
        
        // Also create a "latest" backup
        const latestFile = path.join(backupDir, 'latest-backup.json');
        fs.writeFileSync(latestFile, JSON.stringify(backupData, null, 2));
        
        console.log(`Backup completed successfully!`);
        console.log(`File: ${backupFile}`);
        console.log(`Also saved as: ${latestFile}`);
        console.log(`Total collections: ${backupData.collections.length}`);
        console.log(`Total documents: ${backupData.collections.reduce((sum, col) => sum + col.count, 0)}`);
        
    } catch (error) {
        console.error('Error creating backup:', error.message);
        // Don't exit the process, just log the error
    }
}

async function generateVectors() {
    try {
        // Always clear existing data and regenerate fresh
        console.log('Checking existing collection...');
        const existingInfo = await getCollectionInfo();
        
        if (existingInfo && existingInfo.count > 0) {
            console.log(`Found existing collection "${existingInfo.name}" with ${existingInfo.count} documents`);
            console.log('Clearing existing data for fresh generation...');
            await deleteCollection();
            console.log('Existing collection deleted successfully');
        }

        const docsFolder = path.resolve('./data/docs');
        
        // Check if docs folder exists
        if (!fs.existsSync(docsFolder)) {
            throw new Error(`Docs folder not found: ${docsFolder}`);
        }

        const files = fs.readdirSync(docsFolder).filter(file => file.endsWith('.md'));
        
        if (files.length === 0) {
            throw new Error('No .md files found in docs folder');
        }

        console.log(`Found ${files.length} document(s) to process`);

        const docs = [];
        for (const file of files) {
            try {
                const content = fs.readFileSync(path.join(docsFolder, file), 'utf-8');
                if (content.trim().length === 0) {
                    console.warn(`Skipping empty file: ${file}`);
                    continue;
                }
                
                const fileName = file.replace('.md', '');
                const [workspace = '360', type = 'Portal'] = fileName.split('_');
                
                docs.push({
                    content,
                    metadata: {
                        title: fileName,
                        workspace,
                        type,
                        filename: file
                    }
                });
            } catch (fileError) {
                console.error(`Error reading file ${file}:`, fileError.message);
                // Continue with other files
            }
        }

        if (docs.length === 0) {
            throw new Error('No valid documents to process');
        }

        console.log(`Processing ${docs.length} valid document(s)`);

        console.log('Generating embeddings...');
        const embeddings = await embedDocs(docs);
        
        console.log('Saving to ChromaDB...');
        await saveEmbeddings(embeddings);

        // Check collection info
        const info = await getCollectionInfo();
        if (info) {
            console.log(`Success! Collection "${info.name}" now contains ${info.count} documents`);
            console.log(`Server: ${info.server}`);
        }
        
        console.log('Vector data generated and saved to ChromaDB successfully.');
        
        // Automatically backup to local folder
        console.log('Creating backup to local folder...');
        await createBackup();
        
        console.log('Process completed successfully!');
        
    } catch (error) {
        console.error('Error generating vectors:', error.message);
        process.exit(1);
    }
}

generateVectors();