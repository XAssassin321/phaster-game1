/**
 * = NumberModifier
 * Used by NumberManager and game skills & env modifiers that generates a NumberModifiers.
 * useful to track the base number, modifier name, source
 */
export default class NumberModifier {


	constructor(SourceObject, name, baseNumber = 0) {
		this.SourceObject = SourceObject;
		this.name = name;
		this.baseNumber = baseNumber;
		this.total = 0;

	}

}
