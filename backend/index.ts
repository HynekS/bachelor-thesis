import "dotenv/config";
import path from "path";
import AutoLoad from "@fastify/autoload";

import Fastify, { FastifyInstance } from "fastify";

const fastify: FastifyInstance = Fastify({
  logger: true,
});

fastify.register(AutoLoad, {
  dir: path.join(__dirname, "routes"),
  options: { prefix: "/api/v1" },
});

fastify
  .listen({
    port: 4321,
    host: "localhost",
  })
  .then(() => {
    console.log("Server is running on http://localhost:4321/api/v1");
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
