//db.ts

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("❌ Supabase URL and Key are required. Check your .env file.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;

