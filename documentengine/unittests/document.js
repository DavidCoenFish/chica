const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunDocument);
	promiseFactoryArray.push(RunDocumentParent);
	promiseFactoryArray.push(RunDocumentArrayParent);
	promiseFactoryArray.push(RunDocumentSetDisplayValue);
}

const RunDocument = function() {
	const name = "Document ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.Document", context.c.Document != null, true);
		Test.DealTest(name + "c.Document.Factory", context.c.Document.Factory != null, true);
		const document = context.c.Document.Factory("typeName", {}, undefined);

		Test.DealTest(name + "type", document.GetType(), "typeName");
	});
}

const RunDocumentParent = function() {
	const name = "DocumentParent ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"data" : {
				"parentDocument" : {
					"value" : {
						"value" : {
							"type" : "int",
							"defaultvalueint" : 0
						},
						"document" : {
							"type" : "document",
							"defaultvaluedocumenttype" : "childDocument",
							"documenttypearray": ["childDocument"]
						}
					}
				},
				"childDocument" : {
					"calculate" : {
						"calc" : {
							"data" : [
								{"op":"getparentnode", "value":"value"},
							]
						}
					}
				}
			},
			"documenttypes" : {
				"parentDocument" : {
					"value" : ["data", "parentDocument", "value"]
				},
				"childDocument" : {
					"calculate" : ["data", "childDocument", "calculate"]
				}
			}
		};

		const documentManager = context.c.DocumentManager.Factory(staticData, undefined);
		const documentData = documentManager.NewDocumentData("parentDocument");
		const document = documentManager.DocumentDataToDocument(documentData);

		//console.log("document:" + document);

		Test.DealTest(name + "document", document != null, true);
		const childDocument = document.GetValue("document");

		//console.log("childDocument:" + childDocument);

		Test.DealTest(name + "childDocument", childDocument != null, true);
		Test.DealTest(name + "childDocument type", childDocument.GetType(), "childDocument");
		const testValue0 = childDocument.GetValue("calc");
		Test.DealTest(name + "testValue0", testValue0, 0);

		document.SetValue("value", 5);

		const testValue1 = childDocument.GetValue("calc");
		Test.DealTest(name + "testValue1", testValue1, 5);

	});
}

const RunDocumentArrayParent = function() {
	const name = "DocumentArrayParent ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"data" : {
				"parentDocument" : {
					"value" : {
						"value" : {
							"type" : "int",
							"defaultvalueint" : 0
						},
						"documentarray" : {
							"type" : "documentarray",
							"defaultvaluedocumenttype" : "childDocument",
							"documenttypearray": ["childDocument"]
						}
					}
				},
				"childDocument" : {
					"calculate" : {
						"calc" : {
							"data" : [
								{"op":"getparentnode", "value":"value"},
							]
						}
					}
				}
			},
			"documenttypes" : {
				"parentDocument" : {
					"value" : ["data", "parentDocument", "value"]
				},
				"childDocument" : {
					"calculate" : ["data", "childDocument", "calculate"]
				}
			}
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, undefined);
		const documentData = documentManager.NewDocumentData("parentDocument");
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);


		const childDocumentData = documentManager.NewDocumentData("childDocument");
		const childDocument = documentManager.DocumentDataToDocument(childDocumentData);
		Test.DealTest(name + "childDocument", childDocument != null, true);

		document.SetValue("documentarray", [childDocument]);

		const testValue0 = childDocument.GetValue("calc");
		Test.DealTest(name + "testValue0", testValue0, 0);

		document.SetValue("value", 5);

		const testValue1 = childDocument.GetValue("calc");
		Test.DealTest(name + "testValue1", testValue1, 5);

		//console.log(document.toString());
	});
}

const RunDocumentSetDisplayValue = function() {
	const name = "DocumentSetDisplayValue ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"documenttypes" : {
				"character" : {
					"value" : ["data", "character", "value"]
				},
			},
			"data" : {
				"character" : {
					"value" : {
						"height" : {
							"type": "float",
							"dimension": "length",
							"floatrangelow": 0,
							"defaultvaluefloat": 185
						},
					},
				},
				"units": {
					"metric": {
						"length": {
							"convert": 1,
							"length": 0,
							"name0": "cm"
						},
					},
					"imperial": {
						"length": {
							"convert": 0.3937007874,
							"divisor": 12,
							"name0": "\"",
							"name1": "'"
						},
					},
				},
			},
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, undefined);
		const documentData = documentManager.NewDocumentData("character");
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);

		Test.DealTest(name + "height0", document.GetValue("height"), 185);
		Test.DealTest(name + "heightDisplay1", document.GetDisplayValue("height", "metric"), "185cm");
		Test.DealTest(name + "heightDisplay2", document.GetDisplayValue("height", "imperial"), "6'1\"");

		document.SetDisplayValue("height", "metric", "187cm");
		Test.DealTest(name + "height3", document.GetValue("height"), 187);
		Test.DealTest(name + "heightDisplay4", document.GetDisplayValue("height", "metric"), "187cm");
		Test.DealTest(name + "heightDisplay5", document.GetDisplayValue("height", "imperial"), "6'2\"");

		document.SetDisplayValue("height", "imperial", "5'10\"");
		Test.DealTest(name + "heightDisplay6", document.GetDisplayValue("height", "metric"), "178cm");
		Test.DealTest(name + "heightDisplay7", document.GetDisplayValue("height", "imperial"), "5'10\"");

	});
}
