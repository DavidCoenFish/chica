goog.forwardDeclare("c.DagNodeCalculate");

/**
 * @private
 * @final
 * @constructor
 * @param {!string} in_name
 * @param {!string} in_localeName
 * @param {!*} in_value
 * @param {!string} in_type
 * @param {!string|undefined} in_dimention
 * @param {!Object} in_staticData
 * @return {undefined}
 */
c.DagNodeValue = function(in_name, in_localeName, in_value, in_type, in_dimention, in_staticData) {
	this.m_name = in_name;
	this.m_localeName = in_localeName;
	this.m_value = in_value;
	this.m_type = in_type;
	this.m_dimention = in_dimention;
	this.m_staticData = in_staticData;

	/** type {!boolean>} */
	this.m_displayValueValid = false;
	/** type {!string|undefined>} */
	this.m_displayValue = undefined;
	/** type {!string|undefined>} */
	this.m_displayUnit = undefined;

	/** type {!Array<c.DagNodeCalculate>} */
	this.m_outputArray = [];

	return;
}

/**
 * @public
 * @nosideefect
 * @param {!string} in_name
 * @param {!string} in_localeName
 * @param {!*} in_value
 * @param {!string} in_type
 * @param {!string|undefined} in_dimention
 * @param {!Object} in_staticData
 * @return {!c.DagNodeValue}
 */
c.DagNodeValue.Factory = function(in_name, in_localeName, in_value, in_type, in_dimention, in_staticData) {
	return new c.DagNodeValue(in_name, in_localeName, in_value, in_type, in_dimention, in_staticData);
}

/**
 * @public
 * @nosideefect
 * @this {c.DagNodeValue}
 * @return {!*}
 */
c.DagNodeValue.prototype.GetValue = function() {
	return this.m_value;
}

/**
 * @public
 * @nosideefect
 * @this {c.DagNodeValue}
 * @return {!string}
 */
c.DagNodeValue.prototype.GetName = function() {
	return this.m_name;
}

/**
 * @public
 * @nosideefect
 * @this {c.DagNodeValue}
 * @return {!string}
 */
c.DagNodeValue.prototype.GetLocaleName = function() {
	return this.m_localeName;
}

/**
 * @public
 * @param {!string} in_units
 * @return {!string}
 */
c.DagNodeValue.prototype.GetDisplayValue = function(in_units) {
	if ((this.m_displayValueValid === false) || (in_units !== this.m_displayUnit)){
		this.m_displayValueValid = true;
		this.m_displayUnit = in_units;
		this.m_displayValue = c.DocumentManagerLocaleHelper.MakeDisplayValue(this.m_value, this.m_type, in_units, this.m_dimention, false, this.m_staticData);
	}
	return this.m_displayValue;
}

c.DagNodeValue.prototype.SetDisplayValue = function(in_displayValue, in_units, in_parentNodeMap, in_document) {
	var value = c.DocumentManagerLocaleHelper.UnmakeDisplayValue(in_displayValue, in_units, this.m_dimention, this.m_staticData);
	if (value !== undefined){
		this.SetValue(value, in_parentNodeMap, in_document);
	}
}

/**
 * @public
 * @param {!string} in_units
 * @return {undefined|!Array<!string|Object>}
 */
c.DagNodeValue.prototype.GetToolTip = function(in_units) {
	return undefined;
}

/**
 * @public
 * @this {c.DagNodeValue}
 * @param {!*} in_value
 * @param {!Object<!string,!c.DagNodeCalculate|c.DagNodeValue>} in_parentNodeMap
 * @param {!c.Document} in_document
 * @return {undefined}
 */
c.DagNodeValue.prototype.SetValue = function(in_value, in_parentNodeMap, in_document) {
	c.Log(STACK, "c.DagNodeValue.SetValue start");

	if (in_value === this.m_value){
		c.Log(STACK, "c.DagNodeValue.SetValue bail");
		return;
	}

	this.ClearChildParentLinks();

	this.m_value = in_value;
	this.m_displayValueValid = false;

	this.AddChildParentLinks(in_parentNodeMap);

	this.SetDirty();

	in_document.SetParentNodeDirty();

	c.Log(STACK, "c.DagNodeValue.SetValue end");
	return;
}

/**
 * @public
 * @return {undefined}
 */
c.DagNodeValue.prototype.SetDirty = function () {
	c.Log(STACK, "c.DagNodeValue.SetDirty start");
	for (var index = 0, total = this.m_outputArray.length; index < total; index++) {
		/** type {c.DagNodeCalculate} */
		var output = (this.m_outputArray[index]);
		if (output !== undefined){
			output.SetDirty();
		}
	}
	c.Log(STACK, "c.DagNodeValue.SetDirty end");
	return;
}

/**
 * @return {undefined}
 */
c.DagNodeValue.prototype.GetInstructionArray = function(){
	return undefined;
}

/**
 * @return {undefined}
 */
c.DagNodeValue.prototype.ClearChildParentLinks = function() {
	c.Log(STACK, "c.DagNodeValue.ClearChildParentLinks start");
	if (this.m_value === undefined){
		return;
	}
	switch (this.m_type){
		case c.SchemaStaticDataValue.Type.eDocument:
			/** type {!c.Document} */
			var document = this.GetValue();
			document.ClearChildParentLinks();
			break;
		case c.SchemaStaticDataValue.Type.eDocumentArray:
			/** type {!Array<!c.Document>} */
			var valueArray = this.GetValue();
			for (var index = 0, total = valueArray.length; index < total; index++) {
				/** type {!c.Document} */
				var document = valueArray[index];
				document.ClearChildParentLinks();
			}
			break;
		case c.SchemaStaticDataValue.Type.eIDDocumentMap:
			/** type {!Object<!string,!c.Document>} */
			var valueMap = this.GetValue();
			for (var key in valueMap) {
				if (false === valueMap.hasOwnProperty(key)) {
					continue;
				}
				/** type {!c.Document} */
				var document = valueMap[key];
				document.ClearChildParentLinks();
			}
			break;
		default:
			break;
	}
	c.Log(STACK, "c.DagNodeValue.ClearChildParentLinks end");
	return;
}
/**
 * @param {!Object<!string,!c.DagNodeCalculate|c.DagNodeValue>} in_parentNodeMap
 * @return {undefined}
 */
c.DagNodeValue.prototype.AddChildParentLinks = function(in_parentNodeMap) {
	c.Log(STACK, "c.DagNodeValue.AddChildParentLinks start");
	if (this.m_value === undefined){
		return;
	}
	switch (this.m_type){
		case c.SchemaStaticDataValue.Type.eDocument:
			/** type {!c.Document} */
			var document = this.GetValue();
			document.AddChildParentLinks(in_parentNodeMap);
			break;
		case c.SchemaStaticDataValue.Type.eDocumentArray:
			/** type {!Array<!c.Document>} */
			var valueArray = this.GetValue();
			for (var index = 0, total = valueArray.length; index < total; index++) {
				/** type {!c.Document} */
				var document = valueArray[index];
				document.AddChildParentLinks(in_parentNodeMap);
			}
			break;
		case c.SchemaStaticDataValue.Type.eIDDocumentMap:
			/** type {!Object<!string,!c.Document>} */
			var valueMap = this.GetValue();
			for (var key in valueMap) {
				if (false === valueMap.hasOwnProperty(key)) {
					continue;
				}
				/** type {!c.Document} */
				var document = valueMap[key];
				document.AddChildParentLinks(in_parentNodeMap);
			}
			break;
		default:
			break;
	}
	c.Log(STACK, "c.DagNodeValue.AddChildParentLinks end");
	return;
}

/**
 * @public
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_node
 * @this {c.DagNodeValue}
 * @return {undefined}
 */
c.DagNodeValue.prototype.AddOutput = function(in_node) {
	this.m_outputArray.push(in_node);
	return;
}

/**
 * @public
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_node
 * @this {c.DagNodeValue}
 * @return {undefined}
 */
c.DagNodeValue.prototype.RemoveOutput = function(in_node) {
	this.m_outputArray = this.m_outputArray.filter(e => e !== in_node)
	return;
}

/**
 * @public
 * @nosideefect
 * @this {c.DagNodeValue}
 * @return {!string}
 */
c.DagNodeValue.prototype.toString = function() {
	//return "disable value to string";
	
	var result = "{m_value:" + this.m_value + ", m_outputArray["
	for (var index = 0, total = this.m_outputArray.length; index < total; index++) {
		var node = this.m_outputArray[index];
		if (0 !== index){
			result += ", ";
		}
		result += node.GetName();
	}
	result += "]}";
	return result;
}
