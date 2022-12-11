/** Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule {
  constructor(params) {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice) {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice) {
    // frequencies of dice values
    const freqs = new Map();
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // # times val appears in dice
    return dice.filter(d => d === val).length;
  }
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule {
  evalRoll = dice => {
    return this.val * this.count(dice, this.val);
  };
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule {
  evalRoll = dice => {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some(c => c >= this.count) ? this.sum(dice) : 0;
    //here the frequency is checked and if that is greater or equal to 
    //passed count then sum it+ other nums left or else return 0
    //{2,2,2,2,3}=>both 3&4 of a kind so should return either 6+2+3 or 8+3 
  };
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule{
  //basically will use frequency function to check
  evalRoll=dice=>{
    const freqs = this.freq(dice);
    return freqs.includes(2) && freqs.includes(3)? this.score:0;
  }
}

/** Check for small straights. */

class SmallStraight extends Rule {
  //basically if 4+ values in straight row then return 30
  //used set for unique values
  evalRoll=dice=>{
    const d = new Set(dice);
    //staight can be 234 with either 1 or 5
    if(d.has(2)&&d.has(3)&&d.has(4) && (d.has(1) || d.has(5)))
    return this.score;
    // or can be 345 with with 2 or 6
    if(d.has(3)&&d.has(4)&&d.has(5) && (d.has(2) || d.has(6)))
    return this.score;
    return 0;
  }
}

/** Check for large straights. */

class LargeStraight extends Rule {
  evalRoll = dice => {
    const d = new Set(dice);
    //basically with using set we end up with unique non repeating values
    //so if it's 5 ok else no
    //also {1,2,3,4,6} is also a set but not with values in a row {5} is missing hence ignore
    //else return 40
    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
}

/** Check if all dice are same. */

class Yahtzee extends Rule {
  evalRoll = dice => {
    // all dice must be the same
    //if all 5 dice are same then 50 
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 ,description:"1 point for each one"});
const twos = new TotalOneNumber({ val: 2 ,description:"2 point for each two"});
const threes = new TotalOneNumber({ val: 3 ,description:"3 point for each three"});
const fours = new TotalOneNumber({ val: 4 ,description:"4 point for each four"});
const fives = new TotalOneNumber({ val: 5 ,description:"5 point for each five"});
const sixes = new TotalOneNumber({ val: 6 ,description:"6 point for each six"});

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3 ,description:"Sum of all dice if 3 are same"});
const fourOfKind = new SumDistro({ count: 4,description:"Sum of all dice if 4 are same" });

// full house scores as flat 25
const fullHouse = new FullHouse({score: 25,description:"25 points if fullhouse"});

// small/large straights score as 30/40
const smallStraight = new SmallStraight({score:30,description:"Consecutive digits score 30"});
const largeStraight = new LargeStraight({ score: 40 ,description:"Consecutive digits score 40"});

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50 ,description:"All digits score 50"});

// for chance, can view as some of all dice, requiring at least 0 of a kind
//here count 0 so every num passed is greater then will end up adding all the values
const chance = new SumDistro({ count: 0 ,description:"Sum of all dice"});

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance
};
