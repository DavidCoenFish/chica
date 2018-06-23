const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunDocumentManagerLocaleHelperLevel);
	promiseFactoryArray.push(RunDocumentManagerLocaleHelperRacialMinimum);
	promiseFactoryArray.push(RunDocumentManagerLocaleHelperMassEquipment);
	promiseFactoryArray.push(RunDocumentManagerLocaleHelperArmorName);
}

const RunDocumentManagerLocaleHelperLevel = function() {
	const name = "DocumentManagerLocaleHelperLevel ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"documenttypes" : {
				"type" : {
					"value" : ["data", "type", "value"],
					"calculate" : ["data", "type", "calculate"]
				}
			},
			"locale": {
				"add": "(__A__ + __B__)",
				"div": "(__A__ / __B__)",
				"floor": "Floor(__A__)",
				"ceil": "Ceiling(__A__)",
				"log2": "Log(__A__)",
				"level": "Level",
				"experence_points": "Experence points",
			},
			"data" : {
				"type" : {
					"value" : {
						"experence_points" : {
							"type" : "int",
							"defaultvalueint" : 0
						},
					},
					"calculate" : {
						"level" : {
							"type": "int",
							"data": [
								{
									"op": "pushconst",
									"value": 25
								},
								{
									"op": "getnode",
									"value": "experence_points"
								},
								{
									"op": "f2",
									"value": "div"
								},
								{
									"op": "f1",
									"value": "floor"
								},
								{
									"op": "pushconst",
									"value": 1
								},
								{
									"op": "f2",
									"value": "add"
								},
								{
									"op": "f1",
									"value": "log2"
								},
								{
									"op": "f1",
									"value": "ceil"
								},
								{
									"op": "pushconst",
									"value": 1
								},
								{
									"op": "f2",
									"value": "add"
								}
							]
						}
					}
				}
			},
		};
		const instructionContext = {
				"add" : function(a, b){ return (a + b); },
				"div" : function(a, b){ return (a / b); },
				"ceil" : function(a){ return Math.ceil(a); },
				"floor" : function(a){ return Math.floor(a); },
				"log2" : function(a){ return Math.log2(a); },
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		Test.DealTest(name + "documentManager", documentManager != null, true);
		const documentData = documentManager.NewDocumentData("type");
		Test.DealTest(name + "documentData", documentData != null, true);
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);

		document.SetValue("experence_points", 100);
		Test.DealTest(name + "level", document.GetValue("level"), 4);

		var tooltipData = document.GetTooltip("level", "");
		//console.log("tooltipData:" + JSON.stringify(tooltipData));

		Test.DealTest(name + "tooltipData", JSON.stringify(tooltipData), "{\"text\":\"4\",\"tooltip\":[\"Level(4) = (1 + Ceiling(Log((1 + Floor((Experence points(100) / 25))))))\"]}");

	});
}

const RunDocumentManagerLocaleHelperRacialMinimum = function() {
	const name = "DocumentManagerLocaleHelperRacialMinimum ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"documenttypes" : {
				"type" : {
					"value" : ["data", "type", "value"],
					"calculate" : ["data", "type", "calculate"]
				}
			},
			"locale": {
				"get_static_data_object": "Get static data on path (__A__)",
				"race" : "Race",
				"racialminpath" : "Racial minimum path",
				"racialmin_ps" : "Racial minimum strength",
			},
			"data" : {
				"race" : {
					"human": {},
					"elf": {},
					"gnome": {},
				},
				"minimum_attribute": {
					"human": {
						"ps": -2,
						"st": -2,
						"ag": -2,
						"md": -2,
						"pc": -2,
						"wp": -2,
						"fa": -2,
						"delta": 0
					},
					"elf": {
						"ps": -2,
						"st": -2,
						"ag": -2,
						"md": -2,
						"pc": -2,
						"wp": 0,
						"fa": -2,
						"delta": -2
					},
					"gnome": {
						"ps": -4,
						"st": -2,
						"ag": 0,
						"md": -2,
						"pc": 1,
						"wp": -2,
						"fa": -2,
						"delta": -3
					},
				},

				"type" : {
					"value" : {
						"race" : {
							"type" : "key",
							"keypath": [ "data", "race" ],
							"defaultvaluekey" : "elf",
						},
					},
					"calculate" : {
						"racialminpath": {
							"type": "stringarray",
							"tooltipstop" : true,
							"data": [
								{
									"op": "getnode",
									"value": "race"
								},
								{
									"op": "pushconst",
									"value": "minimum_attribute"
								},
								{
									"op": "pushconst",
									"value": "data"
								},
								{ "op": "stacktoarray" }
							]
						},

						"racialmin_ps": {
							"type": "int",
							"data": [
								{
									"op": "getnode",
									"value": "racialminpath"
								},
								{ "op": "getstaticdataobject" },
								{
									"op": "pushconst",
									"value": "ps"
								},
								{ "op": "getobjectvalue" }
							]
						},
					}
				}
			},
		};
		const instructionContext = {};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		Test.DealTest(name + "documentManager", documentManager != null, true);
		const documentData = documentManager.NewDocumentData("type");
		Test.DealTest(name + "documentData", documentData != null, true);
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);

		document.SetValue("race", "gnome");
		Test.DealTest(name + "racialmin_ps", document.GetValue("racialmin_ps"), -4);

		var tooltipData = document.GetTooltip("racialmin_ps", "");
		//console.log("tooltipData:" + JSON.stringify(tooltipData));

		Test.DealTest(name + "tooltipData", JSON.stringify(tooltipData), "{\"text\":\"-4\",\"tooltip\":[\"Racial minimum strength(-4) = (Get static data on path (Racial minimum path(data,minimum_attribute,gnome))).ps\"]}");
	});
}

const RunDocumentManagerLocaleHelperMassEquipment = function() {
	const name = "DocumentManagerLocaleHelperMassEquipment ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"documenttypes" : {
				"type" : {
					"value" : ["data", "type", "value"],
					"calculate" : ["data", "type", "calculate"]
				},
				"child" : {
					"value" : ["data", "child", "value"]
				},
				"child2" : {}
			},
			"locale": {
				"sumarray" : "sum(__A__)",
			},
			"data" : {
				"type" : {
					"value" : {
						"equipment_array" : {
							"type" : "documentarray",
							"defaultvaluedocumenttype" : "child",
							"documenttypearray" : ["child", "child2"]
						}
					},
					"calculate" : {
						"mass_equipment" : {
							"type": "float",
							"data": [
								{
									"op": "getnode",
									"value": "equipment_array"
								},
								{
									"op": "pushconst",
									"value": "mass"
								},
								{ "op": "getdocumentarrayvalue" },
								{
									"op": "f1",
									"value": "sumarray"
								}
							]
						},
					},
				},
				"child" : {
					"value" : {
						"mass" : {
							"type" : "float",
						},
					},
				},
			},
		};
		const instructionContext = {
				"sumarray" : function(in_paramA){
					var result = 0;
					if (in_paramA != undefined){
						for (var index = 0, total = in_paramA.length; index < total; index++) {
							result += in_paramA[index];
						}
					}
					return result;
				},
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		Test.DealTest(name + "documentManager", documentManager != null, true);
		const documentData = documentManager.NewDocumentData("type");
		Test.DealTest(name + "documentData", documentData != null, true);
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);

		const arrayChildren = [];

		const documentDataChild2 = documentManager.NewDocumentData("child2");
		const documentChild2 = documentManager.DocumentDataToDocument(documentDataChild2);
		arrayChildren.push(documentChild2);

		for (var index = 0; index < 3; ++index){
			const documentDataChild = documentManager.NewDocumentData("child");
			const documentChild = documentManager.DocumentDataToDocument(documentDataChild);
			documentChild.SetValue("mass", (10 * index) + 0.5);
			arrayChildren.push(documentChild);
		}

		document.SetValue("equipment_array", arrayChildren);

		Test.DealTest(name + "mass_equipment", document.GetValue("mass_equipment"), 31.5);

		var tooltipData = document.GetTooltip("mass_equipment", "");
		//console.log("tooltipData:" + JSON.stringify(tooltipData));
		Test.DealTest(name + "tooltipData", JSON.stringify(tooltipData), "{\"text\":\"31.5\",\"tooltip\":[\"mass_equipment(31.5) = sum(mass(0.5), mass(10.5), mass(20.5))\"]}");
	});
}

const RunDocumentManagerLocaleHelperArmorName = function() { //armor_name
	const name = "DocumentManagerLocaleHelperArmorName ";
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
					"value" : ["character", "value"],
					"calculate" : ["character", "calculate"]
				},
				"armor" : {
					"value" : ["armor", "value"],
					"calculate" : ["armor", "calculate"],
				},
				"weapon" : {},
			},
			"locale": {
				"banded": "Banded armor",
				"chainmail": "Chainmail",
				"chain_breastplate": "Chain and breastplate",
				"arraydocumentfiltermemberequal" : "Filter for member (__A__, __B__, __C__)",
				"arraydocumentfiltertype" : "Filter for type (__A__, <__B__>)",
				"replace_undefined" : "If (__B__) undefined then replace with (__A__)",
				"none":"None",
				"armor_name":"Armor name",
				"name":"Name",
			},
			"character" : {
				"value" : {
					"loadout_equipment_all" : {
						"type": "documentarray",
						"documenttypearray": [ "armor" ]
					},
				},
				"calculate" : {
					"loadout_active": {
						"type": "documentarray",
						"data": [
							{
								"op": "pushconst",
								"value": true
							},
							{
								"op": "getnode",
								"value": "loadout_equipment_all"
							},
							{
								"op": "pushconst",
								"value": "active"
							},
							{
								"op": "f3",
								"value": "arraydocumentfiltermemberequal"
							}
						]
					},
					"armor_name" : {
						"type": "string",
						"islocale": true,
						"data": [
							{
								"op": "getnode",
								"value": "loadout_active"
							},
							{
								"op": "pushconst",
								"value": "armor"
							},
							{
								"op": "f2",
								"value": "arraydocumentfiltertype"
							},
							{ "op": "arraytostack" },
							{
								"op": "pushconst",
								"value": "name"
							},
							{ "op": "getdocumentvalue" },
							{
								"op": "pushconst",
								"value": "none",
								"islocale":true,
							},
							{ "op": "replaceundefined" }
						]
					}
				},
			},
			"armor" : {
				"value" : {
					"active" : {
						"type" : "bool",
						"defaultvaluebool" : true,
					},
					"armor" : {
						"type" : "key",
						"keypath": [ "data", "armor" ],
						"defaultvaluekey" : "chainmail",
					},
				},
				"calculate" : {
					"name": {
						"type": "string",
						"tooltipstop": true,
						"islocale":true,
						"data": [
							{
								"op": "getnode",
								"value": "armor"
							}
						]
					},
				},
			},
			"data" : {
				"armor": {
					"banded": {},
					"chainmail": {},
					"chain_breastplate": {}
				},
			},
		};
		const instructionContext = {
				"arraydocumentfiltermemberequal" : function(in_paramA, in_paramB, in_paramC) {
					var result = [];
					for (var index = 0, total = in_paramB.length; index < total; index++) {
						var document = in_paramB[index];
						var keyValue = document.GetValue(in_paramA);
						if (keyValue === in_paramC){
							result.push(document);
						}
					}
					return result;
				},
				"arraydocumentfiltertype" : function(in_paramA, in_paramB) {
					var result = [];
					//console.log("arraydocumentfiltertype in_paramA:" + in_paramA + " in_paramB" + in_paramB);
					if (in_paramB !== undefined){
						for (var index = 0, total = in_paramB.length; index < total; index++) {
							var document = in_paramB[index];
							if (document === undefined){
								continue;
							}
							if (document.GetType() === in_paramA){
								result.push(document);
							}
						}
					}
					//console.log("arraydocumentfiltertype result:" + result);
					return result;
				},
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext);

		Test.DealTest(name + "documentManager", documentManager != null, true);
		const documentData = documentManager.NewDocumentData("character");
		Test.DealTest(name + "documentData", documentData != null, true);
		const document = documentManager.DocumentDataToDocument(documentData);
		Test.DealTest(name + "document", document != null, true);

		const arrayChildren = [];
		for (var index = 0; index < 1; ++index){
			const documentDataChild = documentManager.NewDocumentData("armor");
			const documentChild = documentManager.DocumentDataToDocument(documentDataChild);
			documentChild.SetValue("armor", "chain_breastplate");
			arrayChildren.push(documentChild);

			Test.DealTest(name + "name" + index, documentChild.GetValue("name"), "chain_breastplate");
			Test.DealTest(name + "nameDisplay" + index, documentChild.GetDisplayValue("name"), "Chain and breastplate");
		}

		Test.DealTest(name + "armor_name", document.GetValue("armor_name"), "none");
		var tooltipData = document.GetTooltip("armor_name", "");
		//console.log("tooltipData:" + JSON.stringify(tooltipData));

		//Test.DealTest(name + "tooltipData", JSON.stringify(tooltipData), "[{\"text\":\"31.5\",\"tooltip\":[\"mass_equipment(31.5) = sum(0.5, 10.5, 20.5)\"]}]");

		document.SetValue("loadout_equipment_all", arrayChildren);
		//console.log("document:" + document);

		Test.DealTest(name + "armor_name", document.GetValue("armor_name"), "chain_breastplate");

		var tooltipData = document.GetTooltip("armor_name", "");
		//console.log("tooltipData:" + JSON.stringify(tooltipData));

		//Test.DealTest(name + "tooltipData", JSON.stringify(tooltipData), "{\"text\":\"Chain and breastplate\",\"tooltip\":[\"Armor name(Chain and breastplate) = If (Name(Chain and breastplate)) undefined then replace with (None)\"]}");
		Test.DealTest(name + "tooltipData", JSON.stringify(tooltipData), "{\"text\":\"Chain and breastplate\",\"tooltip\":[\"Armor name(Chain and breastplate) = Chain and breastplate\"]}");
	});
}

