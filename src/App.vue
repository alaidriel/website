<script>
import GitHub from "./components/GitHub.vue";
import Mastodon from "./components/Mastodon.vue";

export default {
  components: {
    GitHub,
    Mastodon,
  },
};
</script>

<template>
  <h1 class="container mx-auto p-10 max-w-screen-md">
    <div
      class="flex flex-col justify-center items-center align-center pt-[20vh]"
    >
      <figure class="aspect-square">
        <img
          class="rounded-full"
          alt="Alaina"
          src="https://avatars.githubusercontent.com/u/68250402?v=4"
          width="120"
          height="120"
        />
      </figure>
      <div class="text-center pt-4 max-w-md">
        <h1 class="pb-2 text-3xl text-ctp-text font-bold font-serif">Alaina</h1>
        <h2 class="text-xl font-medium text-ctp-subtext-1">@alaidriel</h2>
        <div class="pt-2 text-md text-ctp-subtext0">
          Hi! I'm Alaina, or Aly (she/her 🏳️‍⚧️), a trans girl enamored with cs with a passion for programming.
          There isn't much here~
        </div>
      </div>
      <div class="flex flex-row space-x-3 pt-4">
        <a
          href="https://github.com/alaidriel"
          class="rounded-md bg-ctp-surface0 transition-all p-1 pt-[7px] w-10 h-10 hover:bg-ctp-overlay0 text-center"
          aria-label="GitHub"
          target="_blank"
        >
          <GitHub />
        </a>
        <a
          href="https://tech.lgbt/@alyaura"
          class="rounded-md bg-ctp-surface0 transition-all p-1 pt-[7px] w-10 h-10 hover:bg-ctp-overlay0 text-center"
          aria-label="Mastodon"
          target="_blank"
        >
          <Mastodon />
        </a>
      </div>
    </div>
  </h1>
</template>

<style>
html,
body {
  @apply text-ctp-text bg-ctp-base;
}
</style>
