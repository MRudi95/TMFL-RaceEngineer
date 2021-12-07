<template>
    <v-card class="mx-2" elevation="5">
        <v-card-title>{{ strat.strat }} Stops</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="text-center">
            <div class="text-h6">{{ strat.fuelPerLap }} L</div>
            <div class="text-h6">{{ strat.fuelPerLap }} %</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-title>Strategies</v-card-title>
        <v-card
            class="text-center ma-1"
            :color="strategyStintColor(stintOption)"
            v-for="stintOption in strat.stintPossibilities"
            :key="stintOption"
        >{{ stintOption.join() }}</v-card>
    </v-card>
</template>

<script setup lang="ts">
import { calculateStrategyType, StintPossibility, Strategy, strategyTypes } from '@/calculations/strategy'
import { ref, watchEffect } from 'vue';
import { useStore } from 'vuex';

const props = defineProps<{
    strat: Required<Strategy>
}>();

const store = useStore()
const analysis = ref(store.state.analysis)

watchEffect(() => {
    analysis.value = store.state.analysis;
})

function strategyStintColor(stintPossibility: StintPossibility) {
    const longestStint = stintPossibility[0];
    const strat: strategyTypes = calculateStrategyType(longestStint, analysis.value.avgFuel, analysis.value.avgTires);
    if (strat == strategyTypes.whatever) {
        return "brown";
    }
    if (strat == strategyTypes.dead) {
        return "black";
    }
    if (strat == strategyTypes.zeroRisky) {
        return "purple";
    }
    if (strat == strategyTypes.zeroSave) {
        return "pink";
    }
    if (strat == strategyTypes.thirtyRisky) {
        return "green";
    }
    if (strat == strategyTypes.thirtySave) {
        return "teal";
    }
}
</script>

<style>
</style>