

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

            return { 
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(dummyWorkspaces, null, 2),
                    }
                ]
            };
        }
    );

    server.tool(
        "get_workspace_details",
        "Get details of a specific workspace by ID or name",
        { workspace_id: "string" },
        async (params) => {
            const { workspace_id } = params;
            // Logic to get workspace details
            const dummyWorkspaces = [
                { id: "plus", name: "360 Plus" },
                { id: "sra", name: "SRA" },
                { id: "portal", name: "Portal" }
            ];
            
            const dataResult = dummyWorkspaces.find(ws => ws.id === workspace_id || ws.name.toLowerCase() === workspace_id.toLowerCase());

            return { 
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(dataResult || { error: "Workspace not found" }, null, 2),
                    }
                ]
            };
        }
    );
}

export { registerWorkspacesTool };