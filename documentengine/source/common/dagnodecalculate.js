goog.forwardDeclare("c.DagNodeCalculate");
goog.forwardDeclare("c.DagNodeValue");

/**
 * @private
 * @final
 * @constructor
 * @param {!string} in_name
 * @param {!string} in_localeName
 * @param {!string} in_type
 * @param {!c.Document} in_document
 * @param {!Array<{op:number,value,node:(!c.DagNodeCalculate|c.DagNodeValue)}>} in_instructionArray
 * @param {!string|undefined} in_dimention
 * @param {!boolean} in_isLocale
 * @param {!boolean} in_tooltipStop
 * @param {!Object} in_staticData
 * @param {!Object<string,function(...):*>} in_instuctionContext
 * @return {undefined}
 */
c.DagNodeCalculate = function(in_name, in_localeName, in_type, in_document, in_instructionArray, in_dimention, in_isLocale, in_tooltipStop, in_staticData, in_instuctionContext) {
	this.m_name = in_name;
	this.m_localeName = in_localeName;
	this.m_type = in_type;
	this.m_document = in_document;
	this.m_instructionArray = in_instructionArray;
	this.m_dimention = in_dimention; 
	this.m_isLocale = in_isLocale;
	this.m_tooltipStop = in_tooltipStop;
	this.m_staticData = in_staticData;
	this.m_instuctionContext = in_instuctionContext;

	/** @type {*|undefined} in_value */
	this.m_value = undefined;
	/** type {!Array<!string|!Object>|undefined} */
	this.m_tooltip = undefined;
	/** @type {!string|undefined} in_value */
	this.m_displayValue = undefined;

	/** type {!Array<c.DagNodeCalculate>} */
	this.m_outputArray = [];
	/** type {!boolean} */
	this.m_dirty = true;
	/** type {!string} */
	this.m_displayUnits = "";
	/** type {!Array<?>} */
	this.m_calculationStack = [];
	/** type {!Array<?>} */
	this.m_tooltipStack = [];

	return;
}

/**
 * @nosideefect
 * @param {!string} in_name
 * @param {!string} in_localeName
 * @param {!string} in_type
 * @param {!c.Document} in_document
 * @param {!Array<{op:number,value,node:(!c.DagNodeCalculate|c.DagNodeValue)}>} in_instructionArray
 * @param {!string|undefined} in_dimention
 * @param {!boolean} in_isLocale
 * @param {!boolean} in_tooltipStop
 * @param {!Object} in_staticData
 * @param {!Object<string,function(...):*>} in_instuctionContext
 * @return {!c.DagNodeCalculate}
 */
c.DagNodeCalculate.Factory = function(in_name, in_localeName, in_type, in_document, in_instructionArray, in_dimention, in_isLocale, in_tooltipStop, in_staticData, in_instuctionContext){
	return new c.DagNodeCalculate(in_name, in_localeName, in_type, in_document, in_instructionArray, in_dimention, in_isLocale, in_tooltipStop, in_staticData, in_instuctionContext);
}

/**
 * @return {!*}
 */
c.DagNodeCalculate.prototype.GetValue = function() {
	c.Log(STACK, "DagNodeCalculate.GetValue name:" + this.m_name + " dirty:" +  this.m_dirty);
	this.UpdateValue(this.m_displayUnits);
	return this.m_value;
}

c.DagNodeCalculate.prototype.UpdateValue = function(in_units) {
	if ((this.m_dirty === true) || (in_units !== this.m_displayUnits)){
		this.m_displayUnits = in_units;
		this.m_dirty = false;
		try {
			//this.m_displayValue = c.DocumentManagerLocaleHelper.MakeDisplayValue(this.m_value, this.m_type, in_units, this.m_dimention, this.m_isLocale, this.m_staticData);
			//SetToolTip, SetDisplayValue
			this.m_value = c.DagNodeCalculateHelper.CalculateValue(
				this,
				this.m_calculationStack,
				this.m_tooltipStack,
				this.m_instructionArray,
				this.m_staticData,
				this.m_instuctionContext,
				this.m_type,
				in_units,
				this.m_dimention,
				this.m_isLocale,
				this.m_tooltipStop
				);
		} catch (e) {
			c.Log(EXCEPTION, "SWALLOWING EXCEPTION: GetValue " + this.m_name + " threw error:" + e + " this:" + this);
			this.m_value = undefined;
			//throw e;
		}
		//throw on value being undefined?
	}
}

/**
 * @nosideefect
 * @return {!string}
 */
c.DagNodeCalculate.prototype.GetName = function() {
	return this.m_name;
}

/**
 * @nosideefect
 * @return {!string}
 */
c.DagNodeCalculate.prototype.GetLocaleName = function() {
	return this.m_localeName;
}

/**
 * @public
 * @param {!string} in_units
 * @return {!string}
 */
c.DagNodeCalculate.prototype.GetDisplayValue = function(in_units) {
	this.UpdateValue(in_units);
	return /** @type {!string} */(this.m_displayValue);
}

//c.DagNodeCalculate.prototype.SetDisplayValue = function(in_displayValue, in_units) {
	//throw on bad operation?
//}

c.DagNodeCalculate.prototype.SetDisplayValueInternal = function(in_displayValue) {
	this.m_displayValue = in_displayValue;
}

/*
	the tooltip can be undefined or an array of string or objects {"text":string,"tooltip":array}
*/
/**
 * @public
 * @param {!string} in_units
 * @return {undefined|!Array<!string|Object>}
 */
c.DagNodeCalculate.prototype.GetToolTip = function(in_units) {
	this.UpdateValue(in_units);
	return this.m_tooltip;
}

c.DagNodeCalculate.prototype.SetToolTipInternal = function(in_tooltip) {
	this.m_tooltip = in_tooltip;
}

/**
 * @nosideefect
 * @return {!c.Document}
 */
c.DagNodeCalculate.prototype.GetDocument = function() {
	return this.m_document;
}

/**
 * @nosideefect
 * @return {!boolean}
 */
c.DagNodeCalculate.prototype.GetDirty = function() {
	return this.m_dirty;
}

/**
 * @return {undefined}
 */
c.DagNodeCalculate.prototype.SetDirty = function() {
	//we can bail if we are already dirty
	if (true == this.m_dirty){
		return;
	}
	this.m_dirty = true;
	for (var index = 0, len = this.m_outputArray.length; index < len; index++) {
		var node = this.m_outputArray[index];
		if (node != null){
			node.SetDirty();
		}
	}

	this.m_document.SetParentNodeDirty();

	return;
}

/**
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_node
 * @return {undefined}
 */
c.DagNodeCalculate.prototype.AddOutput = function(in_node) {
	this.m_outputArray.push(in_node);
	return;
}

/**
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_node
 * @return {undefined}
 */
c.DagNodeCalculate.prototype.RemoveOutput = function(in_node) {
	this.m_outputArray = this.m_outputArray.filter(e => e !== in_node)
	return;
}

/**
 * @nosideefect
 * @return {!Array<{op:number,value,node:(!c.DagNodeCalculate|c.DagNodeValue)}>} in_instructionArray
 */
c.DagNodeCalculate.prototype.GetInstructionArray = function() {
	return this.m_instructionArray;
}

/**
   {!Array<{op:number,value,node:(!c.DagNodeCalculate|c.DagNodeValue)}>} in_instructionArray
 * @nosideefect
 * @return {!string}
 */
c.DagNodeCalculate.prototype.toString = function() {
	//return "disable node to string";
	
	var result = "{m_value:" + this.m_value + ", m_dirty:" + this.m_dirty + ", m_outputArray[";
	for (var index = 0, total = this.m_outputArray.length; index < total; index++) {
		var node = this.m_outputArray[index];
		if (0 !== index){
			result += ", ";
		}
		result += node.GetName();
	}
	result += "], m_instructionArray:[";
	for (var index = 0, total = this.m_instructionArray.length; index < total; index++) {
		var instruction = this.m_instructionArray[index];
		if (0 !== index){
			result += ", ";
		}
		result += "{op:" + instruction[c.SchemaStaticDataCalculate.sDataOperation] + ",value:" + instruction[c.SchemaStaticDataCalculate.sDataValue] + "}";
	}
	//result += "], m_staticdata:";
	//result += JSON.stringify(this.m_staticData);
	result += "]}";

	return result;
}
