<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  spotifyQuery,
  soundcloudSearch,
  type Track,
  type TrackReq,
  getTrackArtists,
  bandcampSearch,
} from "./spotify";
import type { Playlist } from "./Playlists.vue";

const emit = defineEmits(["close"]);
interface Props {
  token: string;
  list: Playlist;
}
const props = defineProps<Props>();

const tracks = ref<Track[]>([]);

onMounted(async () => {
  if (!props.list) return;
  console.log("List", props.list);

  let done = false;
  let req = await spotifyQuery(
    `https://api.spotify.com/v1/playlists/${props.list.id}/tracks?limit=50`,
    props.token
  );
  tracks.value = req.items;
  console.log(req.items[0]);

  while (!done) {
    if (req.next === null) {
      done = true;
    } else {
      req = await spotifyQuery(req.next, props.token);
      tracks.value = [...tracks.value, ...req.items]; // data = data.concat(req.items);
    }
  }
});
</script>
<template>
  <div class="max-w-[800px] mx-auto">
    <h2>Playlist</h2>
    <div class="flex gap-3">
      <img :src="list.images[2].url" alt="playlist cover" />
      <div>
        <p>{{ list.name }}</p>
        <p>{{ list.description }}</p>
        <p>{{ list.tracks.total }} tracks</p>
      </div>
      <button
        class="ml-auto bg-blue-100 px-4 py-2"
        @click="() => emit('close')"
      >
        back
      </button>
    </div>
  </div>
  <div>
    <div>
      <p>Just save this page fo reference with images</p>
    </div>
    <div>
      <p>or export <button class="bg-gray-200 px-2 py-1">as 'csv'</button></p>
    </div>
  </div>
  <div>
    <div v-if="tracks.length === 0">
      <p>LOADING TRACKS...</p>
    </div>
    <div class="ml-6 my-4">
      <ul>
        <div
          class="mb-6 grid grid-cols-[64px_repeat(2,minmax(auto,300px))_auto] gap-4"
        >
          <p></p>
          <p>track & artist</p>
          <p>album</p>
          <p>find it</p>
        </div>
        <li v-for="t in tracks">
          <div
            class="mb-3 grid grid-cols-[64px_repeat(2,minmax(auto,300px))_auto] gap-4"
          >
            <div>
              <img :src="t.track.album?.images[2]?.url" alt="album cover" />
            </div>
            <div class="">
              <p class="text-2xl">
                {{ t.track.name }}
              </p>
              <p class="text-xl">
                <span>
                  <a
                    v-for="art in getTrackArtists(t)"
                    :href="`https://bandcamp.com/search?item_type=b&q=${art}`"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="underline"
                    >{{ art }}</a
                  >
                </span>
              </p>
              <!-- <p>By {{ getTrackArtists(t).join(", ") }}</p> -->
            </div>
            <div class="">
              <p>
                <a
                  :href="`https://bandcamp.com/search?item_type=a&q=${encodeURIComponent(
                    [t.track.artists[0].name, t.track.album.name].join(' ')
                  )}`"
                  target="_blank"
                  rel="noreferrer noopener"
                  class="text-lg underline"
                >
                  {{ t.track.album.name }}
                </a>
              </p>
              <p class="text-black text-opacity-60">
                {{ t.track.album.release_date }}
              </p>
            </div>
            <div class="flex flex-wrap gap-4">
              <a
                :href="soundcloudSearch(t)"
                target="_blank"
                rel="noreferrer noopener"
                class="text-[.9rem] underline text-black text-opacity-60"
                >soundcloud</a
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
