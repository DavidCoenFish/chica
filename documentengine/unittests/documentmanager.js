const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunDocumentManagerSimple);
	promiseFactoryArray.push(RunDocumentManager);
	promiseFactoryArray.push(RunDocumentManagerRecursive);
	promiseFactoryArray.push(RunDocumentManagerRoundTripSimple);
	promiseFactoryArray.push(RunDocumentManagerRoundTrip);
	promiseFactoryArray.push(RunDocumentManagerRoundTypes);
	promiseFactoryArray.push(RunDocumentManagerRoundIDDocumentMap);
	promiseFactoryArray.push(RunDocumentManagerRoundDocument);
	promiseFactoryArray.push(RunDocumentManagerStringRandId);
}

const RunDocumentManagerSimple = function() {
	const name = "DocumentManagerSimple ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"documenttypes" : {
				"foo" : {}
			}
		};
		const instructionContext = {};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		Test.DealTest(name + "documentManager", documentManager != null, true);
		const documentData = documentManager.NewDocumentData("foo");
		Test.DealTest(name + "documentData", documentData != null, true);
		Test.DealTest(name + "documentData.type", documentData["type"], "foo");
	});
}

const RunDocumentManager = function() {
	const name = "DocumentManager ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"data" : {
				"foo" : {
					"value" : {
						"a" : {
							"type" : "int",
							"defaultvalueint" : 100
						},
						"b" : {
							"type" : "int",
							"defaultvalueint" : 101
						}
					},
					"calculate" : {
						"c" : {
							"data" : [
								{"op":"getnode", "value":"a"},
								{"op":"getnode", "value":"b"},
								{"op":"f2", "value":"sum"}
							]
						}
					}
				}
			},
			"documenttypes" : {
				"foo" : {
					"value" : ["data", "foo", "value"],
					"calculate" : ["data", "foo", "calculate"]
				}
			}
		};
		const instructionContext = {
			"sum" : function(a, b){ return (a + b); }
		};

		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);
		const documentData = documentManager.NewDocumentData("foo");
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);
		//console.log(document.toString());
		Test.DealTest(name + "GetValueA", document.GetValue("a"), 100);
		Test.DealTest(name + "GetValueB", document.GetValue("b"), 101);
		Test.DealTest(name + "GetValueC", document.GetValue("c"), 201);
		document.SetValue("a", 103);
		document.SetValue("b", 104);
		Test.DealTest(name + "GetValueA1", document.GetValue("a"), 103);
		Test.DealTest(name + "GetValueB1", document.GetValue("b"), 104);
		Test.DealTest(name + "GetValueC1", document.GetValue("c"), 207);
	});
}

const RunDocumentManagerRecursive = function() {
	const name = "DocumentManagerRecursive ";
	return Q(true).then(function(input){

		var messageLog = "";
		const context = { "console": { "info" : function(message){ messageLog += message; } }, "alert": function(message){ console.log("ALERT:" + message); } };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"data" : {
				"parent" : {
					"value" : {
						"a" : {
							"type" : "document",
							"defaultvaluedocumenttype" : "child",
							"documenttypearray" : [ "child" ]
						}
					},
					"calculate" : {
						"b" : {
							"data" : [
								{"op":"getnode", "value":"a"},
								{"op":"pushconst", "value":"c"},
								{"op":"getdocumentvalue"}
							]
						},
						"d" : {
							"data" : [
								{"op":"getnode", "value":"a"},
								{"op":"pushconst", "value":1},
								{"op":"getdocumentvalue"}
							]
						}
					}
				},
				"child" : {
					"value" : {
						"c" : {
							"type" : "int",
							"defaultvalueint" : 100
						}
					},
					"calculate" : {
					}
				}
			},
			"documenttypes" : {
				"parent" : {
					"value" : ["data", "parent", "value"],
					"calculate" : ["data", "parent", "calculate"]
				},
				"child" : {
					"value" : ["data", "child", "value"],
					"calculate" : ["data", "child", "calculate"]
				}
			}
		};

		const instructionContext = undefined;
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);
		const documentData = documentManager.NewDocumentData("parent");
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);
		//console.log(document.toString());
		Test.DealTest(name + "GetValue b", document.GetValue("b"), 100);

		messageLog = "";
		Test.DealTest(name + "GetValue d", document.GetValue("d"), undefined);
		Test.DealTest(name + "GetValue messageLog", 0 < messageLog.length, true);

	});
}

const RunDocumentManagerRoundTripSimple = function() {
	const name = "DocumentManagerRoundTripSimple ";
	return Q(true).then(function(input){

		var messageLog = "";
		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);

		const staticData = {
			"data" : {
				"foo" : {
					"value" : {
						"a" : {
							"type" : "int",
							"defaultvalueint" : 100
						},
						"b" : {
							"type" : "int",
							"defaultvalueint" : 200
						}
					}
				}
			},
			"documenttypes" : {
				"foo" : {
					"value" : ["data", "foo", "value"]
				}
			}
		};
		const instructionContext = {};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		const documentA = documentManager.DocumentDataToDocument({"type" : "foo"}, undefined);
		documentA.SetValue("a", 101);
		documentA.SetValue("b", 201);
		const documentDataA = documentManager.DocumentToDocumentData(documentA);
		const jsonA = JSON.stringify(documentDataA);
		const documentDataB = JSON.parse(jsonA);
		const documentB = documentManager.DocumentDataToDocument(documentDataB, undefined);

		Test.DealTest(name + "GetValue a", documentB.GetValue("a"), 101);
		Test.DealTest(name + "GetValue b", documentB.GetValue("b"), 201);

	});
}

const RunDocumentManagerRoundTrip = function() {
	const name = "DocumentManagerRoundTrip ";
	return Q(true).then(function(input){

		var messageLog = "";
		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);

		const staticData = {
			"data" : {
				"parent" : {
					"value" : {
						"child" : {
							"type" : "document",
							"defaultvaluedocumenttype" : "child",
							"documenttypearray" : [ "child" ]
						}
					}
				},
				"child" : {
					"value" : {
						"a" : {
							"type" : "int",
							"defaultvalueint" : 100
						},
						"b" : {
							"type" : "int",
							"defaultvalueint" : 200
						}
					}
				}
			},
			"documenttypes" : {
				"parent" : {
					"value" : ["data", "parent", "value"]
				},
				"child" : {
					"value" : ["data", "child", "value"]
				}
			}
		};
		const instructionContext = {};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		const documentA = documentManager.DocumentDataToDocument({"type" : "parent"}, undefined);
		const childA = documentA.GetValue("child");
		childA.SetValue("a", 101);
		childA.SetValue("b", 201);
		//console.log(documentA.toString());

		const documentDataA = documentManager.DocumentToDocumentData(documentA);
		const jsonA = JSON.stringify(documentDataA);
		const documentDataB = JSON.parse(jsonA);
		const documentB = documentManager.DocumentDataToDocument(documentDataB, undefined);
		//console.log(JSON.stringify(documentDataA));

		const childB = documentB.GetValue("child");

		Test.DealTest(name + "GetValue a", childB.GetValue("a"), 101);
		Test.DealTest(name + "GetValue b", childB.GetValue("b"), 201);

	});
}

const RunDocumentManagerRoundTypes = function() {
	const name = "DocumentManagerRoundTypes ";
	return Q(true).then(function(input){

		var messageLog = "";
		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);

		const staticData = {
			"data": {
				"enum": {
					"a": 0,
					"b": 1,
					"c": 2,
					"d": 3
				},
				"type": {
					"child": {
						"a": {
							"type": "int",
							//"defaultvalueintdatenow": true
							"defaultvalueint": 100
						},
					},
					"idchild": {
						"id" : {
							"type": "string",
							"defaultvaluestringrandid": true
						}
					},
					"value": {
						"bool": {
							"type": "bool",
							"defaultvaluebool": false
						},
						"boolarray": {
							"type": "boolarray",
							"defaultvaluebool": false,
							"arraylengthmin": 1
						},

						"int": {
							"type": "int",
							"defaultvalueint": 100
						},
						"intarray": {
							"type": "intarray",
							"defaultvalueint": 100,
							"arraylengthmin": 1
						},
						"float": {
							"type": "float",
							"defaultvaluefloat": 1.5
						},
						"floatarray": {
							"type": "floatarray",
							"defaultvaluefloat": 1.5,
							"arraylengthmin": 1
						},
						"string": {
							"type": "string",
							"defaultvaluestring": "foo"
						},
						"stringarray": {
							"type": "stringarray",
							"defaultvaluestring": "foo",
							"arraylengthmin": 1
						},
						"stringmap": {
							"type": "stringmap"
						},

						"key": {
							"type": "key",
							"keypath": ["data", "enum"],
							"defaultvaluekey": "a"
						},
						"keyarray": {
							"type": "keyarray",
							"keypath": ["data", "enum"],
							"defaultvaluekey": "a",
							"arraylengthmin": 1
						},

						"document": {
							"type": "document",
							"defaultvaluedocumenttype": "child",
							"documenttypearray": ["child"]
						},
						"documentarray": {
							"type": "documentarray",
							"defaultvaluedocumenttype": "child",
							"documenttypearray": ["child"],
							"arraylengthmin": 1
						},
						"iddocumentmap": {
							"type": "iddocumentmap",
							"defaultvaluedocumenttype" : "idchild",
							"documenttypearray" : ["idchild"]
						}
					}
				}
			},
			"documenttypes": {
				"type": {
					"value": ["data", "type", "value"]
				},
				"child": {
					"value": ["data", "type", "child"]
				},
				"idchild": {
					"value": ["data", "type", "idchild"]
				}
			}
		};
		/**
						"iddocumentmap": {
							"type": "iddocumentmap",
							"defaultvaluedocumenttype": "child",
							"documenttypearray": ["child"]
						},
		 */

		const instructionContext = {};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);
		const documentA = documentManager.DocumentDataToDocument({"type" : "type"}, undefined);
		documentA.SetValue("bool", true);
		documentA.SetValue("boolarray", [true,false]);
		documentA.SetValue("int", 47);
		documentA.SetValue("intarray", [103,104]);
		documentA.SetValue("float", 47.5);
		documentA.SetValue("floatarray", [103.6,104.7]);
		documentA.SetValue("string", "bar");
		documentA.SetValue("stringarray", ["foo","bar"]);
		documentA.SetValue("key", "d");
		documentA.SetValue("keyarray", ["a","b"]);
		documentA.SetValue("stringmap", {"a":0,"b":0});

		const documentChild = documentManager.DocumentDataToDocument({"type":"child", "a":101}, undefined);
		documentA.SetValue("document", documentChild);

		const documentChildA = documentManager.DocumentDataToDocument({"type":"child", "a":102}, undefined);
		const documentChildB = documentManager.DocumentDataToDocument({"type":"child", "a":103}, undefined);
		documentA.SetValue("documentarray", [documentChildA, documentChildB]);

		const documentIDChildA = documentManager.DocumentDataToDocument({"type":"idchild", "id":"abcd"}, undefined);
		const documentIDChildB = documentManager.DocumentDataToDocument({"type":"idchild", "id":"efgh"}, undefined);
		documentA.SetValue("iddocumentmap", {"abcd" : documentIDChildA, "efgh" : documentIDChildB});

		const documentDataA = documentManager.DocumentToDocumentData(documentA);

		const jsonA = JSON.stringify(documentDataA);
		//console.log(jsonA);
		const documentDataB = JSON.parse(jsonA);
		const documentB = documentManager.DocumentDataToDocument(documentDataB, undefined);

		Test.DealTest(name + "GetValue bool", documentB.GetValue("bool"), true);
		Test.DealTest(name + "GetValue boolarray", JSON.stringify(documentB.GetValue("boolarray")), JSON.stringify([true,false]));
		Test.DealTest(name + "GetValue int", documentB.GetValue("int"), 47);
		Test.DealTest(name + "GetValue intarray", JSON.stringify(documentB.GetValue("intarray")), JSON.stringify([103,104]));
		Test.DealTest(name + "GetValue float", documentB.GetValue("float"), 47.5);
		Test.DealTest(name + "GetValue floatarray", JSON.stringify(documentB.GetValue("floatarray")), JSON.stringify([103.6,104.7]));
		Test.DealTest(name + "GetValue string", documentB.GetValue("string"), "bar");
		Test.DealTest(name + "GetValue stringarray", JSON.stringify(documentB.GetValue("stringarray")), JSON.stringify(["foo","bar"]));
		Test.DealTest(name + "GetValue key", documentB.GetValue("key"), "d");
		Test.DealTest(name + "GetValue keyarray", JSON.stringify(documentB.GetValue("keyarray")), JSON.stringify(["a","b"]));
		Test.DealTest(name + "GetValue stringmap", JSON.stringify(documentB.GetValue("stringmap")), JSON.stringify({"a":0,"b":0}));

		var documentChild2 = documentB.GetValue("document");
		Test.DealTest(name + "GetValue document", documentChild2 != null, true);
		Test.DealTest(name + "GetValue document value", documentChild2.GetValue("a"), 101);

		var documentArray = documentB.GetValue("documentarray");
		Test.DealTest(name + "GetValue documentarray", documentArray != null, true);
		Test.DealTest(name + "GetValue documentarray length", documentArray.length, 2);
		var documentChild3 = documentArray[0];
		Test.DealTest(name + "GetValue document0 value", documentChild3.GetValue("a"), 102);
		var documentChild4 = documentArray[1];
		Test.DealTest(name + "GetValue document1 value", documentChild4.GetValue("a"), 103);

		var documentMap = documentB.GetValue("iddocumentmap");
		Test.DealTest(name + "GetValue iddocumentmap", documentMap != null, true);
		Test.DealTest(name + "GetValue iddocumentmap abcd", "abcd" in documentMap, true);
		Test.DealTest(name + "GetValue iddocumentmap efgh", "efgh" in documentMap, true);

		const documentDataDefault = documentManager.NewDocumentData("type");
		const documentDataDefaultJson = JSON.stringify(documentDataDefault);
		const documentDefault = documentManager.DocumentDataToDocument(documentDataDefault);
		const documentDefaultScribe = documentManager.DocumentToDocumentData(documentDefault);
		const documentDefaultScribeJson = JSON.stringify(documentDefaultScribe);
		Test.DealTest(name + "Default", documentDefaultScribeJson, documentDataDefaultJson);

	});
}

const RunDocumentManagerRoundIDDocumentMap = function() {
	const name = "DocumentManagerRoundIDDocumentMap ";
	return Q(true).then(function(input){

		var messageLog = "";
		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);

		const staticData = {
			"data": {
				"type0": {
					"value": {
						"documentmap": {
							"type": "iddocumentmap",
							"defaultvaluedocumenttype" : "child0",
							"documenttypearray" : ["child0"]
						}
					}
				},
				"child0" : {
					"value": {
						"id" : {
							"type": "string",
							"defaultvaluestringrandid": true
						}
					}
				}
			},
			"documenttypes": {
				"type0": {
					"value": ["data", "type0", "value"]
				},
				"child0": {
					"value": ["data", "child0", "value"]
				}
			}
		};

		const instructionContext = {};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		const documentDataA = documentManager.NewDocumentData("type0");
		const documentDataChild0 = documentManager.NewDocumentData("child0");
		const documentDataChild1 = documentManager.NewDocumentData("child0");

		const documentA = documentManager.DocumentDataToDocument(documentDataA);
		const documentChild0 = documentManager.DocumentDataToDocument(documentDataChild0);
		const child0ID = documentChild0.GetValue("id");
		const documentChild1 = documentManager.DocumentDataToDocument(documentDataChild1);
		const child1ID = documentChild1.GetValue("id");
		const documentMap = {};
		documentMap[child0ID] = documentChild0;
		documentMap[child1ID] = documentChild1;
		documentA.SetValue("documentmap", documentMap);

		const documentDataB = documentManager.DocumentToDocumentData(documentA);
		const jsonB = JSON.stringify(documentDataB);
		//console.log(jsonB);

		const documentC = documentManager.DocumentDataToDocument(documentDataB);
		const documentDataD = documentManager.DocumentToDocumentData(documentC);
		const jsonD = JSON.stringify(documentDataD);

		Test.DealTest(name + "roundTrip", jsonB, jsonD);

		const documentMapD = documentC.GetValue("documentmap");
		Test.DealTest(name + "documentMapD", documentMapD != null, true);
		Test.DealTest(name + "documentMapD child0", child0ID in documentMapD, true);
		Test.DealTest(name + "documentMapD child1", child1ID in documentMapD, true);
	});
}

const RunDocumentManagerRoundDocument = function() {
	const name = "RunDocumentManagerRoundDocument ";
	return Q(true).then(function(input){

		var messageLog = "";
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);

		const staticData = {
			"documenttypes": {
				"test": {
					"value": [
						"test"
					]
				},
				"child":{
					"value": [
						"child"
					]
				}
			},
			"child" : {
				"id" : {
					"type" : "string"
				}
			},
			"test" : {
				"document" : {
					"type" : "document",
					"documenttypearray" : ["child"]
				}
			}
		};

		const instructionContext = {};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		const documentData = documentManager.NewDocumentData("test");
		//console.log(JSON.stringify(documentData));
		const document = documentManager.DocumentDataToDocument(documentData);
		//console.log("document:" + document);
		const child = document.GetValue("document");
		//console.log("child:" + JSON.stringify(child));

		Test.DealTest(name + "c", child != null, true);

	});
}

const RunDocumentManagerStringRandId = function() {
	const name = "DocumentManagerStringRandId ";
	return Q(true).then(function(input){
		const context = { "console": console };
		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);

		const staticData = {
			"documenttypes": {
				"test": {
					"value": [
						"test"
					]
				},
			},
			"test" : {
				"id" : {
					"type" : "string",
					"defaultvaluestringrandid" : true
				}
			}
		};

		const documentManager = context.c.DocumentManager.Factory(staticData);
		const documentData = documentManager.NewDocumentData("test");

		console.log("randID:" + JSON.stringify(documentData));

	});
}


