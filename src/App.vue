<template>
  <v-app>
    <!-- Top Bar -->
    <top-bar />

    <!-- Analysis Part -->
    <v-navigation-drawer app permanent>
      <analysis-component />
    </v-navigation-drawer>

    <!-- Strategy Part -->
    <v-main app>
      <strategy-component/>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import TopBar from "@/components/TopBar.vue"
import AnalysisComponent from "@/components/AnalysisComponent.vue";
import StrategyComponent from "./components/StrategyComponent.vue";

</script>

<style>
html {
  /* hide scrollbar firefox */
  scrollbar-width: none;
}
/* hide scrollbar chrome */
html::-webkit-scrollbar {
  display: none;
}

input {
  color: white;
}




</style>
