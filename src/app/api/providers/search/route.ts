import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseInt(searchParams.get("radius") || "25");
    const category = searchParams.get("category") || null;

    if (!lat || !lng) {
      // If no geolocation, return all active providers
      const { data, error } = await supabase
        .from("provider_profiles")
        .select(`
          id,
          user_id,
          headline,
          hourly_rate,
          rating_avg,
          rating_count,
          address_text,
          is_verified,
          profiles!inner(full_name, avatar_url),
          provider_services(
            service_categories(name, slug)
          )
        `)
        .eq("is_active", true)
        .order("rating_avg", { ascending: false })
        .limit(20);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const providers = (data || []).map((p: Record<string, unknown>) => ({
        provider_id: p.id,
        user_id: p.user_id,
        full_name: (p.profiles as Record<string, unknown>)?.full_name || "Unknown",
        headline: p.headline,
        hourly_rate: p.hourly_rate,
        rating_avg: p.rating_avg || 0,
        rating_count: p.rating_count || 0,
        avatar_url: (p.profiles as Record<string, unknown>)?.avatar_url || null,
        distance_km: 0,
        is_verified: p.is_verified,
        services: ((p.provider_services as Record<string, unknown>[]) || []).map(
          (ps: Record<string, unknown>) => (ps.service_categories as Record<string, unknown>)?.name
        ),
      }));

      return NextResponse.json({ providers });
    }

    // Use the PostGIS function for nearby search
    const { data, error } = await supabase.rpc("find_nearby_providers", {
      lat,
      lng,
      radius_km: radius,
      category_slug: category,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ providers: data || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
