import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase environment variables are missing");
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    realtime: {
      transport: ws,
    },
  }
);

export default supabase;