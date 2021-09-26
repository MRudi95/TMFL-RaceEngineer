import { Analysis } from "./analysis";

export interface Strategy {
  strat: number;
  numOfStints: number;
  numOfLaps: number;

  lapsPerStint?: number;
  remainingLaps?: number;
  fuelPerLap?: number;
  stintOptions?: StintOption[];
}

export type StintOption = number[];

//has the lapnumbers, for when 30% fuel/tires and 0% fuel/tires are reached
export interface Breakpoints {
  thirtyBreakpointRisky: number;
  thirtyBreakpointSave: number;
  zeroBreakpointRisky: number;
  zeroBreakpointSave: number;
}

export function calculateStrategy(numOfLaps: number, stratNum: number): Strategy {
  // initialize strategy
  const strategy: Strategy = {
    strat: stratNum,
    numOfStints: stratNum + 1,
    numOfLaps,
  };

  // calculate rest of the strategy
  calculateLaps(strategy);
  calculateFuelPerLap(strategy);
  calculateStintOptions(strategy);

  return strategy;
}

function calculateLaps(strategy: Strategy): void {
  strategy.lapsPerStint = Math.floor(strategy.numOfLaps / strategy.numOfStints);
  strategy.remainingLaps = strategy.numOfLaps % strategy.numOfStints;
}

function calculateFuelPerLap(strategy: Strategy): void {
  if (!strategy.lapsPerStint || strategy.remainingLaps == undefined) {
    return;
  }

  let fuelPerLap;
  if (strategy.remainingLaps == 0) {
    fuelPerLap = 100 / strategy.lapsPerStint;
  } else {
    fuelPerLap = 100 / (strategy.lapsPerStint + 1);
  }

  strategy.fuelPerLap = parseFloat(fuelPerLap.toFixed(1));
}

function calculateStintOptions(strategy: Strategy): void {
  if (strategy.remainingLaps == undefined) {
    return;
  }

  // ex.: 4 stints with 13 laps per stint => [13,13,13,13]
  const baseStints: number[] = new Array(strategy.numOfStints).fill(strategy.lapsPerStint);
  // gets the possible combinations for the remaining laps
  const combinations: number[][] = findCombinations(strategy.remainingLaps);

  // adds the possible combinations onto the basestints
  const stintOptions: StintOption[] = [];
  combinations.forEach((comb) => {
    stintOptions.push(baseStints.map((num, idx) => num + (comb[idx] | 0)));
  });

  strategy.stintOptions = stintOptions;
}

// finds the combinations of the remaining laps: 3 laps => [[1,1,1],[2,1],[3]]
function findCombinations(n: number): number[][] {
  const helperArray: number[] = [];
  const outputArray: number[][] = [];

  findCombinationsUtil(helperArray, 0, n, n, outputArray);

  return outputArray;
}

// wow such recursion, so nice ... thx mr. google
function findCombinationsUtil(helperArray: number[], index: number, num: number, reducedNum: number, outputArray: number[][]) {
  if (reducedNum < 0) { return; }
  if (reducedNum == 0) {
    outputArray.push(helperArray.slice(0, index).reverse());
    return;
  }

  const prev = (index == 0) ? 1 : helperArray[index - 1];

  for (let k = prev; k <= num; k++) {
    helperArray[index] = k;
    findCombinationsUtil(helperArray, index + 1, num, reducedNum - k, outputArray);
  }
}

//rework later to not use the pitoptions, but just avgFuel/avgTires and the stintOptions
//filters still need adjustment
export function calculateBreakpoints(analysis: Analysis): Breakpoints {
  //filter out all options below 0% and options that still have enough for more laps
  //seems good
  const filterZero = analysis.pitOptions.filter((pitOption) => {
    return pitOption.fuel > 0 && pitOption.tires > 0
      && (pitOption.fuel - analysis.avgFuel <= 0 || pitOption.tires - analysis.avgTires <= 0);
  });
  const zeroBreakpoint = filterZero.pop()?.lap || -1;

  //filter out all options that go more than one lap below 30% and options that still have enough for more laps
  //needs work ... description is shit
  const filterThirty = analysis.pitOptions.filter((pitOption) => {
    return pitOption.fuel + analysis.avgFuel >= 30 - analysis.avgFuel / 2 && pitOption.fuel <= 30 - analysis.avgFuel / 2
      || pitOption.tires + analysis.avgTires >= 30 - analysis.avgTires / 2 && pitOption.tires <= 30 - analysis.avgTires / 2;
  });
  const thirtyBreakpoint = filterThirty.pop()?.lap || -1;

  return {
    thirtyBreakpointRisky: thirtyBreakpoint,
    thirtyBreakpointSave: thirtyBreakpoint - 1, //do exclusively later
    zeroBreakpointRisky: zeroBreakpoint,
    zeroBreakpointSave: zeroBreakpoint - 1, //do exclusively later
  };
}
