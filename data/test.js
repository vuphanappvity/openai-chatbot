// Advanced Script to test queries in ChromaDB with enhanced features
import { queryDocs } from './embeddings/queryDocs.js';
import { getCollectionInfo } from './db.js';
import fs from 'fs';
import path from 'path';
import { type } from 'os';

console.log('Advanced Query Testing Tool');
console.log('='.repeat(50));

// Enhanced result analysis
function analyzeResults(results, query) {
    const analysis = {
        totalResults: results.length,
        highQuality: results.filter(r => r.similarity > 0.2).length,
        mediumQuality: results.filter(r => r.similarity >= 0.1 && r.similarity <= 0.2).length,
        lowQuality: results.filter(r => r.similarity < 0.1).length,
        averageSimilarity: results.reduce((sum, r) => sum + r.similarity, 0) / results.length,
        topSimilarity: results.length > 0 ? results[0].similarity : 0,
        queryLength: query.length,
        uniqueChunks: new Set(results.map(r => r.metadata.chunkId)).size
    };

    return analysis;
}

// Performance scoring
function getPerformanceGrade(similarity) {
    if (similarity >= 0.4) return { grade: 'A+', color: '[EXCELLENT]', desc: 'Excellent match' };
    if (similarity >= 0.3) return { grade: 'A', color: '[VERY GOOD]', desc: 'Very good match' };
    if (similarity >= 0.2) return { grade: 'B', color: '[GOOD]', desc: 'Good match' };
    if (similarity >= 0.1) return { grade: 'C', color: '[FAIR]', desc: 'Fair match' };
    if (similarity >= 0.0) return { grade: 'D', color: '[POOR]', desc: 'Poor match' };
    return { grade: 'F', color: '[VERY POOR]', desc: 'Very poor match' };
}

// Save results to file
function saveResults(testResults) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsDir = './data/test-results';

    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    const filename = path.join(resultsDir, `test-results-${timestamp}.json`);
    fs.writeFileSync(filename, JSON.stringify(testResults, null, 2));

    console.log(`Results saved to: ${filename}`);
    return filename;
}

async function testQuery() {
    const testSession = {
        timestamp: new Date().toISOString(),
        results: [],
        summary: {}
    };

    try {
        // First, check collection info
        console.log('Collection Analysis...');
        const collectionInfo = await getCollectionInfo();
        if (collectionInfo) {
            console.log(`Collection: ${collectionInfo.name}`);
            console.log(`Documents: ${collectionInfo.count}`);
            console.log(`Server: ${collectionInfo.server}`);
            testSession.collectionInfo = collectionInfo;
        } else {
            console.warn('WARNING: No collection found. Run generateVectors.js first.');
            return;
        }

        // Test queries with different filter combinations based on actual file names
        const testCases = [
            {
                query: 'What is 360Portal ?',
                filters: { workspace: '360', type: 'Portal' },
            },
               {
                query: '360Portal là gì ?',
                filters: { workspace: '360', type: 'Portal' },
            },
            {
                query: 'How to enable Keep Me Signed In setting for workspace security',
                filters: { workspace: '360' },
            },
            {
                query: 'Global Settings licensing integrations Active Directory',
                filters: { workspace: '360' },
            }
        ];

        const topK = 5; // Increase to get more results for analysis

        console.log(`\nRunning ${testCases.length} test cases...\n`);

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            try {
                const startTime = Date.now();

                console.log(`\n${'='.repeat(60)}`);
                console.log(`Test Case ${i + 1}/${testCases.length}: ${testCase.description}`);
                console.log(`${'='.repeat(60)}`);
                console.log(`Query: "${testCase.query}"`);
                console.log(`Filters: ${JSON.stringify(testCase.filters)}`);
                console.log(`Starting search...`);

                const results = await queryDocs(testCase.query, topK, testCase.filters);
                const executionTime = Date.now() - startTime;

                if (results.results && results.results.length > 0) {
                    const analysis = analyzeResults(results.results, testCase.query);
                    const topResult = results.results[0];
                    const performance = getPerformanceGrade(topResult.similarity);

                    console.log(`\nANALYSIS SUMMARY:`);
                    console.log(`   ${performance.color} Overall Grade: ${performance.grade} (${performance.desc})`);
                    console.log(`   Top Similarity: ${topResult.similarity.toFixed(4)} (${(topResult.similarity * 100).toFixed(1)}%)`);
                    console.log(`   Results Found: ${analysis.totalResults}`);
                    console.log(`   High Quality (>20%): ${analysis.highQuality}`);
                    console.log(`   Average Similarity: ${analysis.averageSimilarity.toFixed(4)}`);
                    console.log(`   Execution Time: ${executionTime}ms`);
                    console.log(`   Unique Chunks: ${analysis.uniqueChunks}`);

                    console.log(`\nDETAILED RESULTS:`);
                    results.results.forEach((result, index) => {
                        const grade = getPerformanceGrade(result.similarity);
                        console.log(`\n${index + 1}. ${grade.color} Grade: ${grade.grade} | Similarity: ${result.similarity.toFixed(4)} (${(result.similarity * 100).toFixed(1)}%)`);
                        console.log(`   Title: ${result.metadata.title || 'N/A'}`);
                        console.log(`   Workspace: ${result.metadata.workspace || 'N/A'}`);
                        console.log(`   Type: ${result.metadata.type || 'N/A'}`);
                        console.log(`   ChunkId: ${result.metadata.chunkId || 'N/A'}`);

                        if (result.content) {
                            const preview = result.content.length > 250 ?
                                result.content.substring(0, 250) + '...' :
                                result.content;

                            // Highlight key terms if they appear in content
                            const queryWords = testCase.query.toLowerCase().split(' ').filter(w => w.length > 3);
                            let highlightedContent = preview;
                            queryWords.forEach(word => {
                                const regex = new RegExp(`(${word})`, 'gi');
                                highlightedContent = highlightedContent.replace(regex, '**$1**');
                            });

                            console.log(`   Content: "${highlightedContent}"`);
                        } else {
                            console.log(`   Content: [No content available]`);
                        }

                        if (index === 0 && result.similarity < 0.1) {
                            console.log(`   WARNING: Low similarity suggests query may need refinement`);
                        }
                    });

                    // Save test case result
                    testSession.results.push({
                        testCase: testCase,
                        results: results.results,
                        analysis: analysis,
                        executionTime: executionTime,
                        performance: performance,
                        timestamp: new Date().toISOString()
                    });

                } else {
                    console.log(`No results found.`);
                    console.log(`Suggestions:`);
                    console.log(`   - Try broader keywords`);
                    console.log(`   - Remove or adjust filters`);
                    console.log(`   - Check if content exists for these terms`);

                    testSession.results.push({
                        testCase: testCase,
                        results: [],
                        analysis: { noResults: true },
                        executionTime: executionTime,
                        timestamp: new Date().toISOString()
                    });
                }

            } catch (queryError) {
                console.error(`Error with query "${testCase.query}":`, queryError.message);
                testSession.results.push({
                    testCase: testCase,
                    error: queryError.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        // Generate final summary
        console.log(`\n${'='.repeat(20)} FINAL SUMMARY ${'='.repeat(20)}`);

        const successfulTests = testSession.results.filter(r => r.results && r.results.length > 0);
        const failedTests = testSession.results.filter(r => r.error || (r.results && r.results.length === 0));
        const avgExecutionTime = testSession.results
            .filter(r => r.executionTime)
            .reduce((sum, r) => sum + r.executionTime, 0) / testSession.results.length;

        const allSimilarities = successfulTests
            .flatMap(t => t.results.map(r => r.similarity))
            .filter(s => s !== undefined);

        const bestResult = allSimilarities.length > 0 ? Math.max(...allSimilarities) : 0;
        const avgSimilarity = allSimilarities.length > 0 ?
            allSimilarities.reduce((sum, s) => sum + s, 0) / allSimilarities.length : 0;

        console.log(`Test Session Complete:`);
        console.log(`   Successful Queries: ${successfulTests.length}/${testCases.length}`);
        console.log(`   Failed Queries: ${failedTests.length}/${testCases.length}`);
        console.log(`   Best Similarity Score: ${bestResult.toFixed(4)} (${(bestResult * 100).toFixed(1)}%)`);
        console.log(`   Average Similarity: ${avgSimilarity.toFixed(4)} (${(avgSimilarity * 100).toFixed(1)}%)`);
        console.log(`   Average Execution Time: ${avgExecutionTime.toFixed(0)}ms`);
        console.log(`   Total Results Analyzed: ${allSimilarities.length}`);

        // Performance recommendations
        console.log(`\nRECOMMENDATIONS:`);
        if (avgSimilarity < 0.2) {
            console.log(`   Average similarity is low. Consider:`);
            console.log(`      - Using more specific keywords from the actual document`);
            console.log(`      - Adding domain-specific terminology`);
            console.log(`      - Reducing query complexity`);
        }
        if (successfulTests.length < testCases.length) {
            console.log(`   Some queries returned no results. Consider:`);
            console.log(`      - Broadening search terms`);
            console.log(`      - Removing restrictive filters`);
            console.log(`      - Checking data availability`);
        }
        if (avgExecutionTime > 2000) {
            console.log(`   Execution time is slow. Consider optimizing queries or server performance.`);
        }

        testSession.summary = {
            totalTests: testCases.length,
            successfulTests: successfulTests.length,
            failedTests: failedTests.length,
            bestSimilarity: bestResult,
            avgSimilarity: avgSimilarity,
            avgExecutionTime: avgExecutionTime,
            totalResults: allSimilarities.length
        };

        // Save complete session
        const savedFile = saveResults(testSession);

        console.log(`\nTesting Complete! Session saved to ${savedFile}`);
        console.log(`${'='.repeat(80)}`);

    } catch (error) {
        console.error('Error in testQuery:', error.message);
        process.exit(1);
    }
}

testQuery();