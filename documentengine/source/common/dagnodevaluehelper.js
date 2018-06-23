c.DagNodeValueHelper = {}
c["DagNodeValueHelper"] = c.DagNodeValueHelper;

// we have a value from the database, use it if we can get it into constraints, or get the default value from metadata
//  priority, preserve data, make data fit rules, default value (metadata), default value for type
//factoryValue
/**
 * @public
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData //the metadata row for this value
 * @param {!Object} in_staticData //the static data root
 * @param {!c.DocumentManager} in_documentManager
 * @param {!c.DagNodeValue} in_node
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValue = function(in_valueOrUndefined, in_metaData, in_staticData, in_documentManager, in_node){
	var type = in_metaData[c.SchemaStaticDataValue.sType];

	c.Log(STACK, "c.DagNodeValueHelper.FactoryValue type:" + type);

	switch (type){
	default:
		break;
	case c.SchemaStaticDataValue.Type.eBool:
		return c.DagNodeValueHelper.FactoryValueBool(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eBoolArray:
		return c.DagNodeValueHelper.FactoryValueBoolArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eInt:
		return c.DagNodeValueHelper.FactoryValueInt(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eIntArray:
		return c.DagNodeValueHelper.FactoryValueIntArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eFloat:
		return c.DagNodeValueHelper.FactoryValueFloat(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eFloatArray:
		return c.DagNodeValueHelper.FactoryValueFloatArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eString:
		return c.DagNodeValueHelper.FactoryValueString(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eStringArray:
		return c.DagNodeValueHelper.FactoryValueStringArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eStringMap:
		return c.DagNodeValueHelper.FactoryValueStringMap(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eKey:
		return c.DagNodeValueHelper.FactoryValueKey(in_valueOrUndefined, in_metaData, in_staticData);
	case c.SchemaStaticDataValue.Type.eKeyArray:
		return c.DagNodeValueHelper.FactoryValueKeyArray(in_valueOrUndefined, in_metaData, in_staticData);
	case c.SchemaStaticDataValue.Type.eKeyMap:
		return c.DagNodeValueHelper.FactoryValueKeyMap(in_valueOrUndefined, in_metaData, in_staticData);
	case c.SchemaStaticDataValue.Type.eDocument:
		return c.DagNodeValueHelper.FactoryValueDocument(in_valueOrUndefined, in_metaData, in_documentManager, in_node);
	case c.SchemaStaticDataValue.Type.eDocumentArray:
		return c.DagNodeValueHelper.FactoryValueDocumentArray(in_valueOrUndefined, in_metaData, in_documentManager, in_node);
	case c.SchemaStaticDataValue.Type.eIDDocumentMap:
		return c.DagNodeValueHelper.FactoryValueIDDocumentMap(in_valueOrUndefined, in_metaData, in_documentManager, in_node);
	case c.SchemaStaticDataValue.Type.eObject:
		return c.DagNodeValueHelper.FactoryValueObject(in_valueOrUndefined);
	}

	return undefined;
}
c.DagNodeValueHelper["FactoryValue"] = c.DagNodeValueHelper.FactoryValue;

/**
 * @private
 * @nosideefect
 * @param {?*} in_value
 * @param {?*} in_defaultValue
 * @param {!number} in_arrayMin
 * @param {!number} in_arrayMax
 * @return {undefined}
 */
c.DagNodeValueHelper.FactoryValueArray = function(in_value, in_defaultValue, in_arrayMin, in_arrayMax){
	if ((in_arrayMin !== undefined) && (in_value.length < in_arrayMin)){
		while (in_value.length < in_arrayMin){
			in_value.push(in_defaultValue);
		}
	}
	if ((in_arrayMax !== undefined) && (in_arrayMax < in_value.length)){
		in_value.length = in_arrayMax;
	}
	return;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_value
 * @param {!function()} in_defaultFactory
 * @param {!number} in_arrayMin
 * @param {!number} in_arrayMax
 * @return {undefined}
 */
c.DagNodeValueHelper.FactoryDefaultFunctionArray = function(in_value, in_defaultFactory, in_arrayMin, in_arrayMax){
	if ((in_arrayMin !== undefined) && (in_value.length < in_arrayMin)){
		while (in_value.length < in_arrayMin){
			in_value.push(in_defaultFactory());
		}
	}
	if ((in_arrayMax !== undefined) && (in_arrayMax < in_value.length)){
		in_value.length = in_arrayMax;
	}
	return;
}

/**
 * @private
 * @nosideefect
 * @param {!number} in_defaultValue
 * @param {!boolean|undefined} in_useRandOrUndefined
 * @param {!number|undefined} in_lowOrUndefined 
 * @param {!number|undefined} in_highOrUndefined
 * @return {!number}
 */
c.DagNodeValueHelper.MakeDefaultInt = function(in_defaultValue, in_useRandOrUndefined, in_lowOrUndefined, in_highOrUndefined){
	if (true !== in_useRandOrUndefined){
		return in_defaultValue;
	}
	// generate between high and low inclusive
	var low = (undefined !== in_lowOrUndefined) ? in_lowOrUndefined : 0;
	var high = ((undefined !== in_highOrUndefined) ? in_highOrUndefined : 1) + 1;
	var value = Math.floor(Math.random() * (high - low)) + low;
	return value;
}

/**
 * @private
 * @nosideefect
 * @param {!number} in_defaultValue
 * @param {!boolean|undefined} in_useRandOrUndefined
 * @param {!number|undefined} in_lowOrUndefined 
 * @param {!number|undefined} in_highOrUndefined
 * @return {!function():!number}
 */
c.DagNodeValueHelper.MakeDefaultIntFactory = function(in_defaultValue, in_useRandOrUndefined, in_lowOrUndefined, in_highOrUndefined){
	return function(){
		return c.DagNodeValueHelper.MakeDefaultInt(in_defaultValue, in_useRandOrUndefined, in_lowOrUndefined, in_highOrUndefined);
	}
}

/**
 * @private
 * @nosideefect
 * @param {!string} in_value
 * @return {!function():string}
 */
c.DagNodeValueHelper.MakeDefaultStringFactory = function(in_value){
	return function(){
		return (" " + in_value).slice(1);
	}
}

/**
 * @private
 * @nosideefect
 * @param {!Array<string>} in_keys
 * @return {!function():string}
 */
c.DagNodeValueHelper.MakeDefaultRandKeyFactory = function(in_keys){
	return function(){
		return in_keys[Math.floor(Math.random() * in_keys.length)];
	}
}

/**
 * @private
 * @nosideefect
 * @return {!function():string}
 */
c.DagNodeValueHelper.MakeDefaultRandIDFactory = function(){
	return function(){
		return c.DagNodeValueHelper.MakeRandID();
	}
}

/**
 * @private
 * @nosideefect
 * @return {!function():string}
 */
c.DagNodeValueHelper.MakeDefaultRandDatabaseIDFactory = function(){
	return function(){
		return c.DagNodeValueHelper.MakeRandDatabaseID();
	}
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueBool = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueBool];
	defaultValue = (defaultValue !== undefined) ? defaultValue : false;
	if (in_valueOrUndefined === true){
		return true;
	} else if (in_valueOrUndefined === false){
		return false;
	}
	return defaultValue;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueBoolArray = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueBool];
	defaultValue = (defaultValue !== undefined) ? defaultValue : false;
	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = in_valueOrUndefined;
	
		for (var index = 0, total = value.length; index < total; index++) {
			var innerValue = value[index];
			value[index] = (innerValue === true);
		}
	}
	else {
		value = [];
	}

	var arrayMin = in_metaData[c.SchemaStaticDataValue.sArrayLengthMin];
	var arrayMax = in_metaData[c.SchemaStaticDataValue.sArrayLengthMax];

	c.DagNodeValueHelper.FactoryValueArray(value, defaultValue, arrayMin, arrayMax);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueInt = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueInt];
	defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
	const defaultFromRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntUseRand];
	const defaultFromDateNow = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntDateNow];
	if (defaultFromDateNow === true){
		defaultValue = (new Date()).valueOf();
	}
	const minValue = in_metaData[c.SchemaStaticDataValue.sIntRangeLow];
	const maxValue = in_metaData[c.SchemaStaticDataValue.sIntRangeHigh];

	defaultValue = c.DagNodeValueHelper.MakeDefaultInt(defaultValue, defaultFromRand, minValue, maxValue);

	const value = c.DagNodeValueHelper.FactoryValueIntClean(in_valueOrUndefined, defaultValue, minValue, maxValue, defaultFromRand);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!number} in_defaultValue
 * @param {?number} in_minValue
 * @param {?number} in_maxValue
 * @return {!number}
 */
c.DagNodeValueHelper.FactoryValueIntClean = function(in_valueOrUndefined, in_defaultValue, in_minValue, in_maxValue, defaultFromRand){
	var value = undefined;
	if (typeof in_valueOrUndefined === "number"){
		value = Math.round(in_valueOrUndefined);
	} else {
		value = in_defaultValue;
	}
	if (in_minValue !== undefined){
		value = Math.max(in_minValue, value);
	}
	if (in_maxValue !== undefined){
		value = Math.min(in_maxValue, value);
	}

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueIntArray = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueInt];
	defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
	const defaultFromRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntUseRand];
	const defaultFromDateNow = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntDateNow];
	if (defaultFromDateNow === true){
		defaultValue = (new Date()).valueOf();
	}
	const minValue = in_metaData[c.SchemaStaticDataValue.sIntRangeLow];
	const maxValue = in_metaData[c.SchemaStaticDataValue.sIntRangeHigh];
	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = in_valueOrUndefined;
	
		for (var index = 0, total = value.length; index < total; index++) {
			var innerValue = value[index];
			defaultValue = c.DagNodeValueHelper.MakeDefaultInt(defaultValue, defaultFromRand, minValue, maxValue);
			innerValue = c.DagNodeValueHelper.FactoryValueIntClean(innerValue, defaultValue, minValue, maxValue, defaultFromRand);
			value[index] = innerValue;
		}
	}
	else {
		value = [];
	}

	var arrayMin = in_metaData[c.SchemaStaticDataValue.sArrayLengthMin];
	var arrayMax = in_metaData[c.SchemaStaticDataValue.sArrayLengthMax];
	c.DagNodeValueHelper.FactoryValueArray(value, defaultValue, arrayMin, arrayMax);

	var defaultFactory = c.DagNodeValueHelper.MakeDefaultIntFactory(defaultValue, defaultFromRand, minValue, maxValue);
	c.DagNodeValueHelper.FactoryDefaultFunctionArray(value, defaultFactory, arrayMin, arrayMax);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!number} in_defaultValue
 * @param {?number} in_minValue
 * @param {?number} in_maxValue
 * @return {!number}
 */
c.DagNodeValueHelper.FactoryValueFloatClean = function(in_valueOrUndefined, in_defaultValue, in_minValue, in_maxValue){
	var value = undefined;
	if (typeof in_valueOrUndefined === "number"){
		value = in_valueOrUndefined;
	} else {
		value = in_defaultValue;
	}
	if (in_minValue !== undefined){
		value = Math.max(in_minValue, value);
	}
	if (in_maxValue !== undefined){
		value = Math.min(in_maxValue, value);
	}

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueFloat = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueFloat];
	defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
	var minValue = in_metaData[c.SchemaStaticDataValue.sFloatRangeLow];
	var maxValue = in_metaData[c.SchemaStaticDataValue.sFloatRangeHigh];

	var value = c.DagNodeValueHelper.FactoryValueFloatClean(in_valueOrUndefined, defaultValue, minValue, maxValue);
	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueFloatArray = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueFloat];
	defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
	var minValue = in_metaData[c.SchemaStaticDataValue.sFloatRangeLow];
	var maxValue = in_metaData[c.SchemaStaticDataValue.sFloatRangeHigh];
	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = in_valueOrUndefined;
	
		for (var index = 0, total = value.length; index < total; index++) {
			var innerValue = value[index];
			innerValue = c.DagNodeValueHelper.FactoryValueFloatClean(innerValue, defaultValue, minValue, maxValue);
			value[index] = innerValue;
		}
	}
	else {
		value = [];
	}

	var arrayMin = in_metaData[c.SchemaStaticDataValue.sArrayLengthMin];
	var arrayMax = in_metaData[c.SchemaStaticDataValue.sArrayLengthMax];
	c.DagNodeValueHelper.FactoryValueArray(value, defaultValue, arrayMin, arrayMax);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!string} in_defaultValue
 * @param {!(number|undefined)} in_minValue
 * @param {!(number|undefined)} in_maxValue
 * @return {!(string|String)}
 */
c.DagNodeValueHelper.FactoryValueStringClean = function(in_valueOrUndefined, in_defaultValue, in_minValue, in_maxValue){
	var value = undefined;
	if (typeof in_valueOrUndefined === "string" || in_valueOrUndefined instanceof String){
		value = in_valueOrUndefined;
	} else {
		value = in_defaultValue;
	}
	if ((in_minValue !== undefined) && (value.length < in_minValue)){
		while (value.length < in_minValue){
			value += "_";
		}
	}
	if ((in_maxValue !== undefined) && (in_maxValue < value.length)){
		value = value.substr(0, in_maxValue);
	}
	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueString = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueString];
	defaultValue = (defaultValue !== undefined) ? defaultValue : "";
	const stringRandId = in_metaData[c.SchemaStaticDataValue.sDefaultValueStringRandId];
	if (true === stringRandId){
		defaultValue = c.DagNodeValueHelper.MakeRandID();
	}
	const stringRandDatabaseId = in_metaData[c.SchemaStaticDataValue.sDefaultValueStringRandDatabaseId];
	if (true === stringRandDatabaseId){
		defaultValue = c.DagNodeValueHelper.MakeRandDatabaseID();
	}
	const minValue = in_metaData[c.SchemaStaticDataValue.sStringLengthMin];
	const maxValue = in_metaData[c.SchemaStaticDataValue.sStringLengthMax];
	const value = c.DagNodeValueHelper.FactoryValueStringClean(in_valueOrUndefined, defaultValue, minValue, maxValue);

	//c.Log(DEBUG, "FactoryValueString");
	//c.Log(DEBUG, "stringRandId:" + stringRandId);
	//c.Log(DEBUG, "stringRandDatabaseId:" + stringRandDatabaseId);
	//c.Log(DEBUG, "defaultValue:" + defaultValue);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueStringArray = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueString];
	defaultValue = (defaultValue !== undefined) ? defaultValue : "";
	var minValue = in_metaData[c.SchemaStaticDataValue.sStringLengthMin];
	var maxValue = in_metaData[c.SchemaStaticDataValue.sStringLengthMax];

	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = in_valueOrUndefined;
	
		for (var index = 0, total = value.length; index < total; index++) {
			var innerValue = value[index];
			innerValue = c.DagNodeValueHelper.FactoryValueStringClean(innerValue, defaultValue, minValue, maxValue);
			value[index] = innerValue;
		}
	}
	else {
		value = [];
	}

	const arrayMin = in_metaData[c.SchemaStaticDataValue.sArrayLengthMin];
	const arrayMax = in_metaData[c.SchemaStaticDataValue.sArrayLengthMax];
	var defaultStringFunction = c.DagNodeValueHelper.MakeDefaultStringFactory(defaultValue);
	const stringRandId = in_metaData[c.SchemaStaticDataValue.sDefaultValueStringRandId];
	if (true === stringRandId){
		defaultStringFunction = c.DagNodeValueHelper.MakeDefaultRandIDFactory;
	}
	const stringRandDatabaseId = in_metaData[c.SchemaStaticDataValue.sDefaultValueStringRandDatabaseId];
	if (true === stringRandDatabaseId){
		defaultStringFunction = c.DagNodeValueHelper.MakeDefaultRandDatabaseIDFactory;
	}
	c.DagNodeValueHelper.FactoryDefaultFunctionArray(value, defaultStringFunction, arrayMin, arrayMax);

	return value;
}


/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {undefined|!Object} in_defaultValue
 * @return {!Object}
expect value or defaultValue to be an array of strings, return an object of {"hash_string" : 0, ... }
 */
c.DagNodeValueHelper.FactoryValueStringMapClean = function(in_valueOrUndefined, in_defaultValue){
	var value = {};

	if ((in_valueOrUndefined === undefined) || (false === Array.isArray(in_valueOrUndefined))){
		in_valueOrUndefined = in_defaultValue;
	}

	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		for (var index = 0, total = in_valueOrUndefined.length; index < total; index++) {
			var key = in_valueOrUndefined[index];
			if (typeof key === "string" || key instanceof String){
				value[key] = 0;
			}
		}
		return value;
	}

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueStringMap = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueStringMap];
	var value = c.DagNodeValueHelper.FactoryValueStringMapClean(in_valueOrUndefined, defaultValue);
	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!string} in_defaultValue
 * @param {!(boolean|undefined)} in_defaultValueUseRand
 * @param {(!Object|undefined)} in_keyObject
 * @param {!Array<string>} in_keys
 * @return {!(string|String)}
 */
c.DagNodeValueHelper.FactoryValueKeyClean = function(in_valueOrUndefined, in_defaultValue, in_defaultValueUseRand, in_keyObject, in_keys){
	if (typeof in_valueOrUndefined === "string" || in_valueOrUndefined instanceof String){
		if ((in_keyObject != undefined) && (in_valueOrUndefined in in_keyObject)){
			return in_valueOrUndefined;
		}
	}

	if ((in_defaultValueUseRand === true) && (in_keys != undefined)){
		return in_keys[Math.floor(Math.random() * in_keys.length)];
	}

	return in_defaultValue;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!Object} in_staticData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueKey = function(in_valueOrUndefined, in_metaData, in_staticData){
	var keyPath = in_metaData[c.SchemaStaticDataValue.sKeyPath];
	var keyObject = c.PathObjectGet(in_staticData, keyPath);
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueKey];
	var defaultValueUseRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyUseRand];
	var defaultValueRandArray = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyRandArray];

	var keys = [];
	if (keyObject != undefined){
		for(var temp_key in keyObject) {
			if(keyObject.hasOwnProperty(temp_key)) {
				keys.push(temp_key);
			}
		}
	}
	if (defaultValueRandArray !== undefined){
		keys = defaultValueRandArray;
	}

	if (defaultValue == undefined){
		if (0 < keys.length){
			defaultValue = keys[0];
		} else {
			defaultValue = "";
		}
	}

	var value = c.DagNodeValueHelper.FactoryValueKeyClean(in_valueOrUndefined, defaultValue, defaultValueUseRand, keyObject, keys);
	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!Object} in_staticData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueKeyArray = function(in_valueOrUndefined, in_metaData, in_staticData){
	var keyPath = in_metaData[c.SchemaStaticDataValue.sKeyPath];
	var keyObject = c.PathObjectGet(in_staticData, keyPath);

	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueKey];
	var defaultValueUseRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyUseRand];
	var defaultValueRandArray = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyRandArray];

	var keys = [];
	if (keyObject != undefined){
		for(var temp_key in keyObject) {
			if(keyObject.hasOwnProperty(temp_key)) {
				keys.push(temp_key);
			}
		}
	}
	if (defaultValueRandArray !== undefined){
		keys = defaultValueRandArray;
	}

	if (defaultValue == undefined){
		if (0 < keys.length){
			defaultValue = keys[0];
		} else {
			defaultValue = "";
		}
	}

	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = []; //;
	
		for (var index = 0, total = in_valueOrUndefined.length; index < total; index++) {
			var innerValue = in_valueOrUndefined[index];
			var innerResult = c.DagNodeValueHelper.FactoryValueKeyClean(innerValue, defaultValue, defaultValueUseRand, keyObject, keys);
			value[index] = innerResult;

		}
	}
	else {
		value = [];
	}

	var arrayMin = in_metaData[c.SchemaStaticDataValue.sArrayLengthMin];
	var arrayMax = in_metaData[c.SchemaStaticDataValue.sArrayLengthMax];

	var defaultFunction = ((defaultValueUseRand === true) && (0 < keys.length)) ? c.DagNodeValueHelper.MakeDefaultRandKeyFactory(keys) : c.DagNodeValueHelper.MakeDefaultStringFactory(defaultValue);
	c.DagNodeValueHelper.FactoryDefaultFunctionArray(value, defaultFunction, arrayMin, arrayMax);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!Object} in_staticData
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueKeyMap = function(in_valueOrUndefined, in_metaData, in_staticData){
	var keyPath = in_metaData[c.SchemaStaticDataValue.sKeyPath];
	var keyObject = c.PathObjectGet(in_staticData, keyPath);

	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueKey];
	var defaultValueUseRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyUseRand];
	var defaultValueRandArray = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyRandArray];
	var defaultValueMap = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyMap];

	if (defaultValueMap === undefined){
		defaultValueMap = {};
	}

	var keys = [];
	if (keyObject != undefined){
		for(var temp_key in keyObject) {
			if(keyObject.hasOwnProperty(temp_key)) {
				keys.push(temp_key);
			}
		}
	}
	if (defaultValueRandArray !== undefined){
		keys = defaultValueRandArray;
	}

	if (defaultValue == undefined){
		if (0 < keys.length){
			defaultValue = keys[0];
		} else {
			defaultValue = "";
		}
	}

	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = {}; //;
	
		for (var index = 0, total = in_valueOrUndefined.length; index < total; index++) {
			var innerValue = in_valueOrUndefined[index];
			var innerResult = c.DagNodeValueHelper.FactoryValueKeyClean(innerValue, defaultValue, defaultValueUseRand, keyObject, keys);
			value[innerResult] = 0;
		}
	}
	else {
		value = defaultValueMap;
	}

	return value;
}

/**
 * @private
 * @nosideefect
 * @return {!string}
 */
c.DagNodeValueHelper.MakeRandID = function(){
	return c.RandomString(16, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
}

/**
 * @private
 * @nosideefect
 * @return {!string}
 */
c.DagNodeValueHelper.MakeRandDatabaseID = function(){
	return c.RandomString(24, "0123456789ABCDEF");
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!undefined|string} in_defaultType
 * @param {!undefined|Array<!string>} in_validTypeArray
 * @param {!c.DocumentManager} in_documentManager
 * @param {!c.DagNodeValue} in_node
 * @return {undefined|!c.Document}
 */
c.DagNodeValueHelper.FactoryValueDocumentClean = function(in_valueOrUndefined, in_defaultType, in_validTypeArray, in_documentManager, in_node){
	c.Log(STACK, "c.DagNodeValueHelper.FactoryValueDocumentClean valueOrUndefined:" + in_valueOrUndefined + " defaultType:" + in_defaultType + " validTypeArray:" + in_validTypeArray + " documentManager:" + in_documentManager + " node:" + in_node);

	if (in_documentManager === undefined){
		return undefined;
	}

	var type = null;
	var value = undefined;
	if ((in_valueOrUndefined !== null) && (typeof in_valueOrUndefined === "object")){
		var source = /** @type {undefined|!Object} */ (in_valueOrUndefined);
		value = in_documentManager.DocumentDataToDocumentInternal(source, in_node);
	}

	if ((value !== undefined) && (in_validTypeArray !== undefined)){
		type = value.GetType();
		if (-1 === in_validTypeArray.indexOf(type)){
			value = undefined;
		} 
	}

	if (value === undefined){
		if (in_defaultType === undefined){
			// if the default type is undefined, then client doens't want a default document? use case IDDocumentMap
			return undefined;
		}
		var documentData = in_documentManager.NewDocumentData(in_defaultType);
		value = in_documentManager.DocumentDataToDocumentInternal(documentData, in_node);
	}

	if (value === undefined){
		//we can return undefined if the type is bad
		c.Log(LOG, "c.DagNodeValueHelper.FactoryValueDocumentClean could not find type:" + type + " defaultType:" + in_defaultType, true);
	}

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!c.DocumentManager} in_documentManager
 * @param {!c.DagNodeValue} in_node
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueDocument = function(in_valueOrUndefined, in_metaData, in_documentManager, in_node){
	c.Log(STACK, "c.DagNodeValueHelper.FactoryValueDocument valueOrUndefined:" + in_valueOrUndefined + " metaData:" + in_metaData + " documentManager:" + in_documentManager + " node:" + in_node);
	if (in_documentManager === undefined){
		return null;
	}
	var defaultType = in_metaData[c.SchemaStaticDataValue.sDefaultValueDocumentType];
	var validTypeArray = in_metaData[c.SchemaStaticDataValue.sDocumentTypeArray];
	if ((defaultType === undefined) && (validTypeArray !== undefined) && (0 < validTypeArray.length)){
		defaultType = validTypeArray[0];
	}

	var value = c.DagNodeValueHelper.FactoryValueDocumentClean(in_valueOrUndefined, defaultType, validTypeArray, in_documentManager, in_node);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!c.DocumentManager} in_documentManager
 * @param {!c.DagNodeValue} in_node
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueDocumentArray = function(in_valueOrUndefined, in_metaData, in_documentManager, in_node){
	//c.Log(LOG, "FactoryValueDocumentArray");
	var defaultType = in_metaData[c.SchemaStaticDataValue.sDefaultValueDocumentType];
	var validTypeArray = in_metaData[c.SchemaStaticDataValue.sDocumentTypeArray];
	if ((defaultType === undefined) && (validTypeArray !== undefined) && (0 < validTypeArray.length)){
		defaultType = validTypeArray[0];
	}

	//c.Log(LOG, "defaultType:" + defaultType + " validTypeArray:" + validTypeArray);

	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = in_valueOrUndefined;
	
		var newValue = [];
		for (var index = 0, total = value.length; index < total; index++) {
			var innerValue = value[index];
			innerValue = c.DagNodeValueHelper.FactoryValueDocumentClean(innerValue, defaultType, validTypeArray, in_documentManager, in_node);
			if (innerValue != undefined){
				newValue.push(innerValue);
			}
			//c.Log(LOG, "innerValue:" + innerValue);
		}
		value = newValue;
	}
	else {
		value = [];
	}

	var arrayMin = in_metaData[c.SchemaStaticDataValue.sArrayLengthMin];
	var arrayMax = in_metaData[c.SchemaStaticDataValue.sArrayLengthMax];
	var defaultValueFunction = c.DagNodeValueHelper.MakeDefaultDocument(defaultType, in_documentManager, in_node);
	c.DagNodeValueHelper.FactoryDefaultFunctionArray(value, defaultValueFunction, arrayMin, arrayMax);

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!c.DocumentManager} in_documentManager
 * @param {!c.DagNodeValue} in_node
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueIDDocumentMap = function(in_valueOrUndefined, in_metaData, in_documentManager, in_node){
	var validTypeArray = in_metaData[c.SchemaStaticDataValue.sDocumentTypeArray];

	//c.Log(LOG, "FactoryValueIDDocumentMap in_valueOrUndefined:" + JSON.stringify(in_valueOrUndefined) + " in_metaData:" + in_metaData + " in_documentManager:" + in_documentManager + " in_node:" + in_node);

	var value = undefined;
	if ((in_valueOrUndefined != undefined) && (Array.isArray(in_valueOrUndefined))){
		value = {};

		for (var index = 0, total = in_valueOrUndefined.length; index < total; index++) {
			var databaseData = in_valueOrUndefined[index];
			var document = c.DagNodeValueHelper.FactoryValueDocumentClean(databaseData, undefined, validTypeArray, in_documentManager, in_node);
			if (document !== undefined) {
				var id = document.GetValue(c.SchemaDocument.sID);
				if (id !== undefined){
					value[id] = document;
				}
			}

		}
	}
	else {
		value = {};
	}

	return value;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @return {*}
 */
c.DagNodeValueHelper.FactoryValueObject = function(in_valueOrUndefined){
	if (in_valueOrUndefined !== undefined){
		return in_valueOrUndefined;
	}
	return {};
}

/**
 * @private
 * @nosideefect
 * @param {!undefined|string} in_defaultType
 * @param {!c.DocumentManager} in_documentManager
 * @param {!c.DagNodeValue} in_node
 * @return {!function():(!undefined|c.Document)}
 */
c.DagNodeValueHelper.MakeDefaultDocument = function(in_defaultType, in_documentManager, in_node){
	return function(){
		var documentData = in_documentManager.NewDocumentData(in_defaultType);
		var value = in_documentManager.DocumentDataToDocumentInternal(documentData, in_node);
		return value;
	}
}

/**
 * @private
 * @nosideefect
 * @param {undefined|!Object} in_defaultValue
 * @return {!function()}
 */
c.DagNodeValueHelper.MakeDefaultStringMapFunction = function(in_defaultValue){
	return function(){
		var value = c.DagNodeValueHelper.FactoryValueStringMapClean(undefined, in_defaultValue);
		return value;
	};
}

/**
 * @public
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData //the metadata row for this value
 * @param {!Object} in_staticData //the static data root
 * @param {!c.DocumentManager} in_documentManager
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValue = function(in_valueOrUndefined, in_metaData, in_staticData, in_documentManager){
	var type = in_metaData[c.SchemaStaticDataValue.sType];

	//c.Log(LOG, "c.DagNodeValueHelper.FactoryValue type:" + type);

	switch (type){
	default:
		break;
	case c.SchemaStaticDataValue.Type.eBool:
		return c.DagNodeValueHelper.ScribeValueBool(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eBoolArray:
		return c.DagNodeValueHelper.ScribeValueBoolArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eInt:
		return c.DagNodeValueHelper.ScribeValueInt(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eIntArray:
		return c.DagNodeValueHelper.ScribeValueIntArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eFloat:
		return c.DagNodeValueHelper.ScribeValueFloat(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eFloatArray:
		return c.DagNodeValueHelper.ScribeValueFloatArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eString:
		return c.DagNodeValueHelper.ScribeValueString(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eStringArray:
		return c.DagNodeValueHelper.ScribeValueStringArray(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eStringMap:
		return c.DagNodeValueHelper.ScribeValueStringMap(in_valueOrUndefined, in_metaData);
	case c.SchemaStaticDataValue.Type.eKey:
		return c.DagNodeValueHelper.ScribeValueKey(in_valueOrUndefined, in_metaData, in_staticData);
	case c.SchemaStaticDataValue.Type.eKeyArray:
		return c.DagNodeValueHelper.ScribeValueKeyArray(in_valueOrUndefined, in_metaData, in_staticData);
	case c.SchemaStaticDataValue.Type.eKeyMap:
		return c.DagNodeValueHelper.ScribeValueKeyMap(in_valueOrUndefined, in_metaData, in_staticData);
	case c.SchemaStaticDataValue.Type.eDocument:
		return c.DagNodeValueHelper.ScribeValueDocument(in_valueOrUndefined, in_metaData, in_documentManager);
	case c.SchemaStaticDataValue.Type.eDocumentArray:
		return c.DagNodeValueHelper.ScribeValueDocumentArray(in_valueOrUndefined, in_metaData, in_documentManager);
	case c.SchemaStaticDataValue.Type.eIDDocumentMap:
		return c.DagNodeValueHelper.ScribeValueIDDocumentMap(in_valueOrUndefined, in_metaData, in_documentManager);
	case c.SchemaStaticDataValue.Type.eObject:
		return c.DagNodeValueHelper.ScribeValueObject(in_valueOrUndefined);
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueBool = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueBool];
	if (defaultValue === undefined){
		defaultValue = false;
	}

	if ((true === in_valueOrUndefined) && (in_valueOrUndefined !== defaultValue)){
		return in_valueOrUndefined;
	}
	if ((false === in_valueOrUndefined) && (in_valueOrUndefined !== defaultValue)){
		return in_valueOrUndefined;
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueBoolArray = function(in_valueOrUndefined, in_metaData){
	const value = c.DagNodeValueHelper.FactoryValueBoolArray(in_valueOrUndefined, in_metaData);
	const defaultValue = c.DagNodeValueHelper.FactoryValueBoolArray(undefined, in_metaData);

	//only return value if it is different from what the default value is
	if (true !== c.DagNodeValueHelper.ArrayMatch(value, defaultValue)){
		return value;
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueInt = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueInt];
	defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
	const defaultFromRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntUseRand];
	const defaultFromDateNow = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntDateNow];

	if (typeof in_valueOrUndefined === "number"){
		var value = Math.round(in_valueOrUndefined);
		if ((value !== defaultValue) || (true === defaultFromDateNow) || (true === defaultFromRand)){
			return value;
		}
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueIntArray = function(in_valueOrUndefined, in_metaData){
	const value = c.DagNodeValueHelper.FactoryValueIntArray(in_valueOrUndefined, in_metaData);
	const defaultValue = c.DagNodeValueHelper.FactoryValueIntArray(undefined, in_metaData);
	const defaultFromRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntUseRand];
	const defaultFromDateNow = in_metaData[c.SchemaStaticDataValue.sDefaultValueIntDateNow];

	//only return value if it is different from what the default value is
	if ((true === defaultFromDateNow) || (true === defaultFromRand) || (true !== c.DagNodeValueHelper.ArrayMatch(value, defaultValue))){
		return value;
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueFloat = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueFloat];
	defaultValue = (defaultValue !== undefined) ? defaultValue : 0;

	if (typeof in_valueOrUndefined === "number"){
		if (in_valueOrUndefined !== defaultValue){
			return in_valueOrUndefined;
		}
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueFloatArray = function(in_valueOrUndefined, in_metaData){
	const value = c.DagNodeValueHelper.FactoryValueFloatArray(in_valueOrUndefined, in_metaData);
	const defaultValue = c.DagNodeValueHelper.FactoryValueFloatArray(undefined, in_metaData);

	//only return value if it is different from what the default value is
	if (true !== c.DagNodeValueHelper.ArrayMatch(value, defaultValue)){
		return value;
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueString = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueString];
	defaultValue = (defaultValue !== undefined) ? defaultValue : "";

	if (typeof in_valueOrUndefined === "string" || in_valueOrUndefined instanceof String){
		if (defaultValue !== in_valueOrUndefined){
			return in_valueOrUndefined;
		}
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueStringArray = function(in_valueOrUndefined, in_metaData){
	const value = c.DagNodeValueHelper.FactoryValueStringArray(in_valueOrUndefined, in_metaData);
	const defaultValue = c.DagNodeValueHelper.FactoryValueStringArray(undefined, in_metaData);

	//only return value if it is different from what the default value is
	if (true !== c.DagNodeValueHelper.ArrayMatch(value, defaultValue)){
		return value;
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!Object} in_staticData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueKey = function(in_valueOrUndefined, in_metaData, in_staticData){
	var keyPath = in_metaData[c.SchemaStaticDataValue.sKeyPath];
	var keyObject = c.PathObjectGet(in_staticData, keyPath);
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueKey];
	var defaultValueUseRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyUseRand];
	if (true === defaultValueUseRand){
		defaultValue = undefined;
	}

	if ((keyObject != undefined) &&
		(typeof in_valueOrUndefined === "string" || in_valueOrUndefined instanceof String) &&
		(in_valueOrUndefined in keyObject) &&
		(in_valueOrUndefined !== defaultValue)){
		return in_valueOrUndefined;
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!Object} in_staticData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueKeyArray = function(in_valueOrUndefined, in_metaData, in_staticData){
	const value = c.DagNodeValueHelper.FactoryValueKeyArray(in_valueOrUndefined, in_metaData, in_staticData);
	var defaultValueUseRand = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyUseRand];

	// bail if we are using random defaults
	if (true == defaultValueUseRand){
		return value;
	}

	const defaultValue = c.DagNodeValueHelper.FactoryValueKeyArray(undefined, in_metaData, in_staticData);

	//c.Log(DEBUG, JSON.stringify(in_valueOrUndefined));
	//c.Log(DEBUG, JSON.stringify(value));
	//c.Log(DEBUG, JSON.stringify(defaultValue));

	//only return value if it is different from what the default value is
	if (true !== c.DagNodeValueHelper.ArrayMatch(value, defaultValue)){
		return value;
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!Object} in_staticData
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueKeyMap = function(in_valueOrUndefined, in_metaData, in_staticData){
	var defaultValueMap = in_metaData[c.SchemaStaticDataValue.sDefaultValueKeyMap];
	if (defaultValueMap === undefined){
		defaultValueMap = [];
	}
	var result = undefined;
	if (in_valueOrUndefined !== undefined){
		result = [];
		for(var temp_key in in_valueOrUndefined) {
			if(in_valueOrUndefined.hasOwnProperty(temp_key)) {
				result.push(temp_key);
			}
		}

		if (false === c.DagNodeValueHelper.ArrayMatchUnsorted(result, defaultValueMap)){
			return result;
		}
	}

	return undefined;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!c.DocumentManager} in_documentManager
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueDocument = function(in_valueOrUndefined, in_metaData, in_documentManager){
	var validTypeArray = in_metaData[c.SchemaStaticDataValue.sDocumentTypeArray];
	var type = undefined;
	if ("GetType" in in_valueOrUndefined){
		type = in_valueOrUndefined["GetType"]();
	}

	var result = undefined;
	if ((validTypeArray !== undefined) && (type !== undefined)){
		if (-1 !== validTypeArray.indexOf(type)){
			const document = /** @type {!c.Document} */ (in_valueOrUndefined);
			result = in_documentManager.DocumentToDocumentData(document);
		} 
	}

	if (result == undefined){
		return undefined;
	}

	//if our type matches the default type and we have no other properties, then return undefined as we match the default
	var defaultType = in_metaData[c.SchemaStaticDataValue.sDefaultValueDocumentType];
	if ((type === defaultType) && (Object.keys(result).length === 1)){
		return undefined
	}

	return result;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!c.DocumentManager} in_documentManager
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueDocumentArray = function(in_valueOrUndefined, in_metaData, in_documentManager){
	//c.Log(DEBUG, "ScribeValueDocumentArray");

	if ((in_valueOrUndefined == undefined) || (false === Array.isArray(in_valueOrUndefined))){
		return undefined;
	}

	var result = [];
	var match = true;
	var defaultType = in_metaData[c.SchemaStaticDataValue.sDefaultValueDocumentType];
	var defaultLength = in_metaData[c.SchemaStaticDataValue.sArrayLengthMin];
	if (defaultLength === undefined){
		defaultLength = 0;
	}
	match &= (in_valueOrUndefined.length == defaultLength);

	for (var index = 0, total = in_valueOrUndefined.length; index < total; index++) {
		var sourceDocumentObject = in_valueOrUndefined[index];
		var subResult = in_documentManager.DocumentToDocumentData(sourceDocumentObject);
		match &= ((subResult["type"] === defaultType) && (Object.keys(subResult).length === 1));
		result.push(subResult);
	}

	// if the value to scribe matches the default, we don't scribe
	if (true == match){
		return undefined;
	}

	return result;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @param {!c.DocumentManager} in_documentManager
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueIDDocumentMap = function(in_valueOrUndefined, in_metaData, in_documentManager){
	if (in_valueOrUndefined == undefined){
		return undefined;
	}

	//c.Log(DEBUG, "ScribeValueIDDocumentMap");

	var count = 0;
	var result = [];
	for (var id in in_valueOrUndefined) {

		//c.Log(DEBUG, " id:" + id);

		if (in_valueOrUndefined.hasOwnProperty(id)) {
			var child = in_valueOrUndefined[id];
			if ((child != undefined) && ("GetValue" in child)){
				var testID = child.GetValue("id");
				if (testID === id){
					var subResult = in_documentManager.DocumentToDocumentData(child);
					result.push(subResult);
					count += 1;
				}
			}
		}
	}

	if (0 === count){
		return undefined;
	}

	return result;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @return {*}
 */
c.DagNodeValueHelper.ScribeValueObject = function(in_valueOrUndefined){
	if (undefined === in_valueOrUndefined){
		return in_valueOrUndefined;
	}
	for(var prop in in_valueOrUndefined) {
		if(in_valueOrUndefined.hasOwnProperty(prop)) {
			return in_valueOrUndefined;
		}
	}
	return undefined;
}

c.DagNodeValueHelper.ArrayMatch = function(in_arrayLhs, in_arrayRhs){
	const lhsIsArray = ((in_arrayLhs != undefined) && (Array.isArray(in_arrayLhs)));
	const rhsIsArray = ((in_arrayRhs != undefined) && (Array.isArray(in_arrayRhs)));
	if ((lhsIsArray == false) || (rhsIsArray == false)){
		return false;
	}
	if (in_arrayLhs.length != in_arrayRhs.length){
		return false;
	}
	for (var index = 0, total = in_arrayLhs.length; index < total; index++) {
		var lhsValue = in_arrayLhs[index];
		var rhsValue = in_arrayRhs[index];
		if (lhsValue !== rhsValue){
			return false;
		}
	}
	return true;
}

c.DagNodeValueHelper.ArrayMatchValueOf = function(in_arrayLhs, in_arrayRhs){
	const lhsIsArray = ((in_arrayLhs != undefined) && (Array.isArray(in_arrayLhs)));
	const rhsIsArray = ((in_arrayRhs != undefined) && (Array.isArray(in_arrayRhs)));
	if ((lhsIsArray == false) || (rhsIsArray == false)){
		return false;
	}
	if (in_arrayLhs.length != in_arrayRhs.length){
		return false;
	}
	for (var index = 0, total = in_arrayLhs.length; index < total; index++) {
		var lhsValue = in_arrayLhs[index];
		var rhsValue = in_arrayRhs[index];
		if (lhsValue.valueOf() !== rhsValue.valueOf()){
			return false;
		}
	}
	return true;
}

c.DagNodeValueHelper.ArrayMatchUnsorted = function(in_arrayLhs, in_arrayRhs){
	const lhsIsArray = ((in_arrayLhs != undefined) && (Array.isArray(in_arrayLhs)));
	const rhsIsArray = ((in_arrayRhs != undefined) && (Array.isArray(in_arrayRhs)));
	if ((lhsIsArray == false) || (rhsIsArray == false)){
		return false;
	}
	if (in_arrayLhs.length != in_arrayRhs.length){
		return false;
	}
	for (var index = 0, total = in_arrayLhs.length; index < total; index++) {
		var lhsValue = in_arrayLhs[index];
		if (-1 === in_arrayRhs.indexOf(lhsValue)){
			return false;
		}
	}
	return true;
}

/**
 * @private
 * @nosideefect
 * @param {?*} in_valueOrUndefined
 * @param {!Object} in_metaData
 * @return {*}

in a document, the hash set is a object (so we can search by key)
in a documentData, the hash set is an array for easier storage

 */
c.DagNodeValueHelper.ScribeValueStringMap = function(in_valueOrUndefined, in_metaData){
	var defaultValue = in_metaData[c.SchemaStaticDataValue.sDefaultValueStringMap];
	if (defaultValue === undefined){
		defaultValue = [];
	}
	var result = undefined;
	if (in_valueOrUndefined !== undefined){
		result = [];
		for(var temp_key in in_valueOrUndefined) {
			if(in_valueOrUndefined.hasOwnProperty(temp_key)) {
				result.push(temp_key);
			}
		}

		if (false === c.DagNodeValueHelper.ArrayMatchUnsorted(result, defaultValue)){
			return result;
		}
	}

	return undefined;
}

