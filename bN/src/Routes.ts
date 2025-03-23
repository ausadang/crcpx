// Routes.ts

import { FastifyInstance } from "fastify";
import { signupHandler, signinHandler, refreshTokenHandler, logoutHandler } from "./logics/auth";
import { createClassroomHandler, joinClassroomHandler, getMyClassroomsHandler } from "./logics/classroom";

const classroomRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/join", joinClassroomHandler); 
  fastify.post("/create", createClassroomHandler);
  fastify.get("/myClasses", getMyClassroomsHandler);
};

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/signup", signupHandler);  
  fastify.post("/signin", signinHandler);
  fastify.post("/refresh", refreshTokenHandler);
  fastify.post("/logout", logoutHandler);
};

export { classroomRoutes, authRoutes };