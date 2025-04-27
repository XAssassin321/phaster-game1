/**
 * = NumberManager
 * A new version of stat.js ,
 *
 * == modifiers
 * - total base x total increased x total more
 * - each added modifer should be in the format of KeyName : value
 * ==
 */
export default class NumberManager{


	constructor(baseNumber = 0) {
		this.baseNumber = baseNumber;
		this.total = 0;

		this.modifiers = {
			flat: [], //add to baseNumber
			increased: [], //multiply by baseNumber
			more: [], // multiply by increased AND baseNumber
		};
	}
	getTotal() {
		// console.log(this.total,this.lastTotal);
		return this.total;
	}

}
