<template>
  <v-app>
    <!-- Top Bar -->
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

    <!-- Analysis Part -->
    <v-navigation-drawer app permanent>
      <div class="text-h5 text-center mt-2" justify="center">
        Stint Analysis
      </div>

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
        <div class="text-h5 text-center flex-grow-1">
          {{ analysis.avgTires }} %
        </div>
      </div>

      <!-- Table Part -->
      <div class="mt-12 mb-2">
        <vue-slider
          class="mx-4"
          v-model="lapFromTo"
          :tooltip="'always'"
          :min="1"
          :max="20"
        >
        </vue-slider>
      </div>

      <v-container class="tableSize px-0" align="center">
        <v-row class="headerRow pr-5 mb-1 pl-2">
          <v-col><v-icon>mdi-flag-checkered</v-icon></v-col>
          <v-col><v-icon>mdi-gas-station</v-icon></v-col>
          <v-col><v-icon>mdi-radiobox-marked</v-icon></v-col>
        </v-row>
        <v-container class="tableScrollbar">
          <v-row v-for="pitOption in analysis.pitOptions" :key="pitOption.fuel">
            <v-col> {{ pitOption.lap }} </v-col>
            <v-col>
              <v-card :color="colorsAnalysisTable(pitOption.fuel)">
                <div v-if="pitOption.fuel > 0">{{ pitOption.fuel }} L</div>
                <v-icon v-else> mdi-skull </v-icon>
                <!-- <v-icon v-else> mdi-skull-crossbones </v-icon> -->
              </v-card>
            </v-col>
            <v-col>
              <v-card :color="colorsAnalysisTable(pitOption.tires)">
                <div v-if="pitOption.tires > 0">{{ pitOption.tires }} %</div>
                <v-icon v-else> mdi-skull </v-icon>
                <!-- <v-icon v-else> mdi-skull-crossbones </v-icon> -->
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-navigation-drawer>

    <!-- Strategy Part -->
    <v-main app>
      <v-container>
        <v-row justify="center" align="center">
          <div class="text-h5 text-center mt-2" justify="center">
            Strategy Picker
          </div>
        </v-row>
        <!-- Inputs -->
        <v-row class="mt-12 mb-7" justify="center" align="center">
          <div class="strategyLapsSliderWidth d-flex">
            <!-- <div>Laps</div> -->
            <v-icon>mdi-flag-checkered</v-icon>
            <vue-slider
              class="flex-grow-1 mx-4 pt-3"
              v-model="racelaps"
              :tooltip="'always'"
              :min="20"
              :max="80"
            ></vue-slider>
          </div>
          <div class="mx-5"></div>
          <div class="strategyStopsSliderWidth d-flex">
            <!-- <div>Laps</div> -->
            <v-icon>mdi-bus-stop-covered</v-icon>
            <vue-slider
              class="flex-grow-1 mx-4 pt-3"
              v-model="stopsFromTo"
              :tooltip="'always'"
              :min="2"
              :max="8"
            ></vue-slider>
          </div>
        </v-row>
        <!-- Calculated Strategies -->
        <v-row justify="center">
          <v-card
            class="mx-2"
            elevation="5"
            v-for="strat in stratList"
            :key="strat.strat"
          >
            <v-card-title>{{ strat.strat }} Stops</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-center">
              <div class="text-h6">{{ strat.fuelPerLap }} L</div>
              <div class="text-h6">{{ strat.fuelPerLap }} %</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-title>Strategies</v-card-title>
            <div v-if="strat.stintOptions">
              <v-card
                class="text-center ma-1"
                color="deep-purple"
                v-for="stintOption in strat.stintOptions"
                :key="stintOption"
              >
              <!-- :color="strategyStintColor(stintOption)" -->
              {{ stintOption.join() }}
              </v-card>
            </div>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { calculateBreakpoints, calculateStrategy, StintOption, Strategy } from "@/calculations/strategy";
import { Analysis, calculateAnalysis } from "@/calculations/analysis";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/material.css";

export default defineComponent({
  name: "App",
  components: {
    VueSlider,
  },
  setup() {
    const racelaps = ref(50);
    const stopsFromTo = ref([3, 6]);
    const stratList = ref(Array<Strategy>());

    watchEffect(() => {
      stratList.value = [];
      for (let index = stopsFromTo.value[0]; index <= stopsFromTo.value[1]; index++) {
        stratList.value.push(calculateStrategy(racelaps.value, index));
      }
    });


    const drivenLaps = ref(10);
    const restFuel = ref(80);
    const restTires = ref(80);
    const lapFromTo = ref([5, 15]);
    const analysis = ref(Analysis());

    watchEffect(() => {
      if (!drivenLaps.value || !restFuel.value || !restTires.value) {
        return;
      }

      analysis.value = calculateAnalysis(drivenLaps.value, restFuel.value, restTires.value, lapFromTo.value[0], lapFromTo.value[1]);
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

    function strategyStintColor(stintOption: StintOption) {
      const longestStint = stintOption[0];
      const defaultColor = "brown";
      console.log(analysisBreakpoints.value);
      if(longestStint == analysisBreakpoints.value.thirtyBreakpointRisky){
        return "teal"
      }
      if(longestStint == analysisBreakpoints.value.thirtyBreakpointSave){
        return "green"
      }

      if(analysisBreakpoints.value.zeroBreakpointRisky < 0){
        return defaultColor;
      }
      if(longestStint > analysisBreakpoints.value.zeroBreakpointRisky){
        return "black";
      }
      if(longestStint == analysisBreakpoints.value.zeroBreakpointRisky){
        return "purple"
      }
      if(longestStint == analysisBreakpoints.value.zeroBreakpointSave){
        return "pink"
      }

      return defaultColor;
    };

    const analysisBreakpoints = computed(() => {
      return calculateBreakpoints(analysis.value);
    });

    return {
      racelaps,
      stopsFromTo,
      stratList,
      strategyStintColor,

      drivenLaps,
      restFuel,
      restTires,
      lapFromTo,
      analysis,
      colorsAnalysisSlider,
      colorsAnalysisTable,
    };
  },
});
</script>

<style>
html{
  /* hide scrollbar firefox */
  scrollbar-width: none;
}
/* hide scrollbar chrome */
html::-webkit-scrollbar{
  display: none;
}

input {
  color: white;
}

.pepo_gray {
  color: #c1c1c1;
}

.pepo_green {
  color: rgb(87, 133, 51);
}

.pepo_link {
  text-decoration: none;
}

/* figure height for table to fit to screen */
/* figure out why the scrollbar on the right is always there */

.tableScrollbar {
  overflow: auto;
  height: 45vh;
  /* hide scrollbar firefox */
  scrollbar-width: none;
}
/* hide scrollbar chrome */
.tableScrollbar::-webkit-scrollbar{ 
  /* display: none; */
}

.headerRow {
  background: #404040;
}

.strategyLapsSliderWidth {
  width: 25vw;
}

.strategyStopsSliderWidth {
  width: 15vw;
}
</style>
