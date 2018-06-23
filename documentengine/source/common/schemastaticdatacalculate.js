/**
	schema is a contract with the static data
	name is the object key in te parent container
 * @const {!Object}
 */
c.SchemaStaticDataCalculate = {};

c.SchemaStaticDataCalculate.sData = "data";
c.SchemaStaticDataCalculate.sDataOperation = "op";

//we try to use value from stack rather than instruction value, 
//exception when we need to make dependancies (the get and set node)
//operations dealing with built in types and internal data live here
//maths or weird client logic lives in the external instruction context
/**
 * @enum {string}
 */
c.SchemaStaticDataCalculate.Operation = {

	//ePushSelf : "pushSelf", put the current document onto the stack?

	ePushConst : "pushconst", // push value from instruction data

	eGetStaticDataObject : "getstaticdataobject", // pop string array, use as path to get result from static data, push result on stack

	//links to nodes are precalculated on document creation, must be a node from within the document (dagnodecollection) but since entire document reference can be under a node
	// the use case of a 'environment' document with time of day, temperature, type of environment
	eGetNode : "getnode", // get value from instuction node, push value on stack
	eSetNode : "setnode", // pop value from stack, set value to instuction node

	eGetParentNode : "getparentnode", // get value from parent instuction node, push value on stack
	eSetParentNode : "setparentnode", // pop value from stack, set value to parent instuction node

	//nb. we get the document via the eGetNode command on a document, documentArray, IdDocumentMap. so we track the dirty path via eGetNode, and any value change in the document is reported to the owning node
	eGetDocumentValue : "getdocumentvalue", //pop value name, pop document, push value 
	eSetDocumentValue : "setdocumentvalue", //pop value, pop value name, pop document

	eGetDocumentArrayValue : "getdocumentarrayvalue", //pop value name, pop document array, push value array. get a value from an array of documents
	eGetDocumentValueArray : "getdocumentvaluearray", //pop value name array, pop document, push value array. get a array of values from a document

	eGetArrayValue : "getarrayvalue", //pop index, pop array, push item or undefined
	eSetArrayValue : "setarrayvalue", //pop index, pop value, pop array, push array
	eGetObjectValue : "getobjectvalue", // pop key, pop object, push value
	eSetObjectValue : "setobjectvalue", // pop key, pop value, pop object, push object
	eObjectHasKey : "objecthaskey", // pop key, pop object, push bool
	eObjectAddKey : "objectaddkey", //pop key, pop object, push object
	eObjectRemoveKey : "objectremovekey", // pop key, pop object, push object
	eObjectToStack : "objecttostack", // pop object, push value, push key, ....
	eStackToObject : "stacktoobject", // pop key, pop value, ....

	//eDup : "dup", //pop index, take value from stack at index and push (just push ref, no deep copy)
	//eRemove : "remove", //pop index, remove a value from the stack

	eIf : "if", // pop a value, pop a, pop b, if value is true, push a, else push b
	eTestUndefined : "testundefined", // pop a, if a was undefined push true

	eReplaceUndefined : "replaceundefined", //popA, popB, if B undefined, push A, else push B

	//==, <= , < in instruction context? or provide simple tests?
	eEqual : "equal", //pop a, pop b, push (a == b)
	eLessEqual : "lessequal", //pop a, pop b, push (a <= b)
	eLess : "less", //pop a, pop b, push (a < b)

	eAnd : "and", //pop a, pop b, push (a && b)
	eOr : "or", //pop a, pop b, push (a || b)
	eXor : "xor", //pop a, pop b, push (a !== b)
	eNot : "not", //pop a, push (!a)

	eArrayToStack : "arraytostack", // pop array, push item 0, ...
	eArrayOfArrayToStack : "arrayofarraytostack", // pop array of arrays, push item 0, ...
	eStackToArray : "stacktoarray", // pop item 0, ..., push array
	eStackAllTrue : "stackalltrue",
	eStackAnyTrue : "stackanytrue",
	eArrayToMap : "arraytomap",
	eMapToArray : "maptoarray",

	eF0 : "f0", // call instruct context function, with zero param, push return value
	eF1 : "f1", // pop param 0 
	eF2 : "f2", // pop param 0, param 1 
	eF3 : "f3", // pop param 0, param 1, param 2
	eF4 : "f4",
	eF5 : "f5",
	eF6 : "f6",
	eF7 : "f7",

};

c.SchemaStaticDataCalculate.sDataValue = "value"; //int, string, bool, float, array of string for static data path, hash set, node name,  name of context function

c.SchemaStaticDataCalculate.sDataNode = "node"; //not part of the static data, added when setting up links for convienience

/*
talking to other documents? or thing in node may be a document
*/


//provide a type hint of the calculate output, could use c.SchemaStaticDataValue.Type + c.SchemaStaticDataCalculate.Type, but don't want all?
c.SchemaStaticDataCalculate.sType = "type"; //value : string
c.SchemaStaticDataCalculate.sTooltipStop = "tooltipstop"; // hint that when generating tooltip popups, to not expand this node

c.SchemaStaticDataCalculate.sDimension = "dimension";
c.SchemaStaticDataCalculate.sIsLocale = "islocale"; // the string value of the node is actually a locale key (eKey are stored as strings, and also obliged to have locale strings

/**
 * @enum {string}
 */
c.SchemaStaticDataCalculate.Type = {
	eBool : "bool",
	eBoolArray : "boolarray",
	eInt : "int",
	eIntArray : "intarray",
	eFloat : "float",
	eFloatArray : "floatarray",
	eString : "string",
	eStringArray : "stringarray",
	eStringMap : "stringmap",
	eKey : "key", //static data has an object at given path, value is a key from this object
	eKeyArray : "keyarray",
	eKeyMap : "keymap",
	eDocument : "document",
	eDocumentArray : "documentarray",
	eIDDocumentMap : "iddocumentmap",
	eObject : "object", //from static data or from stack to object
	eArray : "array", //from static data or from stack to array

	eUnknown : "unknown", // type not determinant
	eUnknownArray : "unknownarray", // an array of object of no determined type
};

