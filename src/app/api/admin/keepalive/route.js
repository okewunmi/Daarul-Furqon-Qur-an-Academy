import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL, 
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Lightweight ping — query any small table you have
    const { error } = await supabase.from("students").select("id").limit(1);

    if (error) throw error;

    return Response.json({ status: "ok", service: "supabase" });
  } catch (err) {
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
}