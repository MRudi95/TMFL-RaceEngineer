<template>
    <v-container>
        <v-row justify="center" align="center">
            <div class="text-h5 text-center mt-2" justify="center">Strategy Picker</div>
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
            <StrategyCard v-for="strat in stratList" :key="strat.strat" :strat="strat"></StrategyCard>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { calculateStrategy, Strategy } from "@/calculations/strategy";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/material.css";
import StrategyCard from "./StrategyCard.vue";


const racelaps = ref(50);
const stopsFromTo = ref([3, 6]);
const stratList = ref(Array<Required<Strategy>>());


watchEffect(() => {
    stratList.value = [];
    for (let index = stopsFromTo.value[0]; index <= stopsFromTo.value[1]; index++) {
        stratList.value.push(calculateStrategy(racelaps.value, index));
    }
});
</script>

<style lang="scss">
.strategyLapsSliderWidth {
    width: 25vw;
}

.strategyStopsSliderWidth {
    width: 15vw;
}
</style>