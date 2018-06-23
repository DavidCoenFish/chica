const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunObjectDelta);
	promiseFactoryArray.push(RunObjectDeltaArrayInsert);
	promiseFactoryArray.push(RunObjectDeltaArrayRemove);
	promiseFactoryArray.push(RunObjectDeltaArray);
	promiseFactoryArray.push(RunObjectDeltaArrayObject);
}

const RunObjectDelta = function() {
	const name = "ObjectDelta ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.ObjectDelta", context.c.ObjectDelta != null, true);
		Test.DealTest(name + "c.ObjectDelta.Factory", context.c.ObjectDelta.Factory != null, true);
		const source = {
			"a" : "b",
			"c" : {
				"d" : 4,
				"e" : "f"
				},
			"j" : "k"
		};
		const target = {
			"a" : "b",
			"c" : {
				"d" : 5,
				},
			"j" : "l"
		};

		const instructionContext = {};
		const objectDelta = context.c.ObjectDelta.Factory(source, target);
		//console.log(JSON.stringify(objectDelta));
		Test.DealTest(name + "objectDelta", objectDelta != null, true);

		const result = context.c.ObjectDelta.ApplyDelta(source, objectDelta);
		const targetString = JSON.stringify(target);
		const resultString = JSON.stringify(result);

		Test.DealTest(name + "result", resultString, targetString);
	});
}

const RunObjectDeltaArrayInsert = function() {
	const name = "ObjectDeltaArrayInsert ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.ObjectDelta", context.c.ObjectDelta != null, true);
		Test.DealTest(name + "c.ObjectDelta.Factory", context.c.ObjectDelta.Factory != null, true);

		const source0 = {
			"a" : [0,2]
		};
		const target0 = {
			"a" : [0,1,2]
		};
		const objectDelta0 = context.c.ObjectDelta.Factory(source0, target0);
		//console.log(JSON.stringify(objectDelta0));
		Test.DealTest(name + "objectDelta0", objectDelta0 != null, true);
		const result0 = context.c.ObjectDelta.ApplyDelta(source0, objectDelta0);
		const targetString0 = JSON.stringify(target0);
		const resultString0 = JSON.stringify(result0);
		Test.DealTest(name + "result0", resultString0, targetString0);

		const source1 = {
			"a" : [0,2]
		};
		const target1 = {
			"a" : [0,1,2]
		};
		const objectDelta1 = context.c.ObjectDelta.Factory(source1, target1);
		//console.log(JSON.stringify(objectDelta1));
		Test.DealTest(name + "objectDelta0", objectDelta0 != null, true);
		const result1 = context.c.ObjectDelta.ApplyDelta(source1, objectDelta1);
		const targetString1 = JSON.stringify(target1);
		const resultString1 = JSON.stringify(result1);
		Test.DealTest(name + "result1", resultString1, targetString1);

		const source2 = {
			"a" : [0,2]
		};
		const target2 = {
			"a" : [0,1,2]
		};
		const objectDelta2 = context.c.ObjectDelta.Factory(source2, target2);
		//console.log(JSON.stringify(objectDelta2));
		Test.DealTest(name + "objectDelta2", objectDelta2 != null, true);
		const result2 = context.c.ObjectDelta.ApplyDelta(source2, objectDelta2);
		const targetString2 = JSON.stringify(target2);
		const resultString2 = JSON.stringify(result2);
		Test.DealTest(name + "result2", resultString2, targetString2);

		const source3 = {
			"a" : [0,3]
		};
		const target3 = {
			"a" : [0,1,2,3]
		};
		const objectDelta3 = context.c.ObjectDelta.Factory(source3, target3);
		//console.log(JSON.stringify(objectDelta3));
		Test.DealTest(name + "objectDelta3", objectDelta3 != null, true);
		const result3 = context.c.ObjectDelta.ApplyDelta(source3, objectDelta3);
		const targetString3 = JSON.stringify(target3);
		const resultString3 = JSON.stringify(result3);
		Test.DealTest(name + "result3", resultString3, targetString3);

		const source4 = {
			"a" : [2,5]
		};
		const target4 = {
			"a" : [0,1,2,3,4,5,6,7]
		};
		const objectDelta4 = context.c.ObjectDelta.Factory(source4, target4);
		//console.log(JSON.stringify(objectDelta4));
		Test.DealTest(name + "objectDelta4", objectDelta4 != null, true);
		const result4 = context.c.ObjectDelta.ApplyDelta(source4, objectDelta4);
		const targetString4 = JSON.stringify(target4);
		const resultString4 = JSON.stringify(result4);
		Test.DealTest(name + "result4", resultString4, targetString4);

	});
}

const RunObjectDeltaArrayRemove = function() {
	const name = "ObjectDeltaArrayRemove ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.ObjectDelta", context.c.ObjectDelta != null, true);
		Test.DealTest(name + "c.ObjectDelta.Factory", context.c.ObjectDelta.Factory != null, true);

		const source0 = {
			"a" : [0,1,2]
		};
		const target0 = {
			"a" : [0,1]
		};
		const objectDelta0 = context.c.ObjectDelta.Factory(source0, target0);
		//console.log(JSON.stringify(objectDelta0));
		Test.DealTest(name + "objectDelta0", objectDelta0 != null, true);
		const result0 = context.c.ObjectDelta.ApplyDelta(source0, objectDelta0);
		const targetString0 = JSON.stringify(target0);
		const resultString0 = JSON.stringify(result0);
		Test.DealTest(name + "result0", resultString0, targetString0);

		const source1 = {
			"a" : [0,1,2]
		};
		const target1 = {
			"a" : [1,2]
		};
		const objectDelta1 = context.c.ObjectDelta.Factory(source1, target1);
		//console.log(JSON.stringify(objectDelta1));
		Test.DealTest(name + "objectDelta1", objectDelta1 != null, true);
		const result1 = context.c.ObjectDelta.ApplyDelta(source1, objectDelta1);
		const targetString1 = JSON.stringify(target1);
		const resultString1 = JSON.stringify(result1);
		Test.DealTest(name + "result1", resultString1, targetString1);

		const source2 = {
			"a" : [0,1,2]
		};
		const target2 = {
			"a" : [0,2]
		};
		const objectDelta2 = context.c.ObjectDelta.Factory(source2, target2);
		//console.log(JSON.stringify(objectDelta));
		Test.DealTest(name + "objectDelta2", objectDelta2 != null, true);
		const result2 = context.c.ObjectDelta.ApplyDelta(source2, objectDelta2);
		const targetString2 = JSON.stringify(target2);
		const resultString2 = JSON.stringify(result2);
		Test.DealTest(name + "result2", resultString2, targetString2);

		const source3 = {
			"a" : [1,2,3,4,5]
		};
		const target3 = {
			"a" : [0,0,5]
		};
		const objectDelta3 = context.c.ObjectDelta.Factory(source3, target3);
		//console.log(JSON.stringify(objectDelta3));
		Test.DealTest(name + "objectDelta3", objectDelta3 != null, true);
		const result3 = context.c.ObjectDelta.ApplyDelta(source3, objectDelta3);
		const targetString3 = JSON.stringify(target3);
		const resultString3 = JSON.stringify(result3);
		Test.DealTest(name + "result3", resultString3, targetString3);


	});
}

const RunObjectDeltaArray = function() {
	const name = "ObjectDeltaArray ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.ObjectDelta", context.c.ObjectDelta != null, true);
		Test.DealTest(name + "c.ObjectDelta.Factory", context.c.ObjectDelta.Factory != null, true);

		const source0 = {
			"a" : [0,2,3,4]
		};
		const target0 = {
			"a" : [1,1,4,5,4,6]
		};
		const objectDelta0 = context.c.ObjectDelta.Factory(source0, target0);
		//console.log(JSON.stringify(objectDelta0));
		Test.DealTest(name + "objectDelta0", objectDelta0 != null, true);
		const result0 = context.c.ObjectDelta.ApplyDelta(source0, objectDelta0);
		const targetString0 = JSON.stringify(target0);
		const resultString0 = JSON.stringify(result0);
		Test.DealTest(name + "result0", resultString0, targetString0);

		const source1 = {
			"a" : [1,1,4,5,4,6]
		};
		const target1 = {
			"a" : [0,2,3,4]
		};
		const objectDelta1 = context.c.ObjectDelta.Factory(source1, target1);
		//console.log(JSON.stringify(objectDelta1));
		Test.DealTest(name + "objectDelta1", objectDelta1 != null, true);
		const result1 = context.c.ObjectDelta.ApplyDelta(source1, objectDelta1);
		const targetString1 = JSON.stringify(target1);
		const resultString1 = JSON.stringify(result1);
		Test.DealTest(name + "result1", resultString1, targetString1);

		const source2 = {
			"a" : [{"b":0},{"b":2},{"b":3},{"b":4}]
		};
		const target2 = {
			"a" : [{"b":1},{"b":1},{"b":4},{"b":5},{"b":4},{"b":6}]
		};
		const objectDelta2 = context.c.ObjectDelta.Factory(source2, target2);
		//console.log(JSON.stringify(objectDelta2));
		Test.DealTest(name + "objectDelta2", objectDelta2 != null, true);
		const result2 = context.c.ObjectDelta.ApplyDelta(source2, objectDelta2);
		const targetString2 = JSON.stringify(target2);
		const resultString2 = JSON.stringify(result2);
		Test.DealTest(name + "result2", resultString2, targetString2);

	});
}

const RunObjectDeltaArrayObject = function() {
	const name = "ObjectDeltaArrayObject ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.ObjectDelta", context.c.ObjectDelta != null, true);
		Test.DealTest(name + "c.ObjectDelta.Factory", context.c.ObjectDelta.Factory != null, true);

		const source0 = {
			"a" : [{"e" : 3},{"b" : "c", "d" : 0}, {"f" : "g"}]
		};
		const target0 = {
			"a" : [{"a" : 2},{"b" : "c", "d" : 1}, {"f" : "g"}]
		};
		const objectDelta0 = context.c.ObjectDelta.Factory(source0, target0);
		//console.log(JSON.stringify(objectDelta0));
		Test.DealTest(name + "objectDelta0", objectDelta0 != null, true);
		const result0 = context.c.ObjectDelta.ApplyDelta(source0, objectDelta0);
		const targetString0 = JSON.stringify(target0);
		const resultString0 = JSON.stringify(result0);
		Test.DealTest(name + "result0", resultString0, targetString0);
	});
}
