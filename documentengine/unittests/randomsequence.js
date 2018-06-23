const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunRandomSequence);
	promiseFactoryArray.push(RunRandomShuffel);
	//promiseFactoryArray.push(RunRandomSequenceSearchAttributeContest);
}

const RunRandomSequence = function(promiseArray) {
	const name = "RandomSequence ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.RandomSequence", context.c.RandomSequence != null, true);
		Test.DealTest(name + "c.RandomSequence.Factory", context.c.RandomSequence.Factory != null, true);

		var randomSequence0 = context.c.RandomSequence.Factory(5);
		var randomSequence1 = context.c.RandomSequence.Factory(7);
		var randomSequence2 = context.c.RandomSequence.Factory(5);

		var rangeMin = 50;
		var rangeMax = -50;

		var frequencyMap = {};
		for (var index = 0; index < 1000; ++index){
			var result0 = randomSequence0.Random();
			var result1 = Math.floor((randomSequence1.Random() * 100.0) - 50.0);
			rangeMin = Math.min(rangeMin, result1);
			rangeMax = Math.max(rangeMax, result1);
			var key1 = result1.toString();
			if (key1 in frequencyMap){
				frequencyMap[key1] += 1;
			} else {
				frequencyMap[key1] = 1;
			}

			var result2 = randomSequence2.Random();
			Test.DealTest(name + "sequence" + index, result0, result2);
		}
		
		Test.DealTest(name + "rangeMin", rangeMin, -50);
		Test.DealTest(name + "rangeMax", rangeMax, 49);

		var r = 100;
		var n_r = 1000 / r;
		var chiSquared = 0.0;
		for (var key in frequencyMap) {
			var frequency = frequencyMap[key] - n_r;
			chiSquared += ((frequency * frequency) / n_r);
		}

		//PART C: According to Swdgewick: "The statistic should be within 2(r)^1/2 of r
		//This is valid if N is greater than about 10r"
		Test.DealTest(name + "<chiSquared", (r - 2 * Math.sqrt(r) <= chiSquared), true);
		Test.DealTest(name + "chiSquared<", (chiSquared <= (r + 2 * Math.sqrt(r))), true);
	});
}

//ShuffelArray
const RunRandomShuffel = function(promiseArray) {
	const name = "RandomShuffel ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.RandomSequence", context.c.RandomSequence != null, true);
		Test.DealTest(name + "c.RandomSequence.Factory", context.c.RandomSequence.Factory != null, true);

		var randomSequence0 = context.c.RandomSequence.Factory(5);
		var randomSequence1 = context.c.RandomSequence.Factory(5);

		var array0 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		var array1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

		var array2 = randomSequence0.ShuffelArray(array0);
		var array3 = randomSequence1.ShuffelArray(array1);

		for (var index = 0; index < array0.length; ++index){
			Test.DealTest(name + "dont change data" + index, array0[index], index);
		}

		Test.DealTest(name + "length" + index, array2.length, array3.length);

		for (var index = 0; index < array0.length; ++index){
			Test.DealTest(name + "shuffelArray" + index, array2[index], array3[index]);
		}

	});
}

const DiceRoll = function (in_sides, in_rand) {
	const result = Math.ceil(in_rand * in_sides);
	return result;
}

//RandomSequenceSearchAttributeContest bestDifference:1 bestSeed:148341 bestSequence:7,4,2,8,4,5
const RunRandomSequenceSearchAttributeContest = function(promiseArray) {
	const name = "RandomSequenceSearchAttributeContest ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.RandomSequence", context.c.RandomSequence != null, true);
		Test.DealTest(name + "c.RandomSequence.Factory", context.c.RandomSequence.Factory != null, true);

		var bestDifference = undefined;
		var bestSeed = undefined;
		var bestSequence = undefined;
		const targetSequence = [7, 4, 2, 8, 3, 5];
		for (var index = 0; index < 233280; ++index){
			var randomSequence = context.c.RandomSequence.Factory(index);
			var currentDiff = 0;
			var currentSequence = [];
			for (var subIndex = 0, subLength = targetSequence.length; subIndex < subLength; ++subIndex){
				const target = targetSequence[subIndex];
				const rand = randomSequence.Random();
				const roll = DiceRoll(10, rand);
				const diff = Math.abs(target - roll);
				currentDiff += diff;
				currentSequence.push(roll);
			}
			if ((bestDifference === undefined) || (currentDiff < bestDifference)){
				bestDifference = currentDiff;
				bestSeed = index;
				bestSequence = currentSequence;
			}
			if (bestDifference === 0){
				break;
			}
		}
		console.log(name + "bestDifference:" + bestDifference + " bestSeed:" + bestSeed + " bestSequence:" + bestSequence);

	});
}
