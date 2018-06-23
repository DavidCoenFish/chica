/**
 * root namespace
 * @const
 * @unrestricted
 */
//window["c"] = {}
//var c = window["c"];
c = {};

//set via cmd line for closure compiler --define="DEBUG=true"
/** @define {boolean} */
var DEBUG = false;

//set via cmd line for closure compiler --define="STACK=true"
/** @define {boolean} */
var STACK = false;

//set via cmd line for closure compiler --define="LOG=true"
/** @define {boolean} */
var LOG = false;

//set via cmd line for closure compiler --define="EXCEPTION=false"
/** @define {boolean} */
var EXCEPTION = true;


/**
 * @param {!boolean} in_topic
 * @param {!string} in_message
 * @param {!boolean=} _critical
 * @return {undefined}
 */
c.Log = function(in_topic, in_message, _critical) {
	var doCritical = ((undefined != _critical) && (true == _critical));
	if((true === in_topic) || (true === doCritical)) {
		console.info(in_message);
	}

	// oblige context to provide alert/ info about fail
	if(true === doCritical) {
		alert(in_message);
	}
}

/**
 * @param {!Object} in_objectRoot
 * @param {!Array<number|string>} in_cursorArray
 * @return {!Object|undefined}
 */
c["PathObjectGet"] = function(in_objectRoot, in_cursorArray){
	//c.Log(LOG, JSON.stringify(in_objectRoot) + " " + JSON.stringify(in_cursorArray));
	var trace = in_objectRoot;
	if ((in_objectRoot == undefined) || (in_cursorArray == undefined)){
		return undefined;
	}
	for (var index = 0, total = in_cursorArray.length; index < total; index++) {
		var key = in_cursorArray[index];
		trace = trace[key];
		if (trace === undefined){
			break;
		}
	}
	return trace;
}
c.PathObjectGet = c["PathObjectGet"];

/**
 * @param {!Object} in_objectRoot
 * @param {!Array<number|string>} in_cursorArray
 * @param {*} in_value
 * @return {undefined}
 */
c.PathObjectSet = function(in_objectRoot, in_cursorArray, in_value){
	//c.Log(LOG, JSON.stringify(in_objectRoot) + " " + JSON.stringify(in_cursorArray));
	var trace = in_objectRoot;
	if ((in_objectRoot == undefined) || (in_cursorArray == undefined)){
		return undefined;
	}
	for (var index = 0, total = in_cursorArray.length; index < total; index++) {
		var key = in_cursorArray[index];
		if (index === in_cursorArray.length - 1){
			trace[key] = in_value;
			return;
		}
		trace = trace[key];
		if (trace === undefined){
			break;
		}
	}
	return;
}
c["PathObjectSet"] = c.PathObjectSet;


//shallow clone an array
/**
 * @param {!Array<*>} in_array
 * @return {!Array<*>}
 */
c.ArrayShallowClone = function(in_array){
	var result = [];
	for (var index = 0, total = in_array.length; index < total; index++) {
		var item = in_array[index];
		result.push(item);
	}
	return result;
	//return in_array.slice(0); //can not do this, modifies in_array
}

/**
 * @param {*} in_object
 * @return {*}
 */
c.DeepClone = function(in_object){
	var result = undefined;
	if (in_object instanceof Array) {
		result = [];
		for (var index = 0, length = in_object.length; index < length; index++) {
			result[index] = c.DeepClone(in_object[index]);
		}
		return result;
	}

	// Handle Object
	if (in_object instanceof Object) {
		result = {};
		for (var attr in in_object) {
			if (in_object.hasOwnProperty(attr)) {
				result[attr] = c.DeepClone(in_object[attr]);
			}
		}
		return result;
	}

	if (in_object instanceof Date) {
		c.Log(LOG, "instance of class Date in DeepClone");
	}

	//immutable type (not array or object)
	return in_object;
}


/**
 * @public
 * @param {!number} in_length
 * @param {!string} in_chars
 * @return {!string}
 */
c.RandomString = function(in_length, in_chars) {
	var result = '';
	for (var index = in_length; 0 < index; --index){
		result += in_chars[Math.floor(Math.random() * in_chars.length)];
	}
	return result;
}
c["RandomString"] = c.RandomString;


/**
 * @public
 * @param {*} in_value
 * @return {!boolean}
 */
c.IsArray = function(in_value) {
	return Array.isArray(in_value);
}

/**
 * @public
 * @param {*} in_value
 * @return {!boolean}
 */
c.IsNumber = function(in_value) {
	return ("[object Number]" === Object.prototype.toString.call(in_value));
}

/**
 * @public
 * @param {*} in_value
 * @return {!boolean}
 */
c.IsString = function(in_value) {
	return ("string" === typeof in_value);
}

