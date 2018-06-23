const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	//promiseFactoryArray.push(RunPathObject);
	promiseFactoryArray.push(RunRandomString);
}

const RunPathObject = function(){
	const name = "PathObjectGet ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.PathObjectGet", context.c.PathObjectGet != null, true);

		var testObj0 = {
			"_" : 4,
			"a" : 6,
			"b" : 5
			};
		Test.DealTest(name + "0a", context.c.PathObjectGet(testObj0, ["b"]), 5);

		var testObj1 = ["a","b","c"];
		Test.DealTest(name + "1a", context.c.PathObjectGet(testObj1, [2]), "c");

		var testObj2 = ["a","b", {
			"c" : 3,
			"d" : 4
		}];
		Test.DealTest(name + "2a", context.c.PathObjectGet(testObj2, [2, "c"]), 3);

		var testObj3 = {
			"a" : {
				"b" : [
					"a",
					"b",
					{
						"d" : 2,
						"e" : 5
						}
					]
				},
			"c" : 3,
			"d" : 4
		};
		Test.DealTest(name + "3a", context.c.PathObjectGet(testObj3, ["a", "b", 2, "d"]), 2);

		Test.DealTest(name + "3b", context.c.PathObjectGet(testObj3, undefined), undefined);
		Test.DealTest(name + "3c", context.c.PathObjectGet(undefined, ["a"]), undefined);

	});
}

const RunRandomString = function(){
	const name = "RandomString ";
	return Q(true).then(function(){
		const context = { "console": console };
		context["window"] = context;
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.RandomString", context.c.PathObjectGet != null, true);

		var test0 = context.c.RandomString(16, "abcd");
		Test.DealTest(name + "0a", test0.length, 16);
	});
}