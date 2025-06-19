import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readWordFileToString } from './word_reader';

// --- MCP Server Setup ---
const server = new McpServer({
  name: "user-score-service-stdio",
  version: "1.0.0",
});

const getResumeTool = server.tool(
  "getResume",
  {
    fileDir: z.string().describe("Local file directory"),
  },
  async ({ fileDir }) => {
    const resume = await readWordFileToString(fileDir);
    return {
      content: [{ type: "text", text: resume }],
    };
  }
);
getResumeTool.description = "Read resume from local file";

// --- Main Function to Setup and Run Server via Stdio ---
async function main() {
  console.log("Initializing MCP server with StdioTransport...");

  // Instantiate the Stdio transport
  const transport = new StdioServerTransport();

  try {
    // Connect the server to the transport
    // This typically starts listening on stdin/stdout immediately
    await server.connect(transport);
    console.log("MCP server connected via Stdio. Ready for requests.");
    // Keep the process alive (server runs until stdin is closed or process exits)

  } catch (error) {
    console.error("Failed to connect MCP server via Stdio:", error);
    process.exit(1); // Exit if connection fails
  }
}

// --- Run the server ---
main(); 