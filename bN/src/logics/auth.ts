// logics/auth.ts
import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../db";
import * as dotenv from "dotenv";
import { authenticate } from "../middlewares/authMiddleware";
import crypto from "crypto";
dotenv.config(); 

const SCkEY = process.env.SCkEY;
if (!SCkEY) {
  throw new Error("❌ SCkEY is not defined in the environment variables");
}

const generateToken = (user: { id: string; email: string; username: string }) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      type: 'access',
      jti: crypto.randomBytes(16).toString('hex')
    }, 
    SCkEY, 
    {
      expiresIn: "1h",
    }
  );
};

const generateRefreshToken = (user: { id: string; email: string; username: string }) => {
  return jwt.sign(
    { 
      id: user.id, 
      type: 'refresh',
      jti: crypto.randomBytes(16).toString('hex')
    }, 
    SCkEY, 
    {
      expiresIn: "7d",
    }
  );
};

const signupHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password, username, full_name } = request.body as {
    email: string;
    password: string;
    username: string;
    full_name: string;
  };

  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("id")
    .or(`email.eq.${email},username.eq.${username}`)
    .maybeSingle();

  if (checkError) {
    reply.status(500).send({ success: false, error: checkError.message });
    return;
  }

  if (existingUser) {
    return reply.status(400).send({ success: false, error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const { data, error } = await supabase.from("users").insert([
    { email, password: hashedPassword, username, full_name },
  ]);

  if (error) {
    reply.status(500).send({ success: false, error: error.message });
    return;
  }

  return reply.status(201).send({ success: true, message: "User created successfully" });
};

const signinHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { identifier, password } = request.body as { identifier: string; password: string };

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, username, password")
    .or(`email.eq.${identifier},username.eq.${identifier}`)
    .maybeSingle();

  if (error || !user) {
    return reply.status(400).send({ success: false, error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return reply.status(400).send({ success: false, error: "Invalid credentials" });
  }

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const { error: updateError } = await supabase
    .from("users")
    .update({ refresh_token: refreshToken })
    .eq("id", user.id);

  if (updateError) {
    return reply.status(500).send({ success: false, error: "Failed to store refresh token" });
  }

  return reply.send({ 
    success: true, 
    accessToken,
    refreshToken 
  });
};

const refreshTokenHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = request.body as { refreshToken: string };

  if (!refreshToken) {
    return reply.status(400).send({ success: false, error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, SCkEY) as { id: string; email: string; username: string };

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, username")
      .eq("id", decoded.id)
      .eq("refresh_token", refreshToken)
      .single();

    if (error || !user) {
      return reply.status(401).send({ success: false, error: "Invalid refresh token" });
    }

    const accessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const { error: updateError } = await supabase
      .from("users")
      .update({ refresh_token: newRefreshToken })
      .eq("id", user.id);

    if (updateError) {
      return reply.status(500).send({ success: false, error: "Failed to update refresh token" });
    }

    return reply.send({ 
      success: true, 
      accessToken,
      refreshToken: newRefreshToken 
    });
  } catch (err) {
    return reply.status(401).send({ success: false, error: "Invalid refresh token" });
  }
};

const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await authenticate(request, reply);
    if (!request.user) return;

    const { error } = await supabase
      .from("users")
      .update({ refresh_token: null })
      .eq("id", request.user.id);

    if (error) {
      return reply.status(500).send({ success: false, error: "Failed to logout" });
    }

    return reply.send({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return reply.status(500).send({ success: false, error: "Internal server error" });
  }
};

export { signupHandler, signinHandler, refreshTokenHandler, logoutHandler };


/**
 * 
 '{
    "identifier": "username // email",
    "password": ""
  }'

 * 
 */