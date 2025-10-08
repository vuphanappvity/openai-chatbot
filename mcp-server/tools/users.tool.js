

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
        "Get details of a specific user",
        { user_id: "string" },
        async (params) => {
            const { user_id } = params;
            // Logic to get user details
            const dummyUsers = [
                { id: "user1", name: "Alice", job: "Engineer" },
                { id: "user2", name: "Bob", job: "Designer" },
                { id: "user3", name: "Charlie", job: "Manager" }
            ];
            
            let messageResponse;
            const user = dummyUsers.find(u => u.id === user_id);
            if (user) {
                messageResponse = `User Details - ID: ${user.id}, Name: ${user.name}, Job: ${user.job}`;
            } else {
                messageResponse = `User with ID ${user_id} not found.`;
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