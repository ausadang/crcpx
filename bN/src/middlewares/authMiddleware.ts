// middlewares/authMiddleware.ts

import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config(); 

// FastifyRequest
declare module "fastify" {
  interface FastifyRequest {
    user?: { id: string; email: string; username: string }; 
  }
}

// check JWT Token
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization?.split(" ")[1];  // fetch Token from headers
  const SCkEY = process.env.SCkEY;

  if (!token) {
    return reply.status(401).send({ success: false, error: "Unauthorized: No token provided" });
  }

  if (!SCkEY) {
    return reply.status(500).send({ success: false, error: "Server Error: SCkEY not defined" });
  }

  try {
    const decoded = jwt.verify(token, SCkEY) as { id: string; email: string; username: string };  // fet data from JWT token
    request.user = decoded;  // get data from user in request
  } catch (err) {
    return reply.status(401).send({ success: false, error: "Unauthorized: Invalid token" });
  }
};
