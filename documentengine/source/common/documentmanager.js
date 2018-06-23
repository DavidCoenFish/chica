goog.forwardDeclare("c.Document");

/*
this library is intended for server and client
*/

/**
 * @private
 * @final
 * @constructor
 * @param {!Object} in_staticData
 * @param {!Object|undefined} in_instructionContext
 * @param {!Object|undefined} in_actionContext
 * @return {undefined}
 */
c.DocumentManager = function(in_staticData, in_instructionContext, in_actionContext) {
	this.m_staticData = in_staticData;
	this.m_instructionContext = (undefined !== in_instructionContext) ? in_instructionContext : {};
	this.m_actionContext = (undefined !== in_actionContext) ? in_actionContext : {};

	return;
}
c["DocumentManager"] = c.DocumentManager;

/**
 * @nosideefect
 * @param {!Object} in_staticData
 * @param {!Object|undefined} in_instructionContext
 * @param {!Object|undefined} in_actionContext
 * @return {!c.DocumentManager}
 */
c.DocumentManager.Factory = function(in_staticData, in_instructionContext, in_actionContext) {
	return new c.DocumentManager(in_staticData, in_instructionContext, in_actionContext);
}
c.DocumentManager["Factory"] = c.DocumentManager.Factory;

/**
 * @nosideefect
 * @return {!Object}
 */
c.DocumentManager.prototype.GetTypeMap = function() {
	const arrayTypeNames = Object.keys(this.m_staticData[c.SchemaStaticData.sDocumentTypes]);
	var result = {};
	for (var index = 0, total = arrayTypeNames.length; index < total; index++) {
		var key = arrayTypeNames[index];
		result[key] = this.GetLocaleData(key);
	}

	return result;
}
c.DocumentManager.prototype["GetTypeMap"] = c.DocumentManager.prototype.GetTypeMap;

/**
 * @nosideefect
 * @return {!Object}
 */
c.DocumentManager.prototype.GetActionMap = function() {
	const arrayActionNames = Object.keys(this.m_actionContext);
	var result = {};
	for (var index = 0, total = arrayActionNames.length; index < total; index++) {
		var key = arrayActionNames[index];
		result[key] = this.GetLocaleData(key);
	}

	return result;
}
c.DocumentManager.prototype["GetActionMap"] = c.DocumentManager.prototype.GetActionMap;

/**
 * @nosideefect
 * @return {!Object}
 */
c.DocumentManager.prototype.GetUnitMap = function() {
	const staticUnitData = c.PathObjectGet(this.m_staticData, [c.SchemaStaticData.sData, c.SchemaStaticData.sDataUnits]);
	var result = {};
	if (staticUnitData !== undefined){
		const arrayTypeNames = Object.keys(staticUnitData);
		for (var index = 0, total = arrayTypeNames.length; index < total; index++) {
			var key = arrayTypeNames[index];
			result[key] = this.GetLocaleData(key);
		}
	}

	return result;
}
c.DocumentManager.prototype["GetUnitMap"] = c.DocumentManager.prototype.GetUnitMap;

/**
 * @nosideefect
 * @param {!string} in_key
 * @return {!string}
 */
c.DocumentManager.prototype.GetLocaleData = function(in_key) {
	return c.DocumentManagerLocaleHelper.GetLocaleData(in_key, this.m_staticData);
}
c.DocumentManager.prototype["GetLocaleData"] = c.DocumentManager.prototype.GetLocaleData;

/**
at the moment this simply returns a tooltip data with or without a popup, but it doesn't recurse
use case, tooltip for property names 
 * @nosideefect
 * @param {!string} in_propertyName
 * @param {!c.Document} in_document
 * @param {!string} in_units
 * @return {!Object}
 */
c.DocumentManager.prototype.MakePropertyNameTooltipData = function(in_propertyName, in_document, in_units) {
	return c.DocumentManagerLocaleHelper.MakePropertyNameTooltipData(in_propertyName, in_document, in_units, this.m_staticData);
}
c.DocumentManager.prototype["MakePropertyNameTooltipData"] = c.DocumentManager.prototype.MakePropertyNameTooltipData;

/**
 * @nosideefect
 * @param {!string} in_type
 * @return {!Array<!string>}
 */
c.DocumentManager.prototype.GetDocumentPropertyNameArray = function(in_type) {
	const data = this.m_staticData[c.SchemaStaticData.sDocumentTypes][in_type];
	if(data == null) {
		//c.Log(LOG, "DocumentManager.GetMetadata null data for type:" + in_type);
		return [];
	}
	const valueMetadataPath = data[c.SchemaStaticData.sDocumentTypesValue];
	const valueMetadataCollection = c.PathObjectGet(this.m_staticData, valueMetadataPath);
	const calculateMetadataPath = data[c.SchemaStaticData.sDocumentTypesCalculate];
	const calculateMetadataCollection = c.PathObjectGet(this.m_staticData, calculateMetadataPath);

	var arrayPropertyNameArray = [];
	if (valueMetadataCollection !== undefined){
		arrayPropertyNameArray = arrayPropertyNameArray.concat(Object.keys(valueMetadataCollection));
	}

	if (calculateMetadataCollection !== undefined){
		arrayPropertyNameArray = arrayPropertyNameArray.concat(Object.keys(calculateMetadataCollection));
	}

	return arrayPropertyNameArray;
}
c.DocumentManager.prototype["GetDocumentPropertyNameArray"] = c.DocumentManager.prototype.GetDocumentPropertyNameArray;

/*
don't expose value or calculate metadata, just pass object and required data
may need range, dont need default
{
	"type" : string,
	"locked" : bool,
	["keyoptions" : {"value string":"locallised string"},]
	["childtypeoptions" : {"type string":"locallised string"},]
}
*/
/**
 * @nosideefect
 * @param {!string} in_type
 * @param {!string} in_propertyName
 * @return {!Object|undefined}
 */
c.DocumentManager.prototype.GetDocumentPropertyData = function(in_type, in_propertyName) {
	const data = this.m_staticData[c.SchemaStaticData.sDocumentTypes][in_type];
	if(data == null) {
		//c.Log(LOG, "DocumentManager.GetMetadata null data for type:" + in_type);
		return undefined;
	}
	const valueMetadataPath = data[c.SchemaStaticData.sDocumentTypesValue];
	const valueMetadataCollection = c.PathObjectGet(this.m_staticData, valueMetadataPath);
	const valueMetadata = ((valueMetadataCollection !== undefined) && (in_propertyName in valueMetadataCollection)) ? valueMetadataCollection[in_propertyName] : undefined;
	const calculateMetadataPath = data[c.SchemaStaticData.sDocumentTypesCalculate];
	const calculateMetadataCollection = c.PathObjectGet(this.m_staticData, calculateMetadataPath);
	const calculateMetadata = ((calculateMetadataCollection !== undefined) && (in_propertyName in calculateMetadataCollection)) ? calculateMetadataCollection[in_propertyName] : undefined;

	var type = undefined;
	var locked = undefined;
	var keyoptions = undefined;

	if ((valueMetadata !== undefined) && (c.SchemaStaticDataValue.sType in valueMetadata)){
		type = valueMetadata[c.SchemaStaticDataValue.sType];
	}
	if ((calculateMetadata !== undefined) && (c.SchemaStaticDataCalculate.sType in calculateMetadata)){
		type = calculateMetadata[c.SchemaStaticDataCalculate.sType];
	}

	if (valueMetadata !== undefined){
		if (c.SchemaStaticDataValue.sClientLocked in valueMetadata){
			locked = (true === valueMetadata[c.SchemaStaticDataValue.sClientLocked]);
		} else {
			locked = false;
		}
	}
	if (in_propertyName === "id"){
		locked = true;
	}

	if (calculateMetadata !== undefined){
		locked = true;
	}

	if ((valueMetadata !== undefined) && (c.SchemaStaticDataValue.sKeyPath in valueMetadata)){
		var keypath = valueMetadata[c.SchemaStaticDataValue.sKeyPath];
		var keydata = c.PathObjectGet(this.m_staticData, keypath);
		if (keydata !== undefined){
			keyoptions = {};
			for (key in keydata) {
				if (false === keydata.hasOwnProperty(key)) {
					continue;
				}
				keyoptions[key] = this.GetLocaleData(key);
			}
		}
	}

	var childtypeoptions = undefined;
	if ((valueMetadata !== undefined) && (c.SchemaStaticDataValue.sDocumentTypeArray in valueMetadata)){
		keydata = valueMetadata[c.SchemaStaticDataValue.sDocumentTypeArray];
		if (keydata !== undefined){
			childtypeoptions = {};
			for (var index = 0, total = keydata.length; index < total; index++) {
				var key = keydata[index];
				childtypeoptions[key] = this.GetLocaleData(key);
			}
		}
	}

	var result = {
		"type" : type,
		"locked" : locked,
		"keyoptions" : keyoptions,
		"childtypeoptions" : childtypeoptions
	};

	return result;
}
c.DocumentManager.prototype["GetDocumentPropertyData"] = c.DocumentManager.prototype.GetDocumentPropertyData;

/**
 * @nosideefect
 * @param {!string} in_actionName
 * @return {!string|undefined}
 */
c.DocumentManager.prototype.GetActionInputType = function(in_actionName){
	if (in_actionName in this.m_actionContext){
		return this.m_actionContext[in_actionName]["input"];
	}
	return undefined;
}
c.DocumentManager.prototype["GetActionInputType"] = c.DocumentManager.prototype.GetActionInputType;

/**
 * @nosideefect
 * @param {!string} in_actionName
 * @param {!c.Document} in_inputDocument
 * @param {!string} in_units
 * @param {!boolean} in_makeDeltaLog
 * @param {!Object|undefined} in_stateOrUndefined
 * @return {!Object|undefined}
 */
c.DocumentManager.prototype.RunAction = function(in_actionName, in_inputDocument, in_units, in_makeDeltaLog, in_stateOrUndefined){
	if (in_actionName in this.m_actionContext){
		return this.m_actionContext[in_actionName]["run"](this, in_inputDocument, in_units, in_makeDeltaLog, in_stateOrUndefined);
	}
	return undefined;
}
c.DocumentManager.prototype["RunAction"] = c.DocumentManager.prototype.RunAction;

/*
by the time we get the missionInstanceDocument, it the referenced character by id inserted into 
and collected into the mission document. 
we calculate state (missionDocument is mutable), other things can extract tooltip data from state
*/
c.DocumentManager.prototype.RunMission = function(in_missionDocument, in_inputOwnerOrUndefined, in_inputOrUndefined){
	return c.MissionContext.Run(in_missionDocument, in_inputOwnerOrUndefined, in_inputOrUndefined);
}
c.DocumentManager.prototype["RunMission"] = c.DocumentManager.prototype.RunMission;

/**
 * @nosideefect
 * @param {!string} in_type
 * @return {!Object|undefined}
 */
c.DocumentManager.prototype.NewDocumentData = function(in_type) {
	c.Log(STACK, "DocumentManager.NewDocumentData in_type:" + in_type);

	//c.Log(LOG, "DocumentManager.NewDocumentData");
	if(this.m_staticData[c.SchemaStaticData.sDocumentTypes] == null) {
		c.Log(LOG, "DocumentManager.NewDocumentData gameobject_types undefined");
		return undefined;
	}
	if(false === (in_type in this.m_staticData[c.SchemaStaticData.sDocumentTypes])) {
		c.Log(LOG, "DocumentManager.NewDocumentData document_types in_type not found:" + in_type);
		return undefined;
	}

	var documentData = {};
	documentData[c.SchemaDocument.sType] = in_type;

	//with non trivial documents (default time being now for default value) we need to scribe/unscribe the document to get the creation values
	var document = this.DocumentDataToDocumentInternal(documentData, undefined);
	var documentData2 = undefined;
	if (document != undefined){
		documentData2 = this.DocumentToDocumentData(document);
	}

	return documentData2;
}
c.DocumentManager.prototype["NewDocumentData"] = c.DocumentManager.prototype.NewDocumentData;

/**
 * @nosideefect
 * @param {!Object|undefined} in_documentData
 * @return {!c.Document|undefined}
 */
c.DocumentManager.prototype.DocumentDataToDocument = function(in_documentData) {
	return this.DocumentDataToDocumentInternal(in_documentData, undefined);
}
c.DocumentManager.prototype["DocumentDataToDocument"] = c.DocumentManager.prototype.DocumentDataToDocument;

/**
 * @nosideefect
 * @param {!Object|undefined} in_documentData
 * @param {!c.DagNodeValue|undefined} in_parentNodeOrUndefined
 * @return {!c.Document|undefined}
 */
c.DocumentManager.prototype.DocumentDataToDocumentInternal = function(in_documentData, in_parentNodeOrUndefined) {
	c.Log(STACK, "DocumentManager.DocumentDataToDocument in_documentData:" + JSON.stringify(in_documentData) + " in_parentNodeOrUndefined:" + in_parentNodeOrUndefined);

	if(in_documentData == null) {
		return undefined;
	}
	var type = in_documentData[c.SchemaDocument.sType];
	if(type == null) {
		c.Log(LOG, "DocumentManager.DocumentDataToDocument no type in data document");
		return undefined;
	}
	
	const data = this.m_staticData[c.SchemaStaticData.sDocumentTypes][type];
	if(data == null) {
		//c.Log(LOG, "DocumentManager.DocumentDataToDocument null data for type:" + type);
		return undefined;
	}

	const document = c.Document.Factory(type, {}, in_parentNodeOrUndefined);

	const valueMetadataPath = data[c.SchemaStaticData.sDocumentTypesValue];
	const valueMetadata = c.PathObjectGet(this.m_staticData, valueMetadataPath);
	const calculateMetadataPath = data[c.SchemaStaticData.sDocumentTypesCalculate];
	const calculateMetadata = c.PathObjectGet(this.m_staticData, calculateMetadataPath);
	var context = this.m_instructionContext;
	context = (context === undefined) ? {} : context;

	//add value nodes
	if(valueMetadata != undefined) {
		for(const prop in valueMetadata) {
			const localeName = this.GetLocaleData(prop);
			const metaData = valueMetadata[prop];
			const type = metaData[c.SchemaStaticDataValue.sType];
			const dimentionOrUndefined = metaData[c.SchemaStaticDataValue.sDimension];
			const node = c.DagNodeValue.Factory(prop, localeName, undefined, type, dimentionOrUndefined, this.m_staticData);
			document.SetNode(prop, node);
		}
	}

	//add calculate nodes
	if (calculateMetadata != undefined) {
		for(const prop in calculateMetadata) {
			const localeName = this.GetLocaleData(prop);
			const metaData = calculateMetadata[prop];
			const type = metaData[c.SchemaStaticDataCalculate.sType];
			const instructionData = metaData[c.SchemaStaticDataCalculate.sData];
			if (instructionData === undefined){
				c.Log(LOG, "DocumentManager.DocumentDataToDocument undefined data for calculate node:" + prop + " in document data:" + JSON.stringify(in_documentData));
				continue;
			}

			const instructionArray = [];
			for (var index = 0, total = instructionData.length; index < total; index++) {
				const instructionSource = instructionData[index];
				const newInstruction = Object.assign({}, instructionSource);
				instructionArray.push(newInstruction);
			}
			var dimentionOrUndefined = metaData[c.SchemaStaticDataCalculate.sDimension];
			var isLocale = metaData[c.SchemaStaticDataCalculate.sIsLocale];
			if (isLocale === undefined){
				isLocale = false;
			}
			var tooltipStop = metaData[c.SchemaStaticDataCalculate.sTooltipStop];
			if (tooltipStop === undefined){
				tooltipStop = false;
			}
			const node = c.DagNodeCalculate.Factory(prop, localeName, type, document, instructionArray, dimentionOrUndefined, isLocale, tooltipStop, this.m_staticData, context);
			document.SetNode(prop, node);
		}
	}

	//set the values of the value nodes
	//add value nodes. if the value nodes are of type [document, documentarray, documentmap] the could contain calculation nodes which use [getParenNode, setParenNode]
	// so we do another pass to set parent links (done automattically on SetValue)
	if(valueMetadata != undefined) {
		for(const prop in valueMetadata) {
			const metaData = valueMetadata[prop];
			var node = document.GetNode(prop);
			if (node == undefined){
				throw new Error ("invalid internal state Lost node:" + prop);
			}
			node = /** @type {!c.DagNodeValue} */ (node);
			const value = c.DagNodeValueHelper.FactoryValue(in_documentData[prop], metaData, this.m_staticData, this, node);
			document.SetValue(prop, value);
		}
	}

	c.DagNodeCollectionHelper.AddNodeMapLinks(document.GetNameNodeMap());

	//c.Log(LOG, "DocumentManager.DocumentDataToDocument end");
	return document;
}

/**
 * @nosideefect
 * @param {!c.Document} in_document
 * @return {!Object|undefined}
 */
c.DocumentManager.prototype.DocumentToDocumentData = function(in_document) {
	if(in_document === undefined) {
		return undefined;
	}

	const type = in_document.GetType();
	const data = this.m_staticData[c.SchemaStaticData.sDocumentTypes][type];
	if(data == null) {
		//c.Log(LOG, "DocumentManager.DocumentDataToDocument null data for type:" + type);
		return undefined;
	}

	const valueMetadataPath = data[c.SchemaStaticData.sDocumentTypesValue];
	const valueMetadata = c.PathObjectGet(this.m_staticData, valueMetadataPath);

	var documentData = {};
	documentData[c.SchemaDocument.sType] = type;

	if(valueMetadata != undefined) {
		//c.Log(DEBUG, "DocumentToDocumentData");
		for(const prop in valueMetadata) {
			const metaData = valueMetadata[prop];
			const value = in_document.GetValue(prop);
			if (undefined === value){
				continue;
			}

			//c.Log(DEBUG, " prop:" + prop);
			//c.Log(DEBUG, " value:" + value);
			//c.Log(DEBUG, " date:" + (value instanceof Date));
			//c.Log(DEBUG, " typeof:" + (typeof value));

			const scribeValue = c.DagNodeValueHelper.ScribeValue(value, metaData, this.m_staticData, this);

			if (undefined === scribeValue){
				continue;
			}

			//certain data types require special handling

			documentData[prop] = scribeValue;
		}
	};
	return documentData;
}
c.DocumentManager.prototype["DocumentToDocumentData"] = c.DocumentManager.prototype.DocumentToDocumentData;

/**
 * @public
 * @nosideefect
 * @param {!Object} in_source
 * @param {!Object} in_target
 * @param {!number|undefined} in_writeLockOrUndefined
 * @param {!Array<!string|number>|undefined} in_rootPathOrUndefined
 * @return {!Object}
 */
c.DocumentManager.prototype.MakeUpdatePatch = function(in_source, in_target, in_writeLockOrUndefined, in_rootPathOrUndefined) {
	return c.ObjectDelta.Factory(in_source, in_target, in_writeLockOrUndefined, in_rootPathOrUndefined);
}
c.DocumentManager.prototype["MakeUpdatePatch"] = c.DocumentManager.prototype.MakeUpdatePatch;

/**
 * @public
 * @nosideefect
 * @param {!Object} in_source
 * @param {!Object} in_delta
 * @return {!Object}
 */
c.DocumentManager.prototype.ApplyUpdatePatch = function(in_source, in_delta) {
	return c.ObjectDelta.ApplyDelta(in_source, in_delta);
}
c.DocumentManager.prototype["ApplyUpdatePatch"] = c.DocumentManager.prototype.ApplyUpdatePatch;


