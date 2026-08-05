import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Spotify auth failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
    const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "Spotify API anahtarı yapılandırılmamış. Ayarlardan ekleyin." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const action = url.searchParams.get("action") || "search";

    if (action === "search") {
      if (!query) {
        return new Response(
          JSON.stringify({ error: "Arama sorgusu gerekli" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const token = await getAccessToken(clientId, clientSecret);

      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=15`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!searchRes.ok) {
        const errText = await searchRes.text();
        throw new Error(`Spotify search failed (${searchRes.status}): ${errText}`);
      }

      const searchData = await searchRes.json();

      const tracks: SpotifyTrack[] = (searchData.tracks?.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists?.map((a: any) => a.name).join(", ") || "Bilinmeyen",
        album: item.album?.name || "",
        albumArt: item.album?.images?.[0]?.url || "",
        previewUrl: item.preview_url,
        spotifyUrl: item.external_urls?.spotify || "",
      }));

      return new Response(
        JSON.stringify({ tracks }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Bilinmeyen işlem" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Sunucu hatası" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
