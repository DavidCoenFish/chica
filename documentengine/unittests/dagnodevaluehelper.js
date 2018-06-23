const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunDagNodeValueHelperBool);
	promiseFactoryArray.push(RunDagNodeValueHelperBoolArray);
	promiseFactoryArray.push(RunDagNodeValueHelperInt);
	promiseFactoryArray.push(RunDagNodeValueHelperIntArray);
	promiseFactoryArray.push(RunDagNodeValueHelperFloat);
	promiseFactoryArray.push(RunDagNodeValueHelperFloatArray);
	promiseFactoryArray.push(RunDagNodeValueHelperString);
	promiseFactoryArray.push(RunDagNodeValueHelperStringArray);
	promiseFactoryArray.push(RunDagNodeValueHelperStringMap);
	promiseFactoryArray.push(RunDagNodeValueHelperKey);
	promiseFactoryArray.push(RunDagNodeValueHelperKeyArray);
	promiseFactoryArray.push(RunDagNodeValueHelperDocument);

	promiseFactoryArray.push(RunDagNodeValueHelperDocumentArray);
	promiseFactoryArray.push(RunDagNodeValueHelperIDDocumentMap);

}

const RunDagNodeValueHelperBool = function(){
	const name = "DagNodeValueHelperBool ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "bool",
			"defaultvaluebool" : true
			};
		Test.DealTest(name + "0 true", context.c.DagNodeValueHelper.FactoryValue(true, metaData0) === true, true);
		Test.DealTest(name + "0 false", context.c.DagNodeValueHelper.FactoryValue(false, metaData0) === false, true);
		Test.DealTest(name + "0 undefined", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData0) === true, true);
		Test.DealTest(name + "0 string", context.c.DagNodeValueHelper.FactoryValue("false", metaData0) === true, true);
		Test.DealTest(name + "0 int", context.c.DagNodeValueHelper.FactoryValue(0, metaData0) === true, true);

		var metaData1 = {
			"type" : "bool",
			"defaultvaluebool" : false
			};
		Test.DealTest(name + "1 true", context.c.DagNodeValueHelper.FactoryValue(true, metaData1) === true, true);
		Test.DealTest(name + "1 false", context.c.DagNodeValueHelper.FactoryValue(false, metaData1) === false, true);
		Test.DealTest(name + "1 undefined", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData1) === false, true);
		Test.DealTest(name + "1 string", context.c.DagNodeValueHelper.FactoryValue("false", metaData1) === false, true);
		Test.DealTest(name + "1 int", context.c.DagNodeValueHelper.FactoryValue(0, metaData1) === false, true);

		var metaData2 = {
			"type" : "bool"
			};
		Test.DealTest(name + "2 true", context.c.DagNodeValueHelper.FactoryValue(true, metaData2) === true, true);
		Test.DealTest(name + "2 false", context.c.DagNodeValueHelper.FactoryValue(false, metaData2) === false, true);
		Test.DealTest(name + "2 undefined", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData2) === false, true);
		Test.DealTest(name + "2 string", context.c.DagNodeValueHelper.FactoryValue("false", metaData2) === false, true);
		Test.DealTest(name + "2 int", context.c.DagNodeValueHelper.FactoryValue(0, metaData2) === false, true);

	});
}

const RunDagNodeValueHelperBoolArray = function(){
	const name = "DagNodeValueHelperBoolArray ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "boolarray",
			"arraylengthmin" : 3
			};
		Test.DealTest(name + "0a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([true], metaData0)), 
			JSON.stringify([true, false, false]));
		Test.DealTest(name + "0b", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue(["a","b",true], metaData0)), 
			JSON.stringify([false, false, true]));
		Test.DealTest(name + "0c", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue(undefined, metaData0)), 
			JSON.stringify([false, false, false]));

		var metaData1 = {
			"type" : "boolarray",
			"arraylengthmin" : 3,
			"defaultvaluebool" : true
			};
		Test.DealTest(name + "1a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([false], metaData1)), 
			JSON.stringify([false, true, true]));
	});
}

const RunDagNodeValueHelperInt = function(){
	const name = "DagNodeValueHelperInt ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "int",
			"defaultvalueint" : 3
			};
		Test.DealTest(name + "0a", context.c.DagNodeValueHelper.FactoryValue(2, metaData0) === 2, true);
		Test.DealTest(name + "0b", context.c.DagNodeValueHelper.FactoryValue(5.3, metaData0) === 5, true);
		Test.DealTest(name + "0c", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData0) === 3, true);
		Test.DealTest(name + "0d", context.c.DagNodeValueHelper.FactoryValue("4", metaData0) === 3, true);
		Test.DealTest(name + "0e", context.c.DagNodeValueHelper.FactoryValue(-5, metaData0) === -5, true);

		var metaData1 = {
			"type" : "int",
			"intrangelow" : 0,
			"intrangehigh" : 10,
			};
		Test.DealTest(name + "1a", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData1) === 0, true);
		Test.DealTest(name + "1b", context.c.DagNodeValueHelper.FactoryValue(-1, metaData1) === 0, true);
		Test.DealTest(name + "1c", context.c.DagNodeValueHelper.FactoryValue(5, metaData1) === 5, true);
		Test.DealTest(name + "1d", context.c.DagNodeValueHelper.FactoryValue(0, metaData1) === 0, true);
		Test.DealTest(name + "1e", context.c.DagNodeValueHelper.FactoryValue(10, metaData1) === 10, true);
		Test.DealTest(name + "1f", context.c.DagNodeValueHelper.FactoryValue(11, metaData1) === 10, true);

		var metaData2 = {
			"type" : "int",
			"defaultvalueintdatenow" : true
			};
		Test.DealTest(name + "date", 0 < context.c.DagNodeValueHelper.FactoryValue(undefined, metaData2), true);
		//var value = context.c.DagNodeValueHelper.FactoryValue(undefined, metaData2);
		//console.log(value);

	});
}

const RunDagNodeValueHelperIntArray = function(){
	const name = "DagNodeValueHelperIntArray ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "intarray",
			"defaultvalueint" : 3,
			"arraylengthmin" : 3
			};
		Test.DealTest(name + "0a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([4], metaData0)), 
			JSON.stringify([4, 3, 3]));
		Test.DealTest(name + "0b", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([-4, "fioo", 6.9], metaData0)), 
			JSON.stringify([-4, 3, 7]));
		var metaData1 = {
			"type" : "intarray",
			"defaultvalueint" : 3,
			"intrangelow" : 0,
			"intrangehigh" : 10,
			"arraylengthmin" : 3
			};
		Test.DealTest(name + "1a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([4, -4, 14, 9], metaData1)), 
			JSON.stringify([4, 0, 10, 9]));
	});
}

const RunDagNodeValueHelperFloat = function(){
	const name = "DagNodeValueHelperFloat ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "float",
			"defaultvaluefloat" : 3.5
			};
		Test.DealTest(name + "0a", context.c.DagNodeValueHelper.FactoryValue(2, metaData0) === 2.0, true);
		Test.DealTest(name + "0b", context.c.DagNodeValueHelper.FactoryValue(5.3, metaData0) === 5.3, true);
		Test.DealTest(name + "0c", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData0) === 3.5, true);
		Test.DealTest(name + "0d", context.c.DagNodeValueHelper.FactoryValue("4", metaData0) === 3.5, true);
		Test.DealTest(name + "0e", context.c.DagNodeValueHelper.FactoryValue(-5, metaData0) === -5.0, true);

		var metaData1 = {
			"type" : "float",
			"floatrangelow" : -1.0,
			"floatrangehigh" : 1.0,
			};
		Test.DealTest(name + "1a", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData1) === 0.0, true);
		Test.DealTest(name + "1b", context.c.DagNodeValueHelper.FactoryValue(-1, metaData1) === -1.0, true);
		Test.DealTest(name + "1c", context.c.DagNodeValueHelper.FactoryValue(5, metaData1) === 1.0, true);
		Test.DealTest(name + "1d", context.c.DagNodeValueHelper.FactoryValue(0, metaData1) === 0.0, true);
		Test.DealTest(name + "1e", context.c.DagNodeValueHelper.FactoryValue(1, metaData1) === 1.0, true);


	});
}

const RunDagNodeValueHelperFloatArray = function(){
	const name = "DagNodeValueHelperFloatArray ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "floatarray",
			"defaultvaluefloat" : 3.5,
			"arraylengthmin" : 3
			};
		Test.DealTest(name + "0a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([4, "foo"], metaData0)), 
			JSON.stringify([4, 3.5, 3.5]));
		Test.DealTest(name + "0a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([-2, -1, -0.75, 0, 0.95, 1, 1.5], metaData0)), 
			JSON.stringify([-2, -1, -0.75, 0, 0.95, 1, 1.5]));

		var metaData1 = {
			"type" : "floatarray",
			"floatrangelow" : -1,
			"floatrangehigh" : 1,
			"arraylengthmax" : 3
			};
		Test.DealTest(name + "1a",
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([-2, -1, -0.75, 0, 0.95, 1, 1.5], metaData1)), 
			JSON.stringify([-1, -1, -0.75]));

		var metaData2 = {
			"type" : "floatarray",
			"floatrangelow" : -1,
			"floatrangehigh" : 1
			};
		Test.DealTest(name + "2a",
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([-2, -1, -0.75, 0, 0.95, 1, 1.5], metaData2)), 
			JSON.stringify([-1, -1, -0.75, 0, 0.95, 1, 1]));

	});
}

const RunDagNodeValueHelperString = function(){
	const name = "DagNodeValueHelperString ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "string",
			"defaultvaluestring" : "foo"
			};
		Test.DealTest(name + "0a", context.c.DagNodeValueHelper.FactoryValue("bar", metaData0), "bar");
		Test.DealTest(name + "0b", context.c.DagNodeValueHelper.FactoryValue("", metaData0), "");
		Test.DealTest(name + "0c", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData0), "foo");
		Test.DealTest(name + "0d", context.c.DagNodeValueHelper.FactoryValue(0, metaData0), "foo");

		var metaData1 = {
			"type" : "string",
			};
		Test.DealTest(name + "1a", context.c.DagNodeValueHelper.FactoryValue("bar", metaData1), "bar");
		Test.DealTest(name + "1b", context.c.DagNodeValueHelper.FactoryValue("", metaData1), "");
		Test.DealTest(name + "1c", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData1), "");

		var metaData2 = {
			"type" : "string",
			"stringlengthmin" : 4,
			"stringlengthmax" : 10,
			};
		Test.DealTest(name + "2a", context.c.DagNodeValueHelper.FactoryValue("bar", metaData2).length, 4);
		Test.DealTest(name + "2b", context.c.DagNodeValueHelper.FactoryValue("12345678901", metaData2), "1234567890");
		Test.DealTest(name + "2c", context.c.DagNodeValueHelper.FactoryValue(undefined, metaData2).length, 4);

		var metaData3 = {
			"type" : "string",
			"defaultvaluestringrandid" : true
			};
		var defaultIdValue = context.c.DagNodeValueHelper.FactoryValue(undefined, metaData3);
		//console.log("defaultIdValue:" + defaultIdValue);
		Test.DealTest(name + "defaultIdValue", defaultIdValue !== undefined, true);
		Test.DealTest(name + "defaultIdValue length", 8 < defaultIdValue.length, true);

		var metaData4 = {
			"type" : "string",
			"defaultvaluestringranddatabaseid" : true
			};
		var defaultDatabaseIdValue = context.c.DagNodeValueHelper.FactoryValue(undefined, metaData4);
		//console.log("defaultDatabaseIdValue:" + defaultDatabaseIdValue);
		Test.DealTest(name + "defaultDatabaseIdValue", defaultDatabaseIdValue !== undefined, true);
		Test.DealTest(name + "defaultDatabaseIdValue length", 8 < defaultDatabaseIdValue.length, true);


	});
}

const RunDagNodeValueHelperStringArray = function(){
	const name = "DagNodeValueHelperStringArray ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "stringarray",
			"defaultvaluestring" : "foo",
			"arraylengthmin" : 3
			};
		Test.DealTest(name + "0a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([4, "bar"], metaData0)), 
			JSON.stringify(["foo", "bar", "foo"]));

		var metaData1 = {
			"type" : "stringarray",
			"defaultvaluestring" : "bar",
			"stringlengthmax" : 3
			};
		Test.DealTest(name + "1a", 
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([4, "mooooo"], metaData1)), 
			JSON.stringify(["bar", "moo"]));

	});
}

const RunDagNodeValueHelperKey = function(){
	const name = "DagNodeValueHelperKey ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var statidData0 = {
			"test0" : {
					"keys0" : {
						"a" : 0,
						"b" : 1,
						"c" : 2,
						"d" : 3,
						}
				}
			};
		var metaData0 = {
			"type" : "key",
			"defaultvaluekey" : "e",
			"keypath" : ["test0", "keys0"]
			};
		Test.DealTest(name + "0a", context.c.DagNodeValueHelper.FactoryValue("", metaData0, statidData0), "e");
		Test.DealTest(name + "0b", context.c.DagNodeValueHelper.FactoryValue("a", metaData0, statidData0), "a");
		Test.DealTest(name + "0c", context.c.DagNodeValueHelper.FactoryValue("f", metaData0, statidData0), "e");
		var metaData1 = {
			"type" : "key",
			"keypath" : ["test0", "keys0"]
			};
		Test.DealTest(name + "1a", context.c.DagNodeValueHelper.FactoryValue("", metaData1, statidData0), "a");
		Test.DealTest(name + "1b", context.c.DagNodeValueHelper.FactoryValue("b", metaData1, statidData0), "b");
		var metaData2 = {
			"type" : "key",
			"keypath" : ["test0", "keys0"],
			"defaultvaluekeyuserand" : true
			};
		Test.DealTest(name + "2a", context.c.DagNodeValueHelper.FactoryValue("", metaData2, statidData0) in statidData0.test0.keys0, true);

	});
}

const RunDagNodeValueHelperKeyArray = function(){
	const name = "DagNodeValueHelperKeyArray ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var statidData0 = {
				"enum" : {
					"a" : 0,
					"b" : 1,
					"c" : 2,
					"d" : 3,
					}
			};
		var metaData0 = {
			"type" : "keyarray",
			"defaultvaluekey" : "b",
			"keypath" : ["enum"],
			"arraylengthmin" : 3
			};
		Test.DealTest(name + "0a",
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue([4, "b", "c", "d", "e"], metaData0, statidData0)), 
			JSON.stringify(["b", "b", "c", "d", "b"]));
		Test.DealTest(name + "0b",
			JSON.stringify(context.c.DagNodeValueHelper.FactoryValue(["a"], metaData0, statidData0)), 
			JSON.stringify(["a", "b", "b"]));

	});
}

const RunDagNodeValueHelperDocument = function(){
	const name = "DagNodeValueHelperDocument ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		const staticData = {
			"data" : {
				"child" : {
					"value" : {
						"c" : { "type" : "int", "defaultvalueint" : 100 }
					},
					"calculate" : {
					}
				}
			},
			"documenttypes" : {
				"child" : {
					"value" : ["data", "child", "value"],
					"calculate" : ["data", "child", "calculate"],
					"instructioncontext" : "context"
				}
			}		
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, {});
		const metaData0 = {
			"type" : "document",
			"defaultvaluedocumenttype" : "child",
			"documenttypearray" : ["child"]
			};
		const documentData = documentManager.NewDocumentData("child");
		const documentDummy = documentManager.DocumentDataToDocument(documentData);
		const document = context.c.DagNodeValueHelper.FactoryValue(undefined, metaData0, staticData, documentManager);
		Test.DealTest(name + "0a", 
			document.toString(),
			documentDummy.toString());
	});
}

const RunDagNodeValueHelperDocumentArray = function(){

	const name = "DagNodeValueHelperDocumentArray ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		const staticData = {
			"data" : {
				"child" : {
					"value" : {
						"c" : { "type" : "int", "defaultvalueint" : 100 }
					},
					"calculate" : {
					}
				}
			},
			"documenttypes" : {
				"child" : {
					"value" : ["data", "child", "value"],
					"calculate" : ["data", "child", "calculate"],
					"instructioncontext" : "context"
				}
			}		
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, {});

		var metaData0 = {
			"type" : "documentarray",
			"defaultvaluedocumenttype" : "child",
			"documenttypearray" : ["child"],
			"arraylengthmin" : 1
			};

		const documentData = documentManager.NewDocumentData("child");
		const documentDummy = documentManager.DocumentDataToDocument(documentData);
		const documentArray = context.c.DagNodeValueHelper.FactoryValue([4, "aaaa"], metaData0, staticData, documentManager);

		Test.DealTest(name + "0a", 
			documentArray[0].toString(), 
			documentDummy.toString());
	});
}

const RunDagNodeValueHelperIDDocumentMap = function(){
	const name = "DagNodeValueHelperIDDocumentMap ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		const staticData = {
			"data" : {
				"child" : {
					"value" : {
						"id" : { "type" : "string", "defaultvaluestringrandid" : true}
					}
				}
			},
			"documenttypes" : {
				"child" : {
					"value" : ["data", "child", "value"],
					"instructioncontext" : "context"
				}
			}		
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, {});

		var metaData0 = {
			"type" : "iddocumentmap",
			"defaultvaluedocumenttype" : "child",
			"documenttypearray" : ["child"]
			};

		const inputValue = [
			{
				"type" : "child",
				"id" : "aa"
			},
			{
				"type" : "cull",
				"id" : "bb"
			},
			{
				"type" : "child",
			}
		];
		const documentMap = context.c.DagNodeValueHelper.FactoryValue(inputValue, metaData0, staticData, documentManager);
		Test.DealTest(name + "documentMap", documentMap != null, true);
		Test.DealTest(name + "documentMap aa", "aa" in documentMap, true);
	});
}

const RunDagNodeValueHelperStringMap = function(){
	const name = "DagNodeValueHelperStringMap ";
	return Q(true).then(function(){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "context.c", context.c != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper", context.c.DagNodeValueHelper != null, true);
		Test.DealTest(name + "context.c.DagNodeValueHelper.FactoryValue", context.c.DagNodeValueHelper.FactoryValue != null, true);

		var metaData0 = {
			"type" : "stringmap"
			};
		var value = context.c.DagNodeValueHelper.FactoryValue([4, "aaaa", "bb"], metaData0);
		Test.DealTest(name + "value", value != null, true);
		Test.DealTest(name + "aaaa", "aaaa" in value, true);
		Test.DealTest(name + "bb", "bb" in value, true);
		Test.DealTest(name + "4", "4" in value, false);
	});
}

