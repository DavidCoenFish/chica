const Q = require('q');
const Test = require("./../modules/test.js");
const WrapJavaScript = require("./../modules/wrapjavascript.js");

module.exports = function(promiseFactoryArray) {
	promiseFactoryArray.push(RunActionContextLuckRoll);
}

const RunActionContextLuckRoll = function() {
	const name = "ActionContextLuckRoll ";
	return Q(true).then(function(input){
		//console.log(name + "start");

		const context = { "console": console };

		WrapJavaScript("./output/common.min.js", context);

		Test.DealTest(name + "c", context.c != null, true);
		Test.DealTest(name + "c.DocumentManager", context.c.DocumentManager != null, true);
		Test.DealTest(name + "c.DocumentManager.Factory", context.c.DocumentManager.Factory != null, true);
		const staticData = {
			"locale": {
				"diceroll" : "__A__d__B__+__C__",
				"lessequal" : "__A__ Less than or equal __B__",
				"pass" : "Pass",
				"add" : "__A__ + __B__",
				"threshold_adjusted" : "Threshold adjusted",
				"baneful_force_level" : "Baneful force level",
				"threshold" : "Threshold",
				"roll_adjusted" : "Roll adjusted",
				"attribute_adjustment" : "Attribute adjustment",
				"character_level" : "Character level",
				"roll" : "Roll",
			},
			"documenttypes" : {
				"action_luck_roll_input" : {
					"value" : ["action_luck_roll_input", "value"],
				},
				"action_luck_roll" : {
					"value" : ["action_luck_roll", "value"],
					"calculate" : ["action_luck_roll", "calculate"]
				},
			},
			"action_luck_roll_input" : {
				"value" : {
					"random_seed" : {
						"type" : "int",
						"defaultvalueintuserand" : true,
						"intrangehigh" : 233279,
					},
					"character_level" : {
						"type" : "int",
					},
					"attribute_adjustment" : {
						"type" : "float",
					},
					"threshold" : {
						"type" : "float",
					},
					"baneful_force_level" : {
						"type" : "int",
					},
				},
			},
			"action_luck_roll" : {
				"value" : {
					"input" : {
						"type" : "document",
						"documenttypearray" : ["action_luck_roll_input"],
					},
					"rand" : {
						"type" : "floatarray"
					},
				},
				"calculate" : {
					"pass" : {
						"type": "bool",
						"data": [
							{
								"op": "getnode",
								"value": "roll_adjusted"
							},
							{
								"op": "getnode",
								"value": "threshold_adjusted"
							},
							{
								"op": "lessequal",
							},
						]
					},
					"roll" : {
						"type": "int",
						"data": [
							{
								"op": "getnode",
								"value": "rand"
							},
							{
								"op": "pushconst",
								"value": 0
							},
							{
								"op": "pushconst",
								"value": 30
							},
							{
								"op": "pushconst",
								"value": 1
							},
							{
								"op": "f4",
								"value": "diceroll"
							},
						]
					},
					"roll_adjusted" : {
						"type": "float",
						"data": [
							{
								"op": "getnode",
								"value": "roll"
							},
							{
								"op": "getnode",
								"value": "input"
							},
							{
								"op": "pushconst",
								"value": "character_level"
							},
							{
								"op": "getdocumentvalue",
							},
							{
								"op": "f2",
								"value": "add"
							},
							{
								"op": "getnode",
								"value": "input"
							},
							{
								"op": "pushconst",
								"value": "attribute_adjustment"
							},
							{
								"op": "getdocumentvalue",
							},
							{
								"op": "f2",
								"value": "add"
							},
						]
					},
					"threshold_adjusted" : {
						"type": "float",
						"data": [
							{
								"op": "getnode",
								"value": "input"
							},
							{
								"op": "pushconst",
								"value": "threshold"
							},
							{
								"op": "getdocumentvalue",
							},
							{
								"op": "getnode",
								"value": "input"
							},
							{
								"op": "pushconst",
								"value": "baneful_force_level"
							},
							{
								"op": "getdocumentvalue",
							},
							{
								"op": "f2",
								"value": "add"
							},
						]
					},
				}
			},
		};
		const instructionContext = {
			"diceroll" : function(in_count, in_sides, in_add, in_randArray){
				var sum = in_add;
				for (var index = 0; index < in_count; ++index){
					sum += Math.ceil(in_randArray[index] * in_sides);
				}
				return sum;
			},
			"add" : function(a, b){ return (a + b); },
		};
		const actionContext = {
			"luckroll" : {
				"input" : "action_luck_roll_input",
				"run" : function (in_documentManager, in_inputDocument, in_units, in_makeDeltaLog, in_stateOrUndefined) {
					const randomSeed = in_inputDocument.GetValue("random_seed");
					const randomSequence = context.c.RandomSequence.Factory(randomSeed);
					//const roll = c.Action.RollDice(randomSequence, 30);
					const rand = [randomSequence.Random()]; 
					const newRandomSeed = randomSequence.GetCurrentSeed();

					const actionLuckRollDocumentData = in_documentManager.NewDocumentData("action_luck_roll");
					const actionLuckRollDocument = in_documentManager.DocumentDataToDocument(actionLuckRollDocumentData);
					actionLuckRollDocument.SetValue("rand", rand);
					actionLuckRollDocument.SetValue("input", in_inputDocument);
					var pass = actionLuckRollDocument.GetValue("pass")

					var result = {
						"finished" : true,
						"state" : { "result" : pass, "seed" : newRandomSeed }
					};
					if (true === in_makeDeltaLog){
						var tooltipArray = actionLuckRollDocument.GetTooltip("pass", in_units);
						if (tooltipArray !== undefined){
							result["delta_log"] = [tooltipArray];
						}
					}

					return result;
				}
			}
		};
		const documentManager = context.c.DocumentManager.Factory(staticData, instructionContext, actionContext);

		Test.DealTest(name + "documentManager", documentManager != null, true);
		const inputDocumentData = documentManager.NewDocumentData("action_luck_roll_input");
		Test.DealTest(name + "inputDocumentData", inputDocumentData != null, true);
		const inputDocument = documentManager.DocumentDataToDocument(inputDocumentData);
		Test.DealTest(name + "inputDocument", inputDocument != null, true);

		inputDocument.SetValue("random_seed", 100);
		inputDocument.SetValue("character_level", 4);
		inputDocument.SetValue("attribute_adjustment", 3);
		inputDocument.SetValue("threshold", 15);
		inputDocument.SetValue("baneful_force_level", 5);
		//console.log("random_seed:" + inputDocument.GetValue("random_seed"));

		const result = documentManager.RunAction("luckroll", inputDocument, "metric", true, undefined);
		//console.log("result:" + JSON.stringify(result));
	});
}

