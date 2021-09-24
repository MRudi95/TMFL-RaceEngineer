<template>
  <v-app>
    <v-app-bar app>
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
        <div class="text-h6">Ø Fuel</div>
        <div class="text-h5 flex-grow-1">{{ analysis.avgFuel }} L</div>
      </div>

      <div class="d-flex mt-5 ml-1">
        <div class="text-h6 text-center">Ø Tires</div>
        <div class="text-h5 text-center flex-grow-1">
          {{ analysis.avgTires }} %
        </div>
      </div>

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
            <!-- put cards into columns => then put color changer in cards -->
            <v-col>
              {{ pitOption.lap }}
            </v-col>
            <v-col>
               {{ pitOption.fuel }} L 
            </v-col>
            <v-col> 
              {{ pitOption.tires }} % 
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-navigation-drawer>

    <div>
      <div class="horizontal" name="strategyPart">
        <div>
          <input v-model="racelaps" />
          <input v-model="stratsFrom" />
          <input v-model="stratsTo" />
        </div>
        <div class="strats" v-for="strat in stratList" :key="strat.strat">
          <h4>{{ strat.strat }} Stops</h4>
          <h5>{{ strat.fuelPerLap }} l</h5>
          <h5>{{ strat.fuelPerLap }} %</h5>
          <h4>Stintoptions</h4>
          <div v-if="strat.stintOptions">
            <button
              class="vertical"
              v-for="stintOption in strat.stintOptions"
              :key="stintOption"
            >
              {{ stintOption.join() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { calculateStrategy, Strategy } from "@/calculations/strategy";
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
    const stratsFrom = ref(3);
    const stratsTo = ref(6);
    const stratList = ref(Array<Strategy>());

    watchEffect(() => {
      if (!stratsFrom.value || !stratsTo.value) {
        return;
      }

      if (racelaps.value < 10 || racelaps.value > 100) {
        return;
      }

      stratList.value = [];
      for (let index = Number(stratsFrom.value); index <= stratsTo.value; index++) {
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
        color = "yellow";
      } else {
        color = "green"
      }
      return color;
    }

    return {
      racelaps,
      stratsFrom,
      stratsTo,
      stratList,

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

.tableScrollbar {
  overflow: auto;
  height: 45vh;
}

.headerRow {
  background: #404040;
}
</style>
