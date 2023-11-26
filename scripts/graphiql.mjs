import { serveEncodedDefinition } from "@composedb/devtools-node";

/**
 * Runs GraphiQL server to view & query composites.
 */

const ceramicUrl = process.env.CERAMIC_API_URL || "http://localhost:7007";

const server = await serveEncodedDefinition({
  ceramicURL: ceramicUrl,
  graphiql: true,
  path: "./src/__generated__/definition.json",
  port: 5001,
});

console.log(`Server started on ${server.url}`);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server stopped");
  });
});
