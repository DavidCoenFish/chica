/*
	result { 
		"delta_log" : [["text", {"text":string,"tooltip":string},..],..], //optional, feedback on what happened
		"finished" : bool,
		"result" : string, // used as lookup for mission jump
		"state" : {...}, // passed back to action if not finished
		... // other data such as the roll results, diff for display of action
	}
*/

c.ActionContext = {}
c["ActionContext"] = c.ActionContext;

const MakeRollActionRun = function(in_documentType) {
	return function (in_documentManager, in_inputDocument, in_units, in_makeDeltaLog, in_stateOrUndefined) { //pass document manager to create new documents for calculation of value/ tooltip?
		//console.log("MakeRollActionRun in_makeDeltaLog:" + in_makeDeltaLog);
		const randomSeed = in_inputDocument.GetValue("random_seed");
		const randomSequence = c.RandomSequence.Factory(randomSeed);
		const rand = randomSequence.Random();
		const newRandomSeed = randomSequence.GetCurrentSeed();

		const documentData = in_documentManager.NewDocumentData(in_documentType);
		const document = in_documentManager.DocumentDataToDocument(documentData);
		document.SetValue("input", in_inputDocument);
		document.SetValue("rand", rand);
		var pass = document.GetValue("pass");
		var roll = document.GetValue("roll");
		var diff = document.GetValue("diff");

		//const resultDocumentData = in_documentManager.DocumentToDocumentData(document);
		//console.log("resultDocumentData:" + JSON.stringify(resultDocumentData));

		var result = {
			"finished" : true,
			"result" : pass ? "pass" : "fail",
			"random_seed" : newRandomSeed,
			"roll":roll,
			"diff":diff
		};

		if (true === in_makeDeltaLog){
			var tooltipData = document.GetTooltip("pass", in_units);
			//console.log(" tooltipData:" + JSON.stringify(tooltipData));
			if (tooltipData !== undefined){
				result["delta_log"] = [tooltipData];
			}
		}

		return result;
	}
}

c.ActionContext["luckroll"] = { 
	"input" : "action_luck_roll_input",
	"run" : MakeRollActionRun("action_luck_roll")
}

c.ActionContext["attributeroll"] = { 
	"input" : "action_attribute_roll_input",
	"run" : MakeRollActionRun("action_attribute_roll")
}

c.ActionContext["successroll"] = { 
	"input" : "action_success_roll_input",
	"run" : MakeRollActionRun("action_success_roll")
}

c.ActionContext["chanceroll"] = { 
	"input" : "action_chance_roll_input",
	"run" : MakeRollActionRun("action_chance_roll")
}

c.ActionContext["competingattributeroll"] = { 
	"input" : "action_competing_attribute_roll_input",
	"run" : function (in_documentManager, in_inputDocument, in_units, in_makeDeltaLog, in_stateOrUndefined) {
		var randomSeed = in_inputDocument.GetValue("random_seed");
		if (in_stateOrUndefined !== undefined){
			randomSeed = in_stateOrUndefined["random_seed"];
		}
		const randomSequence = c.RandomSequence.Factory(randomSeed);
		const randA = randomSequence.Random();
		const randB = randomSequence.Random();
		const newRandomSeed = randomSequence.GetCurrentSeed();

		const documentData = in_documentManager.NewDocumentData("action_competing_attribute_roll");
		const document = in_documentManager.DocumentDataToDocument(documentData);
		document.SetValue("input", in_inputDocument);
		document.SetValue("rand_a", randA);
		document.SetValue("rand_b", randB);
		if (in_stateOrUndefined !== undefined){
			document.SetValue("state", in_stateOrUndefined);
		}

		const passA = document.GetValue("pass_a");
		const passB = document.GetValue("pass_b");
		const totalA = document.GetValue("total_a");
		const totalB = document.GetValue("total_b");
		const finished = document.GetValue("finished");
		const rollA = document.GetValue("roll_a");
		const rollB = document.GetValue("roll_b");

		//const resultDocumentData = in_documentManager.DocumentToDocumentData(document);
		//console.log("resultDocumentData:" + JSON.stringify(resultDocumentData));

		var result = {
			"finished" : finished,
			"roll_a":rollA, 
			"roll_b":rollB,
			"diff": (totalA - totalB),
			"state" : { 
				"running_total_a": totalA,
				"running_total_b": totalB,
				"random_seed" : newRandomSeed, 
				}
		};
		if (finished === true){
			if (passA === true){
				result["result"] = "pass_a"
			} else if (passB === true){
				result["result"] = "pass_b"
			}
		}

		if (true === in_makeDeltaLog){
			var tooltipData = [];

			tooltipData.push(document.GetTooltip("total_a", in_units));
			tooltipData.push(document.GetTooltip("total_b", in_units));

			if (passA === true){
				tooltipData.push(document.GetTooltip("pass_a", in_units));
			} else if (passB === true){
				tooltipData.push(document.GetTooltip("pass_b", in_units));
			}

			if (0 < tooltipData.length){
				result["delta_log"] = tooltipData;
			}
		}

		return result;
	}
}


