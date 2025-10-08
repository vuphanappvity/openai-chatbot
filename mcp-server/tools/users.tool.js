

async function registerUsersTool(server) {
    server.tool(
        "get_list_users",
        "Retrieve a list of users",
        {},
        async (params) => {
            // Logic to get list of users
            const dummyUsers = [
                { id: "user1", name: "Alice" },
                { id: "user2", name: "Bob" },
                { id: "user3", name: "Charlie" }
            ];
            const messageResponse = `List of users: ${dummyUsers.map(user => user.name).join(', ')}`;

            return { 
                content: [
                    {
                        type: "text",
                        text: messageResponse,
                    }
                ] 
            };
        }
    );

    server.tool(
        "get_user_details",
        "Get detailed information about a specific user by their user ID or name. Returns user information including name, job title, age, and location. Use this tool whenever someone asks about a specific person or user by name.",
        {
            type: "object",
            properties: {
                user_id: {
                    type: "string",
                    description: "The user ID or name to look up (e.g., 'user1', 'Alice', 'Bob')"
                }
            }
            
        },
        async (params) => {
            const { user_id } = params;
            // Logic to get user details
            const dummyUsers = [
                { id: "user1", name: "Alice", job: "Engineer", age: 30, location: "New York" },
                { id: "user2", name: "Bob", job: "Designer", age: 25, location: "San Francisco" },
                { id: "user3", name: "Charlie", job: "Manager", age: 35, location: "Chicago" }
            ];
            
            let messageResponse;
            const user = dummyUsers.find(u => u.id === user_id || u.name?.toLowerCase() === user_id?.toLowerCase());
            if (user) {
                messageResponse = `User Details - ID: ${user.id}, Name: ${user.name}, Job: ${user.job}`;
            } else {
                messageResponse = `User with ID ${user_id} not found. params: ${JSON.stringify(params)}`;
            }

            return { 
                content: [
                    {
                        type: "text",
                        text: messageResponse,
                    }
                ] 
            };
        }
    );
}

export { registerUsersTool };