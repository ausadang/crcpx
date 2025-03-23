// logics/classroom.ts
import { FastifyRequest, FastifyReply } from "fastify";
import supabase from "../db"; 
import { authenticate } from "../middlewares/authMiddleware";
import crypto from "crypto";

const generateJoinCode = (): string => crypto.randomBytes(5).toString("hex").toUpperCase().slice(0, 10);

export const createClassroomHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {

    await authenticate(request, reply);
    if (!request.user) return;

    const { name, description, access_type, join_method, limit_member, class_password } = request.body as {
      name: string;
      description?: string;
      access_type: number; // 0=private, 1=public
      join_method: number; // 0=on password, 1=password in case public only ,2 = approve
      limit_member?: number;
      class_password?: string;
    };

    if (!name) return reply.status(400).send({ success: false, error: "Classroom name is required" });
    if (![0, 1].includes(access_type)) return reply.status(400).send({ success: false, error: "Invalid access_type" });
    if (![0, 1].includes(join_method)) return reply.status(400).send({ success: false, error: "Invalid join_method" });
    if (join_method === 1 && !class_password) return reply.status(400).send({ success: false, error: "Class password is required when join_method is 1" });

    const join_code = generateJoinCode();

    const { data, error } = await supabase
      .from("classrooms")
      .insert([
        {
          name,
          description,
          access_type,
          join_method,
          join_code,
          class_password,
          limit_member: limit_member ?? 50,
          total_member: 0,
          owner_id: request.user.id,
        },
      ])
      .select();

    if (error) throw error;

    const { error: memberError } = await supabase
      .from("classroom_members")
      .insert([
        {
          classroom_id: data[0].id,
          user_id: request.user.id,
          manager: true,
          role_level: 1, 
          joined_status: 1, 
        },
      ]);

    if (memberError) throw memberError;

    return reply.status(201).send({ success: true, data: data[0] });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

export const joinClassroomHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {

    await authenticate(request, reply);
    if (!request.user) return;

    const { classroomId, joinCode, classPassword } = request.body as {
      classroomId: string;
      joinCode?: string;
      classPassword?: string;
    };

    const { data: classroom, error: classroomError } = await supabase
      .from("classrooms")
      .select("*")
      .eq("id", classroomId)
      .single();

    if (classroomError || !classroom) {
      return reply.status(404).send({ success: false, error: "Classroom not found" });
    }


    if (classroom.access_type === 0) {
      if (classroom.join_method === 0 && classroom.join_code !== joinCode) {
        return reply.status(400).send({ success: false, error: "Invalid join code" });
      }
      if (classroom.join_method === 1 && classroom.class_password !== classPassword) {
        return reply.status(400).send({ success: false, error: "Invalid class password" });
      }
    }

    if (classroom.total_member >= classroom.limit_member) {
      return reply.status(400).send({ success: false, error: "Classroom is full" });
    }

    const { error: insertError } = await supabase
      .from("classroom_members")
      .insert([
        {
          classroom_id: classroomId,
          user_id: request.user.id,
          manager: false,
          role_level: 1, 
          joined_status: 0, 
        },
      ]);

    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from("classrooms")
      .update({ total_member: classroom.total_member + 1 })
      .eq("id", classroomId);

    if (updateError) throw updateError;

    return reply.status(200).send({ success: true, message: `User ${request.user.id} joined classroom ${classroomId}` });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

interface ClassroomMember {
  classroom: {
    id: string;
    name: string;
    description: string;
    cover_image: string;
    total_member: number;
  };
  role_level: number;
  manager: boolean;
}

export const getMyClassroomsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await authenticate(request, reply);
    if (!request.user) return;

    const { data, error } = await supabase
      .from("classroom_members")
      .select(`
        classroom:classrooms (
          id,
          name,
          description,
          cover_image,
          total_member
        ),
        role_level,
        manager
      `)
      .eq("user_id", request.user.id)
      .eq("joined_status", 1); 

    if (error) throw error;

    const classrooms = (data as unknown as ClassroomMember[]).map(item => ({
      id: item.classroom.id,
      name: item.classroom.name,
      description: item.classroom.description,
      cover_image: item.classroom.cover_image,
      total_member: item.classroom.total_member,
      role_level: item.role_level,
      is_manager: item.manager
    }));

    return reply.status(200).send({ success: true, data: classrooms });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ success: false, error: "Internal Server Error" });
  }
};