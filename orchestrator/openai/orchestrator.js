import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '../../configs/openai.js';
import { analyzePrompt } from './promptAnalyzer.js';
import { buildSystemMessageContext } from '../../utils/orchestrator/messageBuilder.js';
import { callTool, getTools } from '../mcp/client.js';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

async function* createChatCompletionStream(prompt, options = {}) {
	let tokenUsage = 0;

	// Define tool calls
	const tools = await getTools(options.tools || []);

	const analyzed = await analyzePrompt(prompt, options, tools);

	if (analyzed.intent === 'none') {
		// No tool to call, response no resource found
		const message = `I'm sorry, but I couldn't find any relevant information to assist with your request. Could you please provide more details or clarify your question?`;
		const response = message.split(' ');
		for (const word of response) {
			yield word + ' ';
		}
		return;
	}

	const toolResult = await callTool(analyzed.tool, { ...analyzed.parameters, userId: options.userId || null, workspace: options.workspace || null });
    const toolContent = toolResult.content?.[0].text || '';

	//Follow-up call to get response after tool execution
	const completionMessage = [
        {
            role: 'system',
            content: buildSystemMessageContext('ask')
        },
        {
            role: 'user',
            content: `Workspace: ${options.workspace || 'N/A'}, User: ${options.userId || 'N/A'}, Prompt: ${prompt}`
        },
        {
            role: 'assistant',
            content: `Tool ${analyzed.tool} was called and returned the following result: ${toolContent}. Please use this information to answer the user's original question: "${prompt}".`
        },
        {
            role: 'user',
            content: `Summarize the above information and provide a clear, concise response to the user's original question. If the tool result does not contain relevant information, politely inform the user that no relevant data was found.`
        }
    ] 
	const followUpResponse = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: completionMessage,
		stream: true,
	});

	for await (const chunk of followUpResponse) {
		const delta = chunk.choices[0].delta;
		const content = delta.content;
		if (content) {
			yield content;
		}
	}

	tokenUsage += followUpResponse.usage?.total_tokens || 0;
}

export { createChatCompletionStream };
