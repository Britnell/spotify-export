<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllTracks, type Track, type TrackReq } from "./spotify";
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

  const data = await getAllTracks(props.list.id, props.token);
  console.log("tracks ", data);
  tracks.value = data;
});
</script>
<template>
  <div class="flex gap-3">
    <button class="ml-6 bg-blue-100 px-4 py-2" @click="() => emit('close')">
      close
    </button>
    <img :src="list.images[2].url" alt="playlist cover" />
    <div>
      <p>{{ list.name }}</p>
      <p>{{ list.description }}</p>
      <p>{{ list.tracks.total }} tracks</p>
    </div>
  </div>
  <div>
    <div v-if="tracks.length === 0">
      <p>LOADING TRACKS...</p>
    </div>
    <div class="ml-6 my-4">
      <ul>
        <li v-for="t in tracks">
          <div class="flex gap-4">
            <div>
              <img :src="t.track.album?.images[2]?.url" alt="album cover" />
            </div>
            <div>
              <p>
                {{ t.track.name }}
              </p>
              <p>By {{ t.track.artists.map((art) => art.name).join(", ") }}</p>
            </div>
            <div>
              <p>Album</p>
              <p>{{ t.track.album.name }}</p>
              <p>{{ t.track.album.release_date }}</p>
            </div>
          </div>
        </li>
        <li>...</li>
      </ul>
    </div>
  </div>
</template>
