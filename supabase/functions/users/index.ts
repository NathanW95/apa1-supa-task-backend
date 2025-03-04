import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  const headers = { "Content-Type": "application/json" };

  try {
    // Parse URL and query parameters
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    // Handle GET request
    if (req.method === "GET") {
      if (username) {
        const {error } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers });
      }
    }

    // Handle POST request - add user
    if (req.method === "POST") {
      const { username, password } = await req.json();
      const { error } = await supabase.from("users").insert([{ username, password }]);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // Handle PUT request - update user
    if (req.method === "PUT") {
      const { username, password } = await req.json();
      const { error } = await supabase
        .from("users")
        .update({ username, password })
        .eq("username", username);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // Handle DELETE request - delete user
    if (req.method === "DELETE") {
      const { id } = await req.json();
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("user_id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers
    });

  } catch (error) {
    const errorExpense = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorExpense }), {
      status: 500,
      headers
    });
  }
});