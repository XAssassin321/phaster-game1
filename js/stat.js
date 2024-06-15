class Stat {
	constructor(baseStat = 0) {
		this.baseStat = baseStat;
		this.lastTotal = 0;
		this.total = 0;
		this.modifiers = {
			flat: [],
			multi: [],
			// multi2: [],
		};
		// console.log(this.modifiers, this.baseStat, this.lastTotal);

	}

	getTotal() {
		// console.log(this.total,this.lastTotal);
		return this.total;
	}

	increment() {
		let totalFlat1 = this.modifiers.flat.reduce(this.reducer, 0);
		totalFlat1 = totalFlat1 > 0 ? totalFlat1 : 1;

		let multi1 = this.modifiers.multi.reduce(this.reducer, 0);
		multi1 = multi1 > 0 ? multi1 : 1;
		// let multi2 = this.modifiers.multi2.reduce(this.reducer, 1);
		// multi2 = multi2 > 0 ?? 1;


		if (this.lastTotal === 0) {
			this.lastTotal = this.baseStat;
		}
		let addedValue = totalFlat1 * multi1;
		let newTotal = this.lastTotal + addedValue;
		// console.log(
		// 	this.modifiers,
		// 	this.lastTotal,
		// 	this.baseStat,
		// 	totalFlat1,
		// 	multi1,
		// 	addedValue,
		// 	newTotal,
		// );

		this.total = newTotal;
		this.lastTotal = newTotal;

	}

	increments(count) {
		for (let i = 0; i < count; i++) {
			this.increment();
		}
	}

	reducer(accumulator, currentValue, index) {
		// console.log(accumulator, currentValue, index);
		return accumulator + currentValue;
	}

	/**
	 * Increase total value by a fixed amount.
	 */
	increaseBy(increase) {
		this.total = this.total + increase;

	}

	/**
	 * Increase total value by a percentage amount.
	 */
	increaseByMulti(increase) {
		this.total = this.total * increase;
	}

	addModifier(modifierName, amount) {
		// console.log('addModifier called');
		this.modifiers[modifierName].push(amount)
	}

	addFlatModifier(amount) {
		// console.log('addFlatModifier called');
		this.addModifier('flat', amount);
	}

	addMultiModifier(amount) {
		// console.log('addMultiModifier called');
		this.addModifier('multi', amount);
	}
}

export default Stat;
