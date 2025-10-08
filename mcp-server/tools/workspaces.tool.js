

function registerWorkspacesTool(server) {
    server.tool(
        "get_list_workspaces",
        "Retrieve a list of workspaces",
        {},
        async (params) => {
            // Logic to get list of workspaces
            const dummyWorkspaces = [
                { id: "plus", name: "360 Plus" },
                { id: "sra", name: "SRA" },
                { id: "portal", name: "Portal" }
            ];
            const messageResponse = `List of workspaces: ${dummyWorkspaces.map(ws => ws.name).join(', ')}`;

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
        "get_workspace_details",
        "Get details of a specific workspace",
        { workspace_id: "string" },
        async (params) => {
            const { workspace_id } = params;
            // Logic to get workspace details
            const dummyWorkspaces = [
                { id: "plus", name: "360 Plus" },
                { id: "sra", name: "SRA" },
                { id: "portal", name: "Portal" }
            ];
            
            let messageResponse;
            if (dummyWorkspaces.find(ws => ws.id === workspace_id)) {
                messageResponse = `Workspace Details - ID: ${workspace.id}, Name: ${workspace.name}`;
            } else {
                messageResponse = `Workspace with ID ${workspace_id} not found.`;
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

export { registerWorkspacesTool };