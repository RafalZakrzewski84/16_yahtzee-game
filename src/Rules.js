/**
 * Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 *
 * @format
 */

class Rule {
	constructor(params) {
		// put all properties in params on instance
		// Object.assign(target, source)
		// method copies all enumerable own properties from one or more source objects to a target object.
		Object.assign(this, params);
	}

	sum(dice) {
		// sum of all dice
		return dice.reduce((prev, curr) => prev + curr);
	}

	freq(dice) {
		// frequencies of dice values
		// The Map object holds key-value pairs and remembers the original insertion order of the keys.
		const freqs = new Map();

		// reqs.get(d) - alone is undefined
		for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
		return Array.from(freqs.values());

		// const dice = [2, 3, 3, 5, 1];
		// const freqs = new Map();
		// for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
		// console.log(Array.from(freqs.keys()))	Array [2, 3, 5, 1]
		// console.log(Array.from(freqs.values()))	Array [1, 2, 1, 1]
	}

	count(dice, val) {
		// # times val appears in dice
		return dice.filter((d) => d === val).length;
	}
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule {
	evalRoll = (dice) => {
		return this.val * this.count(dice, this.val);
	};
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule {
	evalRoll = (dice) => {
		// do any of the counts meet of exceed this distro?
		// const dice = [2, 3, 3, 3, 1];
		// freq(dice) will be [1,3,1], e.g. some will compare with 3 and give true
		return this.freq(dice).some((c) => c >= this.count) ? this.sum(dice) : 0;
	};
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule {
	// TODO
	evalRoll = (dice) => {
		const frqArr = this.freq(dice).sort();
		return frqArr[0] === 2 && frqArr[1] === 3 ? this.score : 0;
		//or
		//const frqArr = this.freq(dice)
		//return (frqArr.includes(2) && frqArr.includes(3) ? this.score : 0;
	};
}

/** Check for small straights. */

class SmallStraight extends Rule {
	// TODO
	evalRoll = (dice) => {
		const d = new Set(dice);
		if (d.has(2) && d.has(3) && d.has(4) && (!d.has(1) || !d.has(5))) {
			return this.score;
		}
		if (d.has(3) && d.has(4) && d.has(5) && (!d.has(2) || !d.has(6))) {
			return this.score;
		}
		return 0;
	};
}

/** Check for large straights. */

class LargeStraight extends Rule {
	evalRoll = (dice) => {
		//The Set constructor lets you create Set objects that store unique values of any type
		const d = new Set(dice);
		// dice = [1, 2, 3, 4, 5]
		/* [[Entries]]
		0:1
		1:2
		2:3
		3:4
		4:5
		size:5 */
		// large straight must be 5 different dice & only one can be a 1 or a 6
		// d.size is 5 and (!true = false) or (!false = true)
		// true and true => score, e.g 40

		return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
	};
}

/** Check if all dice are same. */

class Yahtzee extends Rule {
	evalRoll = (dice) => {
		// all dice must be the same
		// dice = [5,5,5,5,5]
		// freq(dice) will be [5]
		return this.freq(dice)[0] === 5 ? this.score : 0;
	};
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 });
const twos = new TotalOneNumber({ val: 2 });
const threes = new TotalOneNumber({ val: 3 });
const fours = new TotalOneNumber({ val: 4 });
const fives = new TotalOneNumber({ val: 5 });
const sixes = new TotalOneNumber({ val: 6 });

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3 });
const fourOfKind = new SumDistro({ count: 4 });

// full house scores as flat 25
const fullHouse = new FullHouse({ score: 25 });

// small/large straights score as 30/40
const smallStraight = new SmallStraight({ score: 30 });
const largeStraight = new LargeStraight({ score: 40 });

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50 });

// for chance, can view as some of all dice, requiring at least 0 of a kind
const chance = new SumDistro({ count: 0 });

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
	chance,
};
