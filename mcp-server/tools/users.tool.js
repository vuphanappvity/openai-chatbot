import { z } from "zod";

async function registerUsersTool(server) {
    server.tool(
        "get_list_users",
        "Retrieve a list of users",
        async (params) => {
            // Logic to get list of users
            const dummyUsers = [
                { id: "user1", name: "Alice" },
                { id: "user2", name: "Bob" },
                { id: "user3", name: "Charlie" }
            ];

            return { 
                content: [
                    {
                        type: 'text',
						text: JSON.stringify(dummyUsers, null, 2),
                    }
                ]
            };
        }
    );

    server.tool(
        "get_user_details",
        "Retrieves detailed information about a specific user. ALWAYS use this tool when the user asks for information about ANY person, user, or individual by name or ID. Returns user information including name, job title, age, and location. Examples: 'Tell me about Alice', 'Get Bob's information', 'Who is user1', 'Information on Charlie'.",
        {
            keysearch: z.string().min(1).describe("The user ID or name to search for. Can be a name like 'Alice', 'Bob', 'Charlie' or an ID like 'user1', 'user2', 'user3'.")
        },
        async ({ keysearch }) => {
            
            // Logic to get user details
            const dummyUsers = [
                { id: "user1", name: "Alice", job: "Engineer", age: 30, location: "New York" },
                { id: "user2", name: "Bob", job: "Designer", age: 25, location: "San Francisco" },
                { id: "user3", name: "Charlie", job: "Manager", age: 35, location: "Chicago" }
            ];

            const dataResult = dummyUsers.find(u => u.id === keysearch || u.name.toLowerCase() === keysearch.toLowerCase());

            return { 
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(dataResult || { error: "User not found" }, null, 2),
                    }
                ]
            };
        }
    );
}

export { registerUsersTool };