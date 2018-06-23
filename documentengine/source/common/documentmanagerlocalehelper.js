goog.forwardDeclare("c.Document");

/*
*/
c.DocumentManagerLocaleHelper = {};

/**
 * @nosideefect
 * @param {!string} in_key
 * @param {!Object|undefined} in_staticData
 * @return {!string}
 in_staticData[c.SchemaStaticData.sLocale]
 */
c.DocumentManagerLocaleHelper.GetLocaleData = function(in_key, in_staticData) {
	const locale = (in_staticData != undefined) ? in_staticData[c.SchemaStaticData.sLocale] : undefined;
	if ((locale === undefined) || (false === (in_key in locale))){
		return in_key;
	}
	const result = locale[in_key];
	if (result === undefined){
		return in_key;
	}
	return result;
}

/**
 @nosideefect
 * @param {!string} in_propertyName
 * @param {!c.Document} in_document
 * @param {!Object|undefined} in_staticData
 * @param {!string} in_units
 * @return {!Object|undefined}
 a document property can have metadata indicating it is a locale or dimention. we also need the static data for the appropriate dimention
*/
c.DocumentManagerLocaleHelper.GetStaticUnitData = function(in_propertyName, in_document, in_units, in_staticData) {
	if ((in_propertyName === undefined) || (in_document === undefined) || (in_units === undefined)){
		return undefined;
	}

	const type = in_document.GetType();
	const data = in_staticData[c.SchemaStaticData.sDocumentTypes][type];
	const valueMetadataPath = data[c.SchemaStaticData.sDocumentTypesValue];
	const valueMetadataCollection = c.PathObjectGet(in_staticData, valueMetadataPath);
	const calculateMetadataPath = data[c.SchemaStaticData.sDocumentTypesCalculate];
	const calculateMetadataCollection = c.PathObjectGet(in_staticData, calculateMetadataPath);

	var dimension = undefined;
	var isLocale = undefined;
	if ((valueMetadataCollection !== undefined) && (in_propertyName in valueMetadataCollection)){
		var valueMetadata = valueMetadataCollection[in_propertyName];
		dimension = valueMetadata[c.SchemaStaticDataValue.sDimension];
	}

	if ((calculateMetadataCollection !== undefined) && (in_propertyName in calculateMetadataCollection)){
		var calculateMetadata = calculateMetadataCollection[in_propertyName];
		dimension = calculateMetadata[c.SchemaStaticDataCalculate.sDimension];
		isLocale = calculateMetadata[c.SchemaStaticDataCalculate.sIsLocale];
	}

	if (true === isLocale){
		return {"isLocale":true};
	}

	if (dimension === undefined){
		return undefined;
	}

	const staticUnitDataPath = [c.SchemaStaticData.sData, c.SchemaStaticData.sDataUnits, in_units, dimension];
	const staticUnitData = c.PathObjectGet(in_staticData, staticUnitDataPath);

	const result = Object.assign({"dimension":dimension}, staticUnitData);

	return result;
}

c.DocumentManagerLocaleHelper.MakeDisplayValue = function(in_value, in_type, in_units, in_dimentionOrUndefined, in_isLocale, in_staticData){
	if ((true === in_isLocale) || (in_type === c.SchemaStaticDataValue.Type.eKey)){
		return c.DocumentManagerLocaleHelper.GetLocaleData(in_value, in_staticData);
	}
	if (in_type === c.SchemaStaticDataValue.Type.eKeyArray){
		var result = "[";
		for (var index = 0, total = in_value.length; index < total; index++) {
			var item = in_value[index];
			if (0 !== index){
				result += ", ";
			}
			result += c.DocumentManagerLocaleHelper.GetLocaleData(item, in_staticData);
		}
		result += "]";
		return result;
	}
	if (in_type === c.SchemaStaticDataValue.Type.eKeyMap){
		var result = "[";
		var first = true;
		for (var key in in_value) {
			if (false === in_value.hasOwnProperty(key)) {
				continue;
			}
			if (first === true){
				first = false;
			} else {
				result += ", ";
			}
			result += c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData);
		}
		result += "]";
		return result;
	}

	switch (in_type){
		default:
			break;
		case c.SchemaStaticDataValue.Type.eDocument:
		case c.SchemaStaticDataValue.Type.eDocumentArray:
		case c.SchemaStaticDataValue.Type.eIDDocumentMap:
			return "";
	}

	var staticUnitData = undefined;
	if (in_dimentionOrUndefined !== undefined){
		const staticUnitDataPath = [c.SchemaStaticData.sData, c.SchemaStaticData.sDataUnits, in_units, in_dimentionOrUndefined];
		staticUnitData = c.PathObjectGet(in_staticData, staticUnitDataPath);
	}
	var result = c.DocumentManagerLocaleHelper.MakeDisplayValueUnit(in_value, staticUnitData);
	return result;
}

c.DocumentManagerLocaleHelper.UnmakeDisplayValue = function(in_displayValue, in_units, in_dimentionOrUndefined, in_staticData){
	c.Log(STACK, "UnmakeDisplayValue in_displayValue:" + in_displayValue + " in_units:" + in_units + " in_dimentionOrUndefined:" + in_dimentionOrUndefined);
	var staticUnitData = undefined;
	if (in_dimentionOrUndefined !== undefined){
		const staticUnitDataPath = [c.SchemaStaticData.sData, c.SchemaStaticData.sDataUnits, in_units, in_dimentionOrUndefined];
		//c.Log(DEBUG, " staticUnitDataPath:" + JSON.stringify(staticUnitDataPath));
		staticUnitData = c.PathObjectGet(in_staticData, staticUnitDataPath);
	}
	var result = c.DocumentManagerLocaleHelper.UnmakeDisplayValueUnit(in_displayValue, staticUnitData);
	return result;
}

c.DocumentManagerLocaleHelper.MakeDisplayValueUnit = function(in_value, in_staticUnitData) {
	if (in_value === undefined){
		return "";
	}
	if (in_staticUnitData === undefined){
		return in_value.toString();
	}
	var value = in_value * in_staticUnitData["convert"];
	var result = undefined;
	if (in_staticUnitData["divisor"] !== undefined){
		var neg = value < 0;
		value = Math.abs(value);
		value = value / in_staticUnitData["divisor"];
		var upperValue = Math.floor(value);
		value -= upperValue;
		value = (value * in_staticUnitData["divisor"]).toFixed(0);
		result = "" + ((neg === true) ? "-" : "") + upperValue.toFixed(0) + in_staticUnitData["name1"] + value + in_staticUnitData["name0"];
	} else {
		var length = 1;
		if (in_staticUnitData["length"] !== undefined){
			length = in_staticUnitData["length"];
		}
		result = value.toFixed(length) + in_staticUnitData["name0"];
	}
	return result;
}

c.DocumentManagerLocaleHelper.UnmakeDisplayValueUnit = function(in_displayValue, in_staticUnitData){
	c.Log(STACK, "UnmakeDisplayValueUnit in_displayValue:" + in_displayValue + " in_staticUnitData:" + JSON.stringify(in_staticUnitData));

	if (in_staticUnitData === undefined){
		return undefined;
	}

	var newValue = 0;
	if (in_staticUnitData["divisor"] !== undefined){
		var input = in_displayValue;
		input = input.split(in_staticUnitData["name0"])[0];
		var tokens = input.split(in_staticUnitData["name1"]);
		if (1 < tokens.length){
			newValue = 0;
			if (tokens[1] !== ""){
				newValue += (Math.max(0, Math.min(parseFloat(tokens[1]), in_staticUnitData["divisor"])));
			}
			if (tokens[0] !== ""){
				newValue += (parseFloat(tokens[0]) * in_staticUnitData["divisor"]);
			}
		} else if (0 < tokens.length){
			newValue = parseFloat(tokens[0]);
		}
	} else {
		var input = in_displayValue;
		input = input.split(in_staticUnitData["name0"])[0];
		newValue = parseFloat(input);
	}

	if ((newValue === undefined) || (true === isNaN(newValue))){
		newValue = 0;
	}

	newValue /= in_staticUnitData["convert"];

	if (true === isNaN(newValue)){
		newValue = 0;
	}

	return newValue;
}

/**
at the moment this simply returns a tooltip data with or without a popup, but it doesn't recurse
use case, tooltip for property names 
 * @nosideefect
 * @param {!string} in_propertyName
 * @param {!c.Document} in_document
 * @param {!string} in_units
 * @param {!Object|undefined} in_staticData
 * @return {!Object}
 */
c.DocumentManagerLocaleHelper.MakePropertyNameTooltipData = function(in_propertyName, in_document, in_units, in_staticData) {
	var staticUnitData = c.DocumentManagerLocaleHelper.GetStaticUnitData(in_propertyName, in_document, in_units, in_staticData);

	var result = undefined;
	var localeData = c.DocumentManagerLocaleHelper.GetLocaleData(in_propertyName, in_staticData);
	const tooltipKey = in_propertyName + "_tooltip";
	var tooltipLocaleText = c.DocumentManagerLocaleHelper.GetLocaleData(tooltipKey, in_staticData);
	var innerArray = undefined;
	if (tooltipKey !== tooltipLocaleText){
		innerArray = [tooltipLocaleText];
	}

	if ((staticUnitData !== undefined) && (innerArray !== undefined)){
		const param0 = c.DocumentManagerLocaleHelper.GetLocaleData("unit_" + in_units + "_" + staticUnitData["dimension"], in_staticData);
		innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__U__", param0);
	}

	if (innerArray !== undefined){
		result = [{"text": localeData, "tooltip" : innerArray}];
	} else {
		result = [localeData];
	}

	return result;
}

c.DocumentManagerLocaleHelper.PushAddString = function(in_array, in_thing){
	var thingIsString = c.IsString(in_thing);
	if ((true === thingIsString) && (in_thing.length <= 0)){
		return;
	}

	if ((0 < in_array.length) && (true === c.IsString(in_array[in_array.length - 1])) && (true === thingIsString)){
		if (0 < in_thing.length){
			in_array[in_array.length - 1] += in_thing;
		}
	} else if (c.IsArray(in_thing)){
		for (var index = 0, total = in_thing.length; index < total; index++) {
			var thing = in_thing[index];
			// in thing may be an array of ["front(", {"text":"data","tooltip":"foo..."},")end"] which we don't want to comma join?
			//if (0 !== index){
			//	c.DocumentManagerLocaleHelper.PushAddString(in_array, ", ");
			//}
			c.DocumentManagerLocaleHelper.PushAddString(in_array, thing);
		}
	} else if (undefined !== in_thing){
		if ((false === thingIsString) && ("text" in in_thing) && (false === ("tooltip" in in_thing))){
			c.DocumentManagerLocaleHelper.PushAddString(in_array, in_thing.text);
		} else {
			in_array.push(in_thing);
		}
	}
}

c.DocumentManagerLocaleHelper.SubstituteArrayString = function(in_array, in_key, in_thing){
	var result = [];
	for (var index = 0, total = in_array.length; index < total; index++) {
		var item = in_array[index];
		if (false === c.IsString(item)){
			c.DocumentManagerLocaleHelper.PushAddString(result, item);
			continue;
		}
		while(true){
			var n = item.indexOf(in_key);
			if (n === -1){
				break;
			}
			var front = item.substring(0, n);
			c.DocumentManagerLocaleHelper.PushAddString(result, front);
			c.DocumentManagerLocaleHelper.PushAddString(result, in_thing);
			item = item.substring(n + in_key.length);
		}
		
		c.DocumentManagerLocaleHelper.PushAddString(result, item);
	}
	return result;
}

