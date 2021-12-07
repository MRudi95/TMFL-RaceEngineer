<template>
  <div>
    <div class="text-h5 text-center mt-2" justify="center">Stint Analysis</div>

    <div class="d-flex mt-9 ml-1">
      <!-- <div>Laps</div> -->
      <v-icon>mdi-flag-checkered</v-icon>
      <vue-slider
        class="flex-grow-1 mx-4 pt-3"
        v-model="drivenLaps"
        :tooltip="'always'"
        :min="1"
        :max="15"
      ></vue-slider>
    </div>

    <div class="d-flex mt-9 ml-1">
      <!-- <div>Fuel</div> -->
      <v-icon>mdi-gas-station</v-icon>
      <vue-slider
        class="flex-grow-1 mx-4 pt-3"
        v-model="restFuel"
        :tooltip="'always'"
        :min="0"
        :max="100"
        :interval="0.1"
        :process="colorsAnalysisSlider"
      >
        <template v-slot:tooltip>
          <v-avatar color="primary" size="30" rounded>
            <input class="text-caption text-center" v-model="restFuel" />
          </v-avatar>
        </template>
      </vue-slider>
    </div>

    <div class="d-flex mt-9 ml-1">
      <!-- <div>Tires</div> -->
      <v-icon>mdi-radiobox-marked</v-icon>
      <vue-slider
        class="flex-grow-1 mx-4 pt-3"
        v-model="restTires"
        :tooltip="'always'"
        :min="0"
        :max="100"
        :interval="0.1"
        :process="colorsAnalysisSlider"
      >
        <template v-slot:tooltip>
          <v-avatar color="primary" size="30" rounded>
            <input class="text-caption text-center" v-model="restTires" />
          </v-avatar>
        </template>
      </vue-slider>
    </div>

    <div class="d-flex mt-5 ml-1 text-center">
      <div class="text-h6">Ø Fuel/Lap</div>
      <div class="text-h5 flex-grow-1">{{ analysis.avgFuel }} L</div>
    </div>

    <div class="d-flex mt-5 ml-1">
      <div class="text-h6 text-center">Ø Tires/Lap</div>
      <div class="text-h5 text-center flex-grow-1">{{ analysis.avgTires }} %</div>
    </div>

    <!-- Table Part -->
    <div class="mt-12 mb-2">
      <vue-slider class="mx-4" v-model="lapFromTo" :tooltip="'always'" :min="1" :max="20"></vue-slider>
    </div>
    <v-container class="tableSize px-0" align="center">
      <v-row class="headerRow pr-5 mb-1 pl-2">
        <v-col>
          <v-icon>mdi-flag-checkered</v-icon>
        </v-col>
        <v-col>
          <v-icon>mdi-gas-station</v-icon>
        </v-col>
        <v-col>
          <v-icon>mdi-radiobox-marked</v-icon>
        </v-col>
      </v-row>
      <v-container class="tableScrollbar">
        <v-row v-for="pitOption in analysis.pitOptions" :key="pitOption.fuel">
          <v-col>{{ pitOption.lap }}</v-col>
          <v-col>
            <v-card :color="colorsAnalysisTable(pitOption.fuel)">
              <div v-if="pitOption.fuel > 0">{{ pitOption.fuel }} L</div>
              <v-icon v-else>mdi-skull</v-icon>
              <!-- <v-icon v-else> mdi-skull-crossbones </v-icon> -->
            </v-card>
          </v-col>
          <v-col>
            <v-card :color="colorsAnalysisTable(pitOption.tires)">
              <div v-if="pitOption.tires > 0">{{ pitOption.tires }} %</div>
              <v-icon v-else>mdi-skull</v-icon>
              <!-- <v-icon v-else> mdi-skull-crossbones </v-icon> -->
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script setup lang=ts>
import { watchEffect, ref } from '@vue/runtime-core';
import { Analysis, calculateAnalysis } from "@/calculations/analysis";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/material.css";
import { useStore } from 'vuex';

const store = useStore()

const drivenLaps = ref(10);
const restFuel = ref(80);
const restTires = ref(80);
const lapFromTo = ref([5, 15]);
const analysis = ref(Analysis());

//sanitize input for fuel and tires
watchEffect(() => {
  if (!drivenLaps.value || !restFuel.value || !restTires.value) {
    return;
  }

  analysis.value = calculateAnalysis(drivenLaps.value, restFuel.value, restTires.value, lapFromTo.value[0], lapFromTo.value[1]);
  store.commit("SET_ANALYSIS", analysis.value)
});

function colorsAnalysisSlider(dotPosition: number[]) {
  const position = dotPosition[0];
  const color = checkWhichColor(position);

  return [[0, dotPosition[0], { backgroundColor: color }]]
}

function colorsAnalysisTable(value: number) {
  const color = checkWhichColor(value);
  return color;
}

function checkWhichColor(value: number) {
  let color = "";
  if (value <= 0) {
    color = "black";
  } else if (value <= 30) {
    color = "red";
  } else if (value <= 50) {
    color = "amber";
  } else {
    color = "green"
  }
  return color;
}

</script>

<style lang="scss">
.tableScrollbar {
  overflow: auto;
  height: 45vh;
  /* hide scrollbar firefox */
  scrollbar-width: none;
}
/* hide scrollbar chrome */
.tableScrollbar::-webkit-scrollbar {
  display: none;
}

.headerRow {
  background: #404040;
}
</style>