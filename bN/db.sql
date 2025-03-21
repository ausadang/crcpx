-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated;

-- Grant future permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),  
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role_level INT NOT NULL DEFAULT 2, -- 0=root, 1=admin, 2=user
  refresh_token TEXT,  -- ถ้าเป็นค่า null หมายถึงยังไม่ได้ login
  created_at TIMESTAMP DEFAULT NOW(), 
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE classrooms (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image TEXT,
  banner_image TEXT,
  access_type INT NOT NULL DEFAULT 0, -- 0=private, 1=public
  join_method INT NOT NULL DEFAULT 0, -- 0=on password, 1=password in case public only 
  join_code VARCHAR(10) UNIQUE, 
  class_password TEXT, -- if join method == 1 จะเก็บ password ที่ต้องการให้มีการเข้าถึงห้อง
  limit_member INT CHECK (limit_member > 0) DEFAULT 50, -- จำกัดจำนวนสมาชิก
  total_member INT NOT NULL DEFAULT 0 CHECK (total_member >= 0), -- ป้องกันค่าติดลบ
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- ถ้าเจ้าของลบ acc ห้องนี้จะถูกลบไปด้วย
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE classroom_members (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  manager BOOLEAN NOT NULL DEFAULT FALSE, -- 0 is not Manager , 1 is Manager 
  role_level INT NOT NULL DEFAULT 1, --0=teacher, 1=student 
  joined_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assignments (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  attachment TEXT[], 
  due_date TIMESTAMP NOT NULL,
  max_score INT NOT NULL DEFAULT 100,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE sub_assignments (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT[], 
  submit_text TEXT, 
  submitted_at TIMESTAMP DEFAULT NOW(),
  graded BOOLEAN DEFAULT FALSE,
  score INT CHECK (score >= 0),
  graded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  graded_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment TEXT[], -- เก็บไฟล์แนบ (ถ้ามี)
  post_type INT NOT NULL DEFAULT 0, -- 0=ทั่วไป, 1=ประกาศ, 2=แบบสอบถาม
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dm (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- ฝั่งที่ 1
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- ฝั่งที่ 2
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  no BIGSERIAL PRIMARY KEY,
  id UUID UNIQUE DEFAULT uuid_generate_v4(),
  dm_id UUID REFERENCES dm(id) ON DELETE CASCADE, -- ถ้าเป็นแชทส่วนตัว
  group_id UUID REFERENCES classrooms(id) ON DELETE CASCADE, -- ถ้าเป็นแชทกลุ่ม
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- คนส่ง
  content TEXT NOT NULL,
  attachment TEXT[], -- ไฟล์แนบ เช่น รูป, วิดีโอ
  seen BOOLEAN DEFAULT FALSE, -- ข้อความถูกอ่านหรือยัง
  created_at TIMESTAMP DEFAULT NOW()
);

-- ดัชนีช่วยให้ค้นหาเร็วขึ้น
CREATE INDEX idx_messages_dm ON messages(dm_id);
CREATE INDEX idx_messages_group ON messages(group_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);


CREATE UNIQUE INDEX unique_dm_users ON dm(LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);

CREATE INDEX idx_posts_classroom ON posts(classroom_id);
CREATE INDEX idx_posts_user ON posts(user_id);

CREATE INDEX idx_assignments_classroom ON assignments(classroom_id);
CREATE INDEX idx_assignments_creator ON assignments(created_by);

CREATE INDEX idx_sub_assignments_assignment ON sub_assignments(assignment_id);
CREATE INDEX idx_sub_assignments_student ON sub_assignments(student_id);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_classrooms_owner_id ON classrooms(owner_id);

CREATE INDEX idx_classroom_members_user_id ON classroom_members(user_id);
CREATE INDEX idx_classroom_members_classroom_id ON classroom_members(classroom_id);
