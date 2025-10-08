

export function buildMessages(type = 'ask', userPrompt = '', vectorContext = '', toolCalls = []) {
    const messages = [
        { role: 'system', content: buildSystemMessageContext(type) },
        { role: 'user', content: buildUserMessageContext(userPrompt, vectorContext) },
    ];
    if (toolCalls.length > 0) {
        messages.push({ role: 'assistant', content: null, tool_calls: toolCalls });
        toolCalls.forEach(tc => {
            messages.push({ role: 'tool', name: tc.function.name, content: JSON.stringify(tc['toolCallResponse']), tool_call_id: tc.id });
        });
    }
    return messages;
}

function buildSystemMessageContext(type = 'ask') {
    switch (type) {
        case 'ask':
            return `You are an AI assistant with access to specialized tools and functions.
                        
                        Rules: 
                        - Answer clearly and concisely
                        - ALWAYS use available tools when they can help answer the user's question
                        - When a user asks about a specific person, user, or entity by name, USE the appropriate tool to fetch that information
                        - Cite context when relevant
                        - Admit lack of data if tools cannot provide the information
                        - Prioritize tool usage over general knowledge when specific data is requested`;
        default:
            return `You are a helpful AI assistant.`;
    }
}

function buildUserMessageContext(userPrompt = '', vectorContext = '') {
    const content = `
            You are an intelligent AI assistant with access to a database of information.
            ${![null, undefined, ''].includes(vectorContext) ? `Available Context:\nvectorContext` : ''}

            User Question:
            ${userPrompt}

            Instructions:
            1. Use the provided context to inform your answer.
            2. Provide clear and concise answers.
            3. Cite specific context points when relevant.
            4. If the context does not contain sufficient information, respond with friendly message that user is asking out of sufficient information.
            5. Base on the user's question language. Respond in the same language.
            6. Suggest follow-up questions when appropriate.
            7. Review the context carefully before answering. Answer as a human would.
            8. Format your response in markdown when appropriate.

            Always base your responses on the provided context and be transparent about your reasoning.
        `;
    return content;
}