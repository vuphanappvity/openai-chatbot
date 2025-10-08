import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '../../configs/openai.js';
import { analyzePrompt } from './promptAnalyzer.js';
import { getVectorContext } from '../vector/vectorStore.js';
import { buildMessages } from '../../utils/orchestrator/messageBuilder.js';
import { callTool, getTools } from '../mcp/client.js';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function *createChatCompletionStream(prompt, options = {}) {
    let tokenUsage = 0;
    
    // Translate prompt if necessary
    const { translatedPrompt } = await analyzePrompt(prompt);

    // Get vector context
    const context = await getVectorContext(translatedPrompt);
    
    // Build messages
    const message = buildMessages('ask', translatedPrompt, context, []);

    // Define tool calls
    const tools = await getTools(options.tools || []);
    const toolCalls = tools.map(tool => ({
        type: 'function',
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
        }
    }));

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: message,
        stream: true,
        tools: toolCalls,
        tool_choice: 'auto' // Explicitly set to auto to encourage tool usage
    });

    // Collect token usage
    tokenUsage += response.usage?.total_tokens || 0;


    // Detect and handle tool calls
    let toolCallDetected = null;
    let accumulatedToolCall = { function: { name: '', arguments: '' }, id: '' };
    
    for await (const chunk of response) {
        const delta = chunk.choices[0].delta;

        if (delta.tool_calls) {
            // Accumulate tool call data from streaming chunks
            const toolCallDelta = delta.tool_calls[0];
            if (toolCallDelta.id) {
                accumulatedToolCall.id = toolCallDelta.id;
            }
            if (toolCallDelta.function?.name) {
                accumulatedToolCall.function.name += toolCallDelta.function.name;
            }
            if (toolCallDelta.function?.arguments) {
                accumulatedToolCall.function.arguments += toolCallDelta.function.arguments;
            }
            toolCallDetected = true;
            continue; // Skip yielding tool call chunks
        }

        const content = delta.content;
        if (content) {
            // Response content chunk without tool call
            yield content;
        }
    }

    if (toolCallDetected) {
        // Parse the accumulated arguments JSON string
        const toolArgs = JSON.parse(accumulatedToolCall.function.arguments);
        const toolResult = await callTool(accumulatedToolCall.function.name, toolArgs);

        //Follow-up call to get response after tool execution
        const followUpMessages = buildMessages('ask', translatedPrompt, context, [{ 
            id: accumulatedToolCall.id,
            type: 'function',
            function: accumulatedToolCall.function,
            toolCallResponse: toolResult 
        }]);
        const followUpResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: followUpMessages,
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

    console.info(`Total tokens used: ${tokenUsage}`);
}

export { createChatCompletionStream };