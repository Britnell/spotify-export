<script setup lang="ts">
import { onMounted, ref } from "vue";
import { spotifyQuery } from "./spotify";

const emit = defineEmits(["open"]);

const props = defineProps(["token"]);

export interface Playlist {
  id: string;
  description: string;
  name: string;
  images: {
    url: string;
  }[];
  tracks: {
    href: string;
    total: number;
  };
}
const list = ref<Playlist[]>([]);

onMounted(async () => {
  const resp = await spotifyQuery(
    "https://api.spotify.com/v1/me/playlists",
    props.token
  );
  // console.log(resp.items);
  if (resp?.items) list.value = resp?.items;
});
</script>
<template>
  <ul v-for="pl in list">
    <li @click="() => emit('open', pl)" class="flex gap-4">
      <span>
        <img :src="pl.images[2]?.url" alt="playlist image" class="w-20" />
      </span>
      <div class="max-w-[400px]">
        <p>
          {{ pl.name }}
        </p>
        <p>
          {{ pl.description }}
        </p>
      </div>
      <span>{{ `${pl.tracks.total} tracks` }}</span>
    </li>
  </ul>
</template>
