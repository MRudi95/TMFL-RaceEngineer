<template>
  <h1 class="center">
    [PEPO]licious
    <v-img contain src="@/assets/pepega.png" alt="pepega" height="50" />
    Race Engineer
  </h1>
  <div>
    <div class="horizontal" name="analysisPart">
      <div>
        <input class="vertical" v-model="drivenLaps" />
        <input class="vertical" v-model="restFuel" />
        <input class="vertical" v-model="restTires" />
        <input class="vertical" v-model="lapFrom" />
        <input class="vertical" v-model="lapTo" />
      </div>
      <div>
        <h5>{{ analysis.avgFuel }} l</h5>
        <h5>{{ analysis.avgTires }} %</h5>
        <div>
          <div
            class="vertical"
            v-for="pitOption in analysis.pitOptions"
            :key="pitOption.fuel"
          >
            <table>
              <tr>
                <td>{{ pitOption.lap }}</td>
                <td v-if="pitOption.fuel > 0">{{ pitOption.fuel }}</td>
                <td v-if="pitOption.fuel <= 0">TOT</td>
                <td v-if="pitOption.tires > 0">{{ pitOption.fuel }}</td>
                <td v-if="pitOption.tires <= 0">TOT</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
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
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { calculateStrategy, Strategy } from "@/calculations/strategy";
import { Analysis, calculateAnalysis } from "@/calculations/analysis";

export default defineComponent({
  name: "App",
  components: {},
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


    const drivenLaps = ref(5);
    const restFuel = ref(30);
    const restTires = ref(30);
    const lapFrom = ref(1);
    const lapTo = ref(20);
    const analysis = ref(Analysis());

    watchEffect(() => {
      if (!drivenLaps.value || !restFuel.value || !restTires.value) {
        return;
      }

      if (!lapFrom.value || !lapTo.value) {
        return;
      }

      analysis.value = calculateAnalysis(drivenLaps.value, restFuel.value, restTires.value, lapFrom.value, lapTo.value);
    });

    return {
      racelaps,
      stratsFrom,
      stratsTo,
      stratList,

      drivenLaps,
      restFuel,
      restTires,
      lapFrom,
      lapTo,
      analysis,
    };
  },
});
</script>

<style>
.center {
  text-align: center;
  color: rgb(87, 133, 51);
}

.strats {
  float: left;
}

.horizontal {
  float: left;
  width: 50%;
}

.vertical {
  display: block;
}
</style>
