

function buildSystemMessageContext(type = 'ask') {
    switch (type) {
        case 'analyze': `
                You are an AI agent that selects the correct tool for user prompts.
                Your task:
                1. Choose which tool (if any) is appropriate from the available list.
                2. Extract the parameters required by that tool from the user's prompt and context.
                3. If the user asks a general question not matching other tools, also use "get_vector_knowledge"

                Return your reasoning as JSON via function calling.
                `;
        case 'ask':
            return `
                    You are a helpful AI agent assistant inside an application. 
                    You have access to structured tool results (JSON data) that you must explain clearly.
                    Guidelines:
                    - Respond in natural language with the same language of user's question and support markdown.
                    - Be concise and factual; do not invent data.
                    - Mention workspace name if relevant.
                    - If the toolResult is empty, say so politely.
            `;
        default:
            return `You are a helpful AI assistant.`;
    }
}

export { buildSystemMessageContext };