//server.ts
import Fastify from "fastify";
import * as dotenv from "dotenv";
import { authRoutes, classroomRoutes } from "./Routes";
import cors from "@fastify/cors";
dotenv.config();

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z"
      },
    },
  },
});

// Register CORS
fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
});

//register path
fastify.register(classroomRoutes, { prefix: "/api/classroom" });
fastify.register(authRoutes, { prefix: "/api/auth" });

fastify.get("/", async (request, reply) => {
  return { message: "/api/auth || /api/classroom" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("✅ Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();