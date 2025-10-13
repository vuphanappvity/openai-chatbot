import OpenAI from 'openai';
import { buildSystemMessageContext } from '../../utils/orchestrator/messageBuilder.js';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function analyzePrompt(prompt, options = {}, tools = []) {
	const toolCalls = tools.map((tool) => ({
		type: 'function',
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.parameters,
		},
	}));

	const systemPrompt = buildSystemMessageContext('analyze');

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini', // Use a smaller model for analysis
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: `User: ${options['userId'] || null}, Workspace: ${options['workspace'] || null}, Prompt: ${prompt}` },
		],
		tools: toolCalls,
		tool_choice: 'auto', // Encourage tool usage
		temperature: 0, // Deterministic output
	});

	const choice = completion.choices[0];
	const toolCall = choice.message?.tool_calls?.[0];

	if (!toolCall) {
		// No tool was selected
		return {
			intent: 'none',
			reason: 'LLM determined no tool applicable',
			confidence: 0.5,
		};
	}

	const toolName = toolCall.function.name;
	let args = {};
	try {
		args = JSON.parse(toolCall.function.arguments);
	} catch {
		throw new Error('LLM returned invalid JSON arguments');
	}

    return {
        intent: toolName,
        tool: toolName,
        toolId: toolCall.id,
        parameters: args,
        reason: 'LLM selected tool based on prompt',
        confidence: 0.9, // Placeholder confidence
    }
}

export { analyzePrompt };
