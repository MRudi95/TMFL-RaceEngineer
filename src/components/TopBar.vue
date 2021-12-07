<template>
    <v-app-bar app>
      <a href="https://trackmania-formula-league.com">
        <v-img src="@/assets/tmfl_logo.png" width="12em"> </v-img>
      </a>
      <v-row justify="center" align="center">
        <a
          class="text-h3 pepo_green pepo_link"
          href="https://www.trackmania-formula-league.com/team/?view_team=463"
        >
          [PEPO]
        </a>
        <div class="text-h3 pepo_gray">licious</div>
        <v-img
          contain
          src="@/assets/pepega.png"
          alt="pepega"
          height="55"
          max-width="150"
        />
        <div class="text-h3 pepo_gray">Race Engineer</div>
      </v-row>
    </v-app-bar>
</template>

<script setup lang="ts">

</script>

<style>
.pepo_gray {
  color: #c1c1c1;
}

.pepo_green {
  color: rgb(87, 133, 51);
}

.pepo_link {
  text-decoration: none;
}
</style>