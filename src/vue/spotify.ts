const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const redirect_uri = import.meta.env.SPOTIFY_REDIRECT_URI;

export interface Track {
  track: {
    name: string;
    artists: {
      name: string;
    }[];
    album: {
      name: string;
      artists: any;
      images: {
        url: string;
      }[];
      release_date: string;
      total_tracks: number;
      type: string;
      preview_url: string;
    };
  };
}
export interface TrackReq {
  items: Track[];
  next: string | null;
  total: number;
  offset: number;
  limit: number;
}

export function spotifyLoginURL(): string {
  const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
  ];

  return (
    "https://accounts.spotify.com/authorize" +
    "?client_id=" +
    client_id +
    "&response_type=token" +
    "&redirect_uri=" +
    encodeURIComponent(redirect_uri + "/app") +
    "&scope=" +
    scopes.join("%20") +
    "&state=listening-101"
  );
}

export function loadHashToken() {
  let hash = window.location.hash,
    i;
  if (!hash) return "";
  i = hash.indexOf("access_token");
  if (i === -1) return "";
  let beg = hash.indexOf("=", i) + 1;
  let end = hash.indexOf("&", beg);
  if (beg === -1 || end === -1) return "";
  return hash.slice(beg, end);
}

export function spotifyQuery(url: string, token: string) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((resp) => {
    if (resp.status === 200) return resp.json();

    // if (resp.status === 204) return { error: "silence" };

    if (resp.status === 401) {
      // EXPIRED
      window.location.href = "/";
      return { error: "expired" };
    }
    if (resp.status === 403) {
      // Bad OAuth request
    }
    if (resp.status === 429) {
      // exceeded rate limits
    }
    return { error: resp.status };
  });
}

export async function getAllTracks(id: string, token: string) {
  let data: Track[] = [];
  let done = false;

  // https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
  let req = await spotifyQuery(
    `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50`,
    token
  );
  data = data.concat(req.items);

  while (!done) {
    if (req.next === null) {
      done = true;
    } else {
      req = await spotifyQuery(req.next, token);
      console.log("x", req);
      data = data.concat(req.items);
    }
  }
  return data;
}

export const getTrackArtists = (t: Track) =>
  t.track.artists.map((art) => art.name);

export const soundcloudSearch = (t: Track) =>
  `https://soundcloud.com/search/sounds?q=` +
  encodeURIComponent([t.track.name, getTrackArtists(t).join(" ")].join(" "));

export const bandcampSearch = (t: Track) =>
  `https://bandcamp.com/search?item_type=b&q=${encodeURIComponent(
    getTrackArtists(t).join(" ")
  )}`;
// artist + album // `https://bandcamp.com/search?q=` + encodeURIComponent(   [getTrackArtists(t).join(" "), t.track.album.name].join(" ") );
