// Utility function for chunking text using tiktoken with content cleaning and normalization
import { encoding_for_model } from 'tiktoken';

// Pre-compiled regex patterns for better performance
const CLEANING_PATTERNS = {
    navigation: /Home\s*>\s*[^>\n]*>|back\s+to\s+top|previous\s*\|\s*next|\d+\s*of\s*\d+/gi,
    uiElements: /\[(?:edit|show|hide)\]|click\s+here|skip\s+to\s+content/gi,
    whitespace: /\n\s*\n\s*\n+/g,
    lineSpaces: /^[ \t]+|[ \t]+$/gm,
    extraSpaces: /  +/g,
    headingSpacing: /\n(#{1,6}\s+[^\n]+)\n/g,
    headingNormalize: /^(#{1,6})\s*(.+)$/gm
};

// Clean and normalize text content for 360Plus/Portal documents
function cleanAndNormalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    try {
        // Apply all cleaning patterns in sequence for better performance
        return text
            .replace(CLEANING_PATTERNS.navigation, '')
            .replace(CLEANING_PATTERNS.uiElements, '')
            .replace(CLEANING_PATTERNS.whitespace, '\n\n')
            .replace(CLEANING_PATTERNS.lineSpaces, '')
            .replace(CLEANING_PATTERNS.headingSpacing, '\n\n$1\n\n')
            .replace(CLEANING_PATTERNS.extraSpaces, ' ')
            .replace(CLEANING_PATTERNS.headingNormalize, '$1 $2')
            .trim();
    } catch (error) {
        console.error('Error cleaning text:', error.message);
        return text;
    }
}

// Configuration constants for better maintainability
const CHUNK_CONFIG = {
    MIN_SIZE: 500,
    MAX_SIZE: 800,
    DEFAULT_SIZE: 650,
    MIN_OVERLAP: 50,
    MAX_OVERLAP: 100,
    DEFAULT_OVERLAP: 75,
    MIN_VALID_CHUNK: 50
};

// Validate chunk parameters (optimized with early returns)
const validateChunkSize = (chunkSize, overlap) => {
    if (chunkSize < CHUNK_CONFIG.MIN_SIZE || chunkSize > CHUNK_CONFIG.MAX_SIZE) {
        throw new Error(`Chunk size must be between ${CHUNK_CONFIG.MIN_SIZE}-${CHUNK_CONFIG.MAX_SIZE} tokens`);
    }
    if (overlap < CHUNK_CONFIG.MIN_OVERLAP || overlap > CHUNK_CONFIG.MAX_OVERLAP) {
        throw new Error(`Overlap must be between ${CHUNK_CONFIG.MIN_OVERLAP}-${CHUNK_CONFIG.MAX_OVERLAP} tokens`);
    }
    if (overlap >= chunkSize) {
        throw new Error('Overlap must be less than chunk size');
    }
};

// Smart chunking with sentence boundary preservation
function findSentenceBoundary(text, targetPosition) {
    const sentenceEnders = /[.!?]\s+/g;
    let lastMatch = 0;
    let match;
    
    while ((match = sentenceEnders.exec(text)) !== null) {
        if (match.index > targetPosition) break;
        lastMatch = match.index + match[0].length;
    }
    
    return lastMatch > 0 ? lastMatch : targetPosition;
}

// Optimized chunking function with smart boundaries
export function chunkText(text, chunkSize = CHUNK_CONFIG.DEFAULT_SIZE, overlap = CHUNK_CONFIG.DEFAULT_OVERLAP) {
    // Early validation
    if (!text?.trim()) return [];
    
    let encoding;
    try {
        validateChunkSize(chunkSize, overlap);
        
        // Clean text first (cached result for multiple calls)
        const cleanedText = cleanAndNormalizeText(text);
        if (!cleanedText) return [];

        // Initialize encoding once
        encoding = encoding_for_model('text-embedding-3-small');
        const tokens = encoding.encode(cleanedText);
        
        if (tokens.length === 0) return [];
        if (tokens.length <= chunkSize) {
            // Single chunk optimization
            return [{
                content: cleanedText,
                metadata: {
                    tokenStart: 0,
                    tokenEnd: tokens.length,
                    tokenCount: tokens.length,
                    chunkIndex: 0,
                    isWithinTargetRange: tokens.length >= CHUNK_CONFIG.MIN_SIZE && tokens.length <= CHUNK_CONFIG.MAX_SIZE
                }
            }];
        }

        console.log(`Chunking ${tokens.length} tokens (size: ${chunkSize}, overlap: ${overlap})`);
        
        const chunks = [];
        const step = chunkSize - overlap;
        
        for (let i = 0; i < tokens.length; i += step) {
            const endIndex = Math.min(i + chunkSize, tokens.length);
            const chunkTokens = tokens.slice(i, endIndex);
            
            // Skip chunks that are too small
            if (chunkTokens.length < CHUNK_CONFIG.MIN_VALID_CHUNK) continue;
            
            let chunkText = new TextDecoder().decode(encoding.decode(chunkTokens));
            
            // Smart boundary adjustment for better readability
            if (i > 0 && chunkText.length > 100) {
                const boundaryPos = findSentenceBoundary(chunkText, chunkText.length * 0.1);
                if (boundaryPos > 0 && boundaryPos < chunkText.length * 0.3) {
                    chunkText = chunkText.substring(boundaryPos).trim();
                }
            }
            
            if (chunkText.trim()) {
                chunks.push({
                    content: chunkText.trim(),
                    metadata: {
                        tokenStart: i,
                        tokenEnd: endIndex,
                        tokenCount: chunkTokens.length,
                        chunkIndex: chunks.length,
                        isWithinTargetRange: chunkTokens.length >= CHUNK_CONFIG.MIN_SIZE && chunkTokens.length <= CHUNK_CONFIG.MAX_SIZE,
                        qualityScore: calculateChunkQuality(chunkText, chunkTokens.length)
                    }
                });
            }
        }
        
        // Performance metrics
        const validChunks = chunks.filter(c => c.metadata.isWithinTargetRange).length;
        console.log(`Generated ${chunks.length} chunks (${validChunks} optimal)`);
        
        return chunks;
        
    } catch (error) {
        console.error('Chunking failed:', error.message);
        throw error;
    } finally {
        encoding?.free();
    }
}

// Calculate chunk quality score (0-1)
function calculateChunkQuality(text, tokenCount) {
    let score = 0;
    
    // Token count score (prefer 500-800 range)
    if (tokenCount >= CHUNK_CONFIG.MIN_SIZE && tokenCount <= CHUNK_CONFIG.MAX_SIZE) {
        score += 0.4;
    } else {
        score += Math.max(0, 0.4 - Math.abs(tokenCount - CHUNK_CONFIG.DEFAULT_SIZE) / CHUNK_CONFIG.DEFAULT_SIZE);
    }
    
    // Content quality indicators
    const hasHeading = /^#{1,6}\s+/m.test(text);
    const endsWithSentence = /[.!?]\s*$/.test(text.trim());
    const hasGoodLength = text.length > 100;
    
    if (hasHeading) score += 0.2;
    if (endsWithSentence) score += 0.2;
    if (hasGoodLength) score += 0.2;
    
    return Math.min(1, score);
}