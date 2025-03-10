import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  // Simple content-type header is all we need
  const headers = { "Content-Type": "application/json" };

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const sortBy = url.searchParams.get("sort_by") || "date_added";
    const sortOrder = url.searchParams.get("sort_order") === "asc" ? true : false; // Default to false/descending


    // Handle GET request
    if (req.method === "GET") {
      if (userId) {
        const { data, error } = await supabase
            .from("expenses")
            .select("*")
            .eq("user_id", userId)
            .order(sortBy, { ascending: sortOrder });

        if (error) throw error;
        return new Response(JSON.stringify(data), { headers });
      } else {
        const { data, error } = await supabase
            .from("expenses")
            .select("*")
            .order(sortBy, { ascending: sortOrder });

        if (error) throw error;
        return new Response(JSON.stringify(data), { headers });
      }
    }

    // Handle POST request - add expense
    if (req.method === "POST") {
      const {description, category, amount, user_id} = await req.json();
      const { error } = await supabase.from("expenses").insert([{description, category, amount, user_id}]);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true}), { headers });
    }

    // Handle PUT request - update expense // CHECK THIS!!
    if (req.method === "PUT") {
      const { id, description, category, amount} = await req.json();
      const { error } = await supabase
          .from("expenses")
          .update({description, category, amount})
          .eq("id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true}), { headers });
    }

    // Handle DELETE request - delete expense
    if (req.method === "DELETE") {
      const { id } = await req.json();
      const { error } = await supabase
          .from("expenses")
          .delete()
          .eq("id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true}), { headers });
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers
    });

  }
  catch (error) {
    const errorExpense = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorExpense }), {
      status: 500,
      headers
    });
  }
});