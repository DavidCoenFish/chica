//https://github.com/dylang/shortid/blob/master/lib/random/random-from-seed.js
// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

/**
 * @private
 * @constructor
 * @struct
 * @param {!number} in_seed
 */
c.RandomSequence = function(in_seed) {
	/** @type {!number} */
	this.m_seed = in_seed % 233280;
	return;
}
c["RandomSequence"] = c.RandomSequence;


/**
 * @param {!number} in_seed
 * @return {!c.RandomSequence}
 */
c.RandomSequence.Factory = function(in_seed) {
	return new c.RandomSequence(in_seed);
}
c.RandomSequence["Factory"] = c.RandomSequence.Factory;

/**
 * @return {!number}
 */
c.RandomSequence.MakeSeed = function() {
	return Math.floor(Math.random() * 233280);
}
c.RandomSequence["MakeSeed"] = c.RandomSequence.MakeSeed;

/**
 * return [0 ... 1> not inclusive of 1.0, just approaches 0.99999
 * @return {!number}
 */
c.RandomSequence.prototype.Random = function() {
	this.m_seed = (this.m_seed * 9301 + 49297) % 233280;
	/** @type {!number} */
	var result = this.m_seed / 233280;
	return result;
}
c.RandomSequence.prototype["Random"] = c.RandomSequence.prototype.Random;

/**
 * @return {!number}
 */
c.RandomSequence.prototype.GetCurrentSeed = function() {
	return this.m_seed;
}
c.RandomSequence.prototype["GetCurrentSeed"] = c.RandomSequence.prototype.GetCurrentSeed;

/**
 * @template TYPE
 * @param {!Array.<!TYPE>} in_arraySource
 * @param {!Array.<!TYPE>|undefined} in_arrayDestOrUndefined
 * @return {!Array.<!TYPE>}
 */
c.RandomSequence.prototype.ShuffelArray = function( in_arraySource, in_arrayDestOrUndefined ) {
	if (undefined === in_arrayDestOrUndefined) {
		in_arrayDestOrUndefined = [];
	}
	in_arrayDestOrUndefined.length = in_arraySource.length;

	/** @type {!number} */
	var index = 0;
	for (; index < in_arrayDestOrUndefined.length; ++index) {
		in_arrayDestOrUndefined[index] = in_arraySource[index];
	}

	/** @type {!number} */
	var currentIndex = in_arrayDestOrUndefined.length;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		/** @type {!number} */
		var randomIndex = Math.floor(this.Random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		/** @type {?} */
		var temporaryValue = in_arrayDestOrUndefined[currentIndex];
		in_arrayDestOrUndefined[currentIndex] = in_arrayDestOrUndefined[randomIndex];
		in_arrayDestOrUndefined[randomIndex] = temporaryValue;
	}

	return in_arrayDestOrUndefined;
}
c.RandomSequence.prototype["ShuffelArray"] = c.RandomSequence.prototype.ShuffelArray;
