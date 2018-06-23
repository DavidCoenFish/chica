goog.forwardDeclare("c.DagNodeCollection");
goog.forwardDeclare("c.DagNodeValue");

/**
 * @private
 * @final
 * @constructor
 * @param {!string} in_type
 * @param {!Object<!string,!c.DagNodeCalculate|c.DagNodeValue>} in_mapNameNode
 * @param {!c.DagNodeValue|undefined} in_parentNodeOrUndefined
 * @return {undefined}
 */
c.Document = function (in_type, in_mapNameNode, in_parentNodeOrUndefined) {
	this.m_type = in_type;
	this.m_mapNameNode = in_mapNameNode;
	this.m_parentNode = in_parentNodeOrUndefined;
	return;
}
c["Document"] = c.Document;

/**
 * @nosideefect
 * @param {!string} in_type
 * @param {!Object<!string,!c.DagNodeCalculate|c.DagNodeValue>} in_mapNameNode
 * @param {!c.DagNodeValue|undefined} in_parentNodeOrUndefined
 * @return {!c.Document}
 */
c.Document.Factory = function(in_type, in_mapNameNode, in_parentNodeOrUndefined) {
	//c.Log(LOG, "Document.Factory");
	c.Log(STACK, "Document.Factory in_type:" + in_type + " in_mapNameNode:" + in_mapNameNode + " in_parentNodeOrUndefined:" + in_parentNodeOrUndefined);

	return new c.Document(in_type, in_mapNameNode, in_parentNodeOrUndefined);
}
c.Document["Factory"] = c.Document.Factory;

/**
 * @nosideefect
 * @return {!string}
 */
c.Document.prototype.GetType = function() {
	return this.m_type;
}
c.Document.prototype["GetType"] = c.Document.prototype.GetType;

/**
 * @nosideefect
 * @param {!string} in_name
 * @return {?}
 */
c.Document.prototype.GetValue = function(in_name) {
	c.Log(STACK, "Document.GetValue in_name:" + in_name + " in:" + (in_name in this.m_mapNameNode));

	if (in_name in this.m_mapNameNode){
		return this.m_mapNameNode[in_name].GetValue();
	}
	return undefined;
}
c.Document.prototype["GetValue"] = c.Document.prototype.GetValue;

/**
 * @nosideefect
 * @param {!string} in_name
 * @param {?} in_value
 * @return {undefined}
 */
c.Document.prototype.SetValue = function(in_name, in_value) {
	c.Log(STACK, "c.Document.SetValue name:" + in_name + " in_value:" + in_value);

	if (in_name in this.m_mapNameNode){
		this.m_mapNameNode[in_name].SetValue(in_value, this.m_mapNameNode, this);
	}

	return;
}
c.Document.prototype["SetValue"] = c.Document.prototype.SetValue;

/**
 * @nosideefect
 * @param {!string} in_name
 * @return {!string}
 */
c.Document.prototype.GetLocaleName = function(in_name) {
	c.Log(STACK, "c.Document.GetDisplayName name:" + in_name);

	if (in_name in this.m_mapNameNode){
		return this.m_mapNameNode[in_name].GetLocaleName();
	}

	return in_name;
}
c.Document.prototype["GetLocaleName"] = c.Document.prototype.GetLocaleName;

/**
 * @nosideefect
 * @param {!string} in_name
 * @param {!string} in_units
 * @return {!string}
 */
c.Document.prototype.GetDisplayValue = function(in_name, in_units) {
	c.Log(STACK, "c.Document.GetDisplayValue name:" + in_name);

	if (in_name in this.m_mapNameNode){
		return this.m_mapNameNode[in_name].GetDisplayValue(in_units);
	}

	return "";
}
c.Document.prototype["GetDisplayValue"] = c.Document.prototype.GetDisplayValue;

/**
 * @nosideefect
 * @param {!string} in_name
 * @param {!string} in_units
 * @param {!string} in_value
 * @return {undefined}
 */
c.Document.prototype.SetDisplayValue = function(in_name, in_units, in_value) {
	c.Log(STACK, "Document.SetDisplayValue in_name:" + in_name + " in:" + (in_name in this.m_mapNameNode));

	if (in_name in this.m_mapNameNode){
		const node = this.m_mapNameNode[in_name];
		node.SetDisplayValue(in_value, in_units, this.m_mapNameNode, this);
	}
	return;
}
c.Document.prototype["SetDisplayValue"] = c.Document.prototype.SetDisplayValue;


/* returns an array of [string,{text:string,tooltip:array},...] */
/**
 * @nosideefect
 * @param {!string} in_name
 * @param {!string} in_units
 * @return {?}
 */
c.Document.prototype.GetTooltip = function(in_name, in_units) {
	c.Log(STACK, "Document.GetTooltip in_name:" + in_name + " in:" + (in_name in this.m_mapNameNode));

	if (in_name in this.m_mapNameNode){
		const node = this.m_mapNameNode[in_name];
		var tooltip = node.GetToolTip(in_units);
		//console.log("GetTooltip in_name:" + in_name + " tooltip:" + JSON.stringify(tooltip));

		//so, when we just have "text", should we just return a string, or deal woth this downstream
		var result = {"text" : node.GetDisplayValue(in_units)};

		if (tooltip !== undefined){
			result["tooltip"] = tooltip;
		}
		//var result = {"text" : tooltip};
		//var result = tooltip;
		//return array as render uses array and i can't make promices on there only being one text with one tooltip as a tooltip of a property
		return result;
	}
	return undefined;
}
c.Document.prototype["GetTooltip"] = c.Document.prototype.GetTooltip;

/**
 * @nosideefect
 * @param {!string} in_name
 * @return {!c.DagNodeCalculate|c.DagNodeValue|undefined}
 */
c.Document.prototype.GetNode = function(in_name) {
	//c.Log(LOG, "DagNodeCollection.GetNode in_name:" + in_name);

	if (in_name in this.m_mapNameNode){
		return this.m_mapNameNode[in_name];
	}
	return undefined;
}

/**
 * @param {!string} in_name
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_node
 * @return {undefined}
 */
c.Document.prototype.SetNode = function(in_name, in_node) {
	this.m_mapNameNode[in_name] = in_node;
	return;
}


/**
 * @nosideefect
 * @return {!Object<!string,!c.DagNodeCalculate|c.DagNodeValue>}
 */
c.Document.prototype.GetNameNodeMap = function() {
	return this.m_mapNameNode;
}

/**
allow a node with a document (item, array or map) when a member is set to dirty, set the parent node as dirty.
 * @return {undefined}
 */
c.Document.prototype.SetParentNodeDirty = function() {
	c.Log(STACK, "Document.OnChildNodeSetDirty");
	if (this.m_parentNode != undefined){
		this.m_parentNode.SetDirty();
	}
	return;
}

/**
 * @return {undefined}
 */
c.Document.prototype.ClearChildParentLinks = function() {
	c.Log(STACK, "Document.ClearChildParentLinks");
	c.DagNodeCollectionHelper.RemoveNodeMapLinksParent(this.m_mapNameNode);
	return;
}

/**
 * @param {!Object<!string,!c.DagNodeCalculate|c.DagNodeValue>} in_parentNodeMap
 * @return {undefined}
 */
c.Document.prototype.AddChildParentLinks = function(in_parentNodeMap) {
	c.Log(STACK, "Document.AddChildParentLinks");
	c.DagNodeCollectionHelper.AddNodeMapLinksParent(this.m_mapNameNode, in_parentNodeMap);
	return;
}

/**
 * @nosideefect
 * @return {!string}
 */
c.Document.prototype.toString = function() {
	return "disable document to string";
	/*
	var ret = "{m_type:" + this.m_type + ",";
	if (this.m_parentNode != undefined){
		ret += "m_parentNode:#ref,";
	}
	ret += "m_mapNameNode:{";
	var first = true;
	for (var name in this.m_mapNameNode) {
		if (true === first){
			first = false;
		} else {
			ret += ", ";
		}
		ret += name + ":" + this.m_mapNameNode[name].toString();
	}
	ret += "}}";
	return ret;
	*/
}
