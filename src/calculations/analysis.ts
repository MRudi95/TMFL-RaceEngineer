export interface Analysis{
    avgFuel: number;
    avgTires: number;
    pitOptions: PitOption[];
}

interface PitOption{
    lap: number;
    fuel: number;
    tires: number;
}

export function Analysis(): Analysis {
  return {
    avgFuel: Number(),
    avgTires: Number(),
    pitOptions: Array<PitOption>(),
  };
}

export function calculateAnalysis(lap: number, fuel: number, tires: number, lapFrom: number, lapTo: number): Analysis {
  const avgFuel = calculateAverage(lap, fuel);
  const avgTires = calculateAverage(lap, tires);

  const pitOptions = calculatePitOptions(lapFrom, lapTo, avgFuel, avgTires);

  return {
    avgFuel: Number(avgFuel.toFixed(2)),
    avgTires: Number(avgTires.toFixed(2)),
    pitOptions,
  };
}

function calculatePitOptions(lapFrom: number, lapTo: number, avgFuel: number, avgTires: number): Array<PitOption> {
  const pitOptions = Array<PitOption>();

  for (let index = Number(lapFrom); index <= lapTo; index++) {
    pitOptions.push({
      lap: index,
      fuel: Number(calculateRest(index, avgFuel).toFixed(1)),
      tires: Number(calculateRest(index, avgTires).toFixed(1)),
    });
  }
  return pitOptions;
}

function calculateAverage(lap: number, fuelOrTires: number): number {
  return (100 - fuelOrTires) / lap;
}

function calculateRest(lap: number, fuelOrTires: number): number {
  return 100 - fuelOrTires * lap;
}
