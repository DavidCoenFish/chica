c.InstructionContext = {}
c["InstructionContext"] = c.InstructionContext;

//fn1
c.InstructionContext["floor"] = function (in_paramA) {
	return Math.floor(in_paramA);
}
c.InstructionContext["ceil"] = function (in_paramA) {
	return Math.ceil(in_paramA);
}
c.InstructionContext["log2"] = function (in_paramA) {
	return Math.log2(in_paramA);
}
c.InstructionContext["sumarray"] = function (in_paramA) {
	var result = 0;
	if (in_paramA != undefined){
		for (var index = 0, total = in_paramA.length; index < total; index++) {
			result += in_paramA[index];
		}
	}
	return result;
}
c.InstructionContext["abs"] = function (in_paramA) {
	return Math.abs(in_paramA);
}
c.InstructionContext["length"] = function (in_paramA) {
	//console.log("c.InstructionContext.lqre.length in_paramA:" + in_paramA);
	var result = 0;
	if (true === c.IsArray(in_paramA)){
	//if ((in_paramA !== undefined) && ("length" in in_paramA)){
		result = in_paramA.length;
	}
	//console.log("c.InstructionContext.lqre.length result:" + result);
	return result;
}

//fn2
c.InstructionContext["add"] = function (in_paramA, in_paramB) {
	return (in_paramA + in_paramB);
}
c.InstructionContext["minus"] = function (in_paramA, in_paramB) {
	return (in_paramA - in_paramB);
}
c.InstructionContext["mul"] = function (in_paramA, in_paramB) {
	return (in_paramA * in_paramB);
}
c.InstructionContext["div"] = function (in_paramA, in_paramB) {
	//c.Log(LOG, "InstructionContext.lqre.div in_paramA:" + in_paramA + " in_paramB:" + in_paramB);
	return (in_paramA / in_paramB);
}
c.InstructionContext["pow"] = function (in_paramA, in_paramB) {
	return Math.pow(in_paramA, in_paramB);
}
c.InstructionContext["max"] = function (in_paramA, in_paramB) {
	return Math.max(in_paramA, in_paramB);
}
c.InstructionContext["min"] = function (in_paramA, in_paramB) {
	return Math.min(in_paramA, in_paramB);
}
c.InstructionContext["dotcat"] = function (in_paramA, in_paramB) {
	return in_paramA + "." + in_paramB;
}
c.InstructionContext["log"] = function (in_paramA, in_paramB) {
	return Math.log(in_paramA)/Math.log(in_paramB);
}
//in_paramA target size of thing, in_paramB my size, result, {..., -1 : small, 0: medium, 1:large, ....}
c.InstructionContext["sizediff"] = function (in_paramA, in_paramB) {
	var diff = in_paramB - in_paramA;
	var result = 0;
	var neg = (diff < 0);
	diff = Math.abs(diff);
	result = Math.floor(diff + 0.5);
	if (true === neg){
		result = -result;
	}
	return result;
}

// paramA spent, paramB racialmax
c.InstructionContext["rawattribute"] = function (in_paramA, in_paramB, in_paramC) {
	var spent = in_paramA;
	var racialMax = in_paramB;
	var spentUnderRacialMax = Math.min(spent, racialMax - in_paramC);
	var spentOverRacialMax = Math.max(0, spent - spentUnderRacialMax);
	var result = in_paramC + spentUnderRacialMax + (0.5 * spentOverRacialMax);
	return result;
}

/*
use case, find the echantment object affecting an attribute
*/
// paramA member name (of a string), paramB array of documents, paramC array of strings to match
c.InstructionContext["arraydocumentfiltermember"] = function (in_paramA, in_paramB, in_paramC) {
	var result = [];
	for (var index = 0, total = in_paramB.length; index < total; index++) {
		var document = in_paramB[index];
		var key = document.GetValue(in_paramA);
		if (-1 !== in_paramC.indexOf(key)){
			result.push(document);
		}
	}

	return result;
}

/*
	use case, equipment loadout
*/
// paramA member name (of type string map), paramB array of documents, paramC string key to search in string map
c.InstructionContext["arraydocumentfiltermembermap"] = function (in_paramA, in_paramB, in_paramC) {
	var result = [];
	for (var index = 0, total = in_paramB.length; index < total; index++) {
		var document = in_paramB[index];
		var keymap = document.GetValue(in_paramA);
		if (keymap === undefined){
			continue;
		}
		if (in_paramC in keymap){
			result.push(document);
		}
	}
	//console.log("arraydocumentfiltermembermap result:" + result + " result.length:" + result.length);
	return result;
}

/*
	use case, select wearable equipment from loadout
*/
// paramA member name, paramB array of documents, paramC value to compair with member
c.InstructionContext["arraydocumentfiltermemberequal"] = function (in_paramA, in_paramB, in_paramC) {
	var result = [];
	for (var index = 0, total = in_paramB.length; index < total; index++) {
		var document = in_paramB[index];
		var keyValue = document.GetValue(in_paramA);
		if (keyValue === in_paramC){
			result.push(document);
		}
	}
	return result;
}

/*
	use case, select classes that effect the player
*/
// paramA max length, paramB array
c.InstructionContext["arrayfilterlength"] = function (in_paramA, in_paramB) {
	var result = [];
	if (in_paramB !== undefined){
		for (var index = 0, total = Math.min(in_paramB.length, in_paramA); index < total; index++) {
			var item = in_paramB[index];
			result.push(item);
		}
	}
	return result;
}

/*
	use case, select armor from equipment
*/
// paramA type, paramB array of documents
c.InstructionContext["arraydocumentfiltertype"] = function (in_paramA, in_paramB) {
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
}

//in_paramA loadout name, in_paramB mode data array
c.InstructionContext["getmodeindex"] = function (in_paramA, in_paramB) {
	//console.log("getmodeindex in_paramA:" + in_paramA + " in_paramB:" + in_paramB);

	if (in_paramB !== undefined){
		for (var index = 0, total = in_paramB.length; index < total; index++) {
			var document = in_paramB[index];
			var loadoutLeft = document.GetValue("loadout_left_hand");
			var loadoutRight = document.GetValue("loadout_right_hand");
			var loadoutLeftRight = document.GetValue("loadout_left_right_hand");
			//console.log("getmodeindex index:" + index + " in_paramA:" + in_paramA + " loadoutLeft:" + JSON.stringify(loadoutLeft)  + " loadoutRight:" + JSON.stringify(loadoutRight) + " loadoutLeftRight:" + JSON.stringify(loadoutLeftRight));
			if ((-1 != loadoutLeft.indexOf(in_paramA)) ||
				(-1 != loadoutRight.indexOf(in_paramA)) ||
				(-1 != loadoutLeftRight.indexOf(in_paramA))){
				return index;
			}
		}
	}
	return undefined;
}

/*
//in_paramA loadout name, in_paramB static data array, in_paramC in_staticModeData, in_paramD in_modeIndex
c.InstructionContext.lqre["ismodevalid"] = function (in_paramA, in_paramB, in_paramC, in_paramD) {
	
	var best = undefined;
	for (var index = 0, total = in_paramB.length; index < total; index++) {
		var document = in_paramB[index];
		var loadoutLeft = document.GetValue("loadout_left_hand");
		var loadoutRight = document.GetValue("loadout_right_hand");
		var loadoutLeftRight = document.GetValue("loadout_left_right_hand");
		if ((in_paramA in loadoutLeft) ||
			(in_paramA in loadoutRight) ||
			(in_paramA in loadoutLeftRight)){
			return index;
		}
	}
	return undefined;
}
*/

// paramA array of documents with level and start time, return undefined if none
c.InstructionContext["selecthighestlevel"] = function (in_paramA) {
	var best = undefined;
	for (var index = 0, total = in_paramA.length; index < total; index++) {
		var node = in_paramA[index];

		if (true !== node.GetValue("active")){
			continue;
		}

		if (best === undefined){
			best = node;
			continue;
		}
		var bestLevel = best.GetValue("level");
		var nodeLevel = node.GetValue("level");
		if (bestLevel < nodeLevel){
			best = node;
			continue;
		}
		if (bestLevel != nodeLevel){
			continue;
		}

		if (node.GetValue("start") < best.GetValue("start")){
			best = node;
		}
	}
	return best;
}

// paramA restrictions, paramB not restrictions, paramC object{key:bool}
c.InstructionContext["evaluerestrictions"] = function (in_paramA, in_paramB, in_paramC) {
	//console.log("evaluerestrictions in_paramA:" + JSON.stringify(in_paramA) + " in_paramB:" + JSON.stringify(in_paramB) + " in_paramC:" + JSON.stringify(in_paramC));
	if (in_paramA !== undefined){
		for (var index = 0, total = in_paramA.length; index < total; index++) {
			const name = in_paramA[index];
			if (true !== in_paramC[name]){
				//console.log(" " + name + " false");
				return false;
			}
		}
	}
	if (in_paramB !== undefined){
		for (var index = 0, total = in_paramB.length; index < total; index++) {
			const name = in_paramB[index];
			if (false !== in_paramC[name]){
				//console.log(" not " + name + " false");
				return false;
			}
		}
	}
	//console.log(" true");
	return true;
}

// paramA static data, paramB attribute object
c.InstructionContext["evalueattributes"] = function (in_paramA, in_paramB) {
	//console.log("evalueattributes in_paramA:" + JSON.stringify(in_paramA) + " in_paramB:" + JSON.stringify(in_paramB));
	for (var attributeName in in_paramB) {
		if (false === in_paramB.hasOwnProperty(attributeName)) {
			continue;
		}
		var attributeValue = in_paramB[attributeName];
		if (attributeName in in_paramA){
			var requiredAttribute = in_paramA[attributeName];
			if (attributeValue < requiredAttribute){
				//console.log(" not " + attributeName + " false");
				return false;
			}
		}
	}
	//console.log(" true");
	return true;	
}

// paramA static data of training classifications, paramB array of object{"skill":string,"training":string}
/*
in_paramA:{"schooled":0,"reviewed":1,"versed":2,"specialized":3,"expert":4} 
in_paramB:[{"training":"reviewed","skill":"wield_spear"},{"training":"reviewed","skill":"throw_spear"},{"training":"reviewed","skill":"training_animals"},{"training":"reviewed","skill":"rural_stealthing"}]
*/
c.InstructionContext["maketrainingmap"] = function (in_paramA, in_paramB) {
	//console.log("maketrainingmap in_paramA:" + JSON.stringify(in_paramA) + " in_paramB:" + JSON.stringify(in_paramB));
	var result = {};

	if (in_paramB !== undefined){
		for (var index = 0, total = in_paramB.length; index < total; index++) {
			var item = in_paramB[index];
			var skill = item["skill"];
			var training = item["training"];
			if (false === (training in in_paramA)){
				//silent bail?
				//console.log(" training:" + training + " not found");
				continue;
			}
			var trainingAmount = in_paramA[training];
			if ((false === (skill in result)) || (result[skill] < trainingAmount)){
				result[skill] = trainingAmount;
			}
		}
	}

	return result;
}

// paramA skill array, paramB skill training map object{key:skill:string, value:trainingAmount:int}
c.InstructionContext["makeskillmap"] = function (in_paramA, in_paramB) {
	var result = {};
	
	if (in_paramA !== undefined){
		for (var index = 0, total = in_paramA.length; index < total; index++) {
			var skillDocument = in_paramA[index];
			var name = skillDocument.GetValue("skill");
			var level = skillDocument.GetValue("skill_level"); // level + training
			result[name] = level;
		}
	}

	if (in_paramB !== undefined){
		for (var skillName in in_paramB) {
			if (false === in_paramB.hasOwnProperty(skillName)) {
				continue;
			}
			if (skillName in result){
				continue;
			}
			result[skillName] = in_paramB[skillName];
		}
	}

	return result;
}

// paramA array relevant_skills:stringarray, paramB similar_skills:stringarray, paramC skillMap:object<string,int>, paramD default
c.InstructionContext["selectbestskill"] = function (in_paramA, in_paramB, in_paramC, in_paramD) {
	var result = in_paramD;

	//console.log("selectbestskill in_paramA:" + JSON.stringify(in_paramA) + " in_paramB:" + JSON.stringify(in_paramB) + " in_paramC:" + JSON.stringify(in_paramC) + " in_paramD:" + JSON.stringify(in_paramD));

	//relevant_skills
	if (in_paramC !== undefined){
		if (in_paramA !== undefined){
			for (var index = 0, total = in_paramA.length; index < total; index++) {
				var skillName = in_paramA[index];
				if (skillName in in_paramC){
					result = Math.max(result, in_paramC[skillName]);
				}
			}
		}

		//similar_skills
		if (in_paramB !== undefined){
			for (var index = 0, total = in_paramB.length; index < total; index++) {
				var skillName = in_paramB[index];
				if (skillName in in_paramC){
					var value = Math.floor(in_paramC[skillName] / 2);
					result = Math.max(result, value);
				}
			}
		}
	}

	return result;
}

//
/*
improvements? arraydiceroll(in_arrayRand, in_sides) return array of rolls for each item in in_arrayRand 
c.InstructionContext["diceroll"] = function (in_count, in_sides, in_add, in_randArray) {
	var sum = in_add;
	for (var index = 0; index < in_count; ++index){
		sum += Math.ceil(in_randArray[index] * in_sides);
	}
	return sum;
}
 */

c.InstructionContext["diceroll"] = function (in_sides, in_rand) {
	const result = Math.ceil(in_rand * in_sides);
	return result;
}

c.InstructionContext["dicerollarray"] = function (in_sides, in_randArray) {
	var resultArray = [];
	for (var index = 0; index < in_randArray; ++index){
		resultArray[index] = Math.ceil(in_randArray[index] * in_sides);
	}
	return resultArray;
}
