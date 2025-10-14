import { z } from 'zod';
import { queryDocs } from '../../data/embeddings/queryDocs.js';
// import { getVectorContext } from '../../orchestrator/vector/vectorStore.js';

async function registerVectorKnowledgeTool(server) {
	server.tool(
		'get_vector_knowledge',
		`Retrieves information from the vector knowledge base. Use this tool for ANY question about the system's content, configuration, UI, or documentation.
            Examples:
            - "How many columns are in the Report page?"
            - "What does the Dashboard page show?"
            - "Explain how to create a workspace."
            - "Find documents about AI"
            - "Search for data structure of devices table."
            If the user asks for facts, guides, documentation, or feature details — use this tool.
        `,
		{
			query: z.string().min(1).describe('The search query to look up in the vector knowledge base.'),
		},
		async ({ query, userId, workspace }) => {
			// Logic to get vector knowledge
			// const context = await getVectorContext(query);
			const response = await queryDocs(query, 5, { }); // apply filter later
			const context = response.results.reduce((acc, item) => {
				acc.push(item.content);
				return acc;
			}, []);

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(context, null, 2),
					},
				],
			};
		}
	);
}

export { registerVectorKnowledgeTool };
