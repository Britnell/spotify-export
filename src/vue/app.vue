<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { loadHashToken, spotifyQuery } from "./spotify";
import Playlists from "./Playlists.vue";
import Detail from "./Detail.vue";

const token = ref<string | null>(null);
const showing = ref(null);

onMounted(() => {
  const hashtoken = loadHashToken();
  if (hashtoken) {
    token.value = hashtoken;
    localStorage?.setItem("token", hashtoken);
    return;
  }

  const cached = localStorage?.getItem("token");
  if (cached) {
    token.value = cached;
    return;
  }

  console.error(" plase login");
});

const openPl = (ev: any) => {
  showing.value = ev;
};
</script>
<template>
  <h2>Spotify Exporter</h2>
  <div v-if="token">
    <div v-if="!showing">
      <Playlists :token="token" @open="openPl" />
    </div>
    <div v-if="showing">
      <Detail :token="token" :list="showing" @close="() => (showing = null)" />
    </div>
  </div>
</template>
