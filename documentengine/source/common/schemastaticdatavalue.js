/*
	schema is a contract with the static data
	name is the object key in te parent container
*/
c.SchemaStaticDataValue = {};

// can this value be editted on the client (else server only edit?)
c.SchemaStaticDataValue.sClientLocked = "clientlocked";

c.SchemaStaticDataValue.sType = "type"; //value : string
/**
 * @enum {string}
 */
c.SchemaStaticDataValue.Type = {
	eBool : "bool",
	eBoolArray : "boolarray",
	eInt : "int",
	eIntArray : "intarray",
	eFloat : "float",
	eFloatArray : "floatarray",
	eString : "string",
	eStringArray : "stringarray",
	eStringMap : "stringmap", //strings are unique { key<string> : value <undefined> }
	//eStringStringMap : "stringstringmap" , //{ key<string> : value <string> }

	//string acting as enum, document manager has static data object containing valid keys
	eKey : "key", //static data has an object at given path, value is a key from this object
	eKeyArray : "keyarray",
	eKeyMap : "keymap",

	// just use number and a default "number from date value"
	//eDate : "date", //number, new Date().toValue()
	//eDateArray : "datearray",

	// id are just a flavour of default string?
	//eID : "id", //string, internal, 16? rand char
	//eIDArray : "idarray",
	//eDatabaseID : "databaseid", //string, hint to server for mongodb.ObjectID
	//eDatabaseIDArray : "databaseidarray",

	//todo: need to pass down document manager? 
	// do we have a flag for document with id that can be refernced, or add all children documents to root map if thiey have an id
	eDocument : "document",
	eDocumentArray : "documentarray",

	eIDDocumentMap : "iddocumentmap", //

	// stringmap has replaced hashset
	//eHashSet : "hashset", //a hash set of stings (cookies) runtime as object with keys as properties, scribe as array of keys as strings
	//eHashSetArray : "hashsetarray"

	eObject : "object", //is this that bad? limit to object, array, and primitives (string, number, boolean)
	eObjectStringMap : "objectstringmap"  //{ key<string> : value <string> }
};
c.SchemaStaticDataValue.sDefaultValueBool = "defaultvaluebool";
c.SchemaStaticDataValue.sDefaultValueInt = "defaultvalueint";
c.SchemaStaticDataValue.sDefaultValueIntUseRand = "defaultvalueintuserand"; //value is bool, flag to generate rand nb between 0 or low and high
c.SchemaStaticDataValue.sDefaultValueIntDateNow = "defaultvalueintdatenow"; //value is bool true to use a default int value as data now value
c.SchemaStaticDataValue.sDefaultValueFloat = "defaultvaluefloat";
c.SchemaStaticDataValue.sDefaultValueString = "defaultvaluestring";
c.SchemaStaticDataValue.sDefaultValueStringRandId = "defaultvaluestringrandid"; //value is bool true 
c.SchemaStaticDataValue.sDefaultValueStringRandDatabaseId = "defaultvaluestringranddatabaseid"; //value is bool true 
c.SchemaStaticDataValue.sDefaultValueStringMap = "defaultvaluestringmap"; //array of strings
c.SchemaStaticDataValue.sDefaultValueKey = "defaultvaluekey";
c.SchemaStaticDataValue.sDefaultValueKeyMap = "defaultvaluekeymap"; //arrayofstrings
c.SchemaStaticDataValue.sDefaultValueKeyUseRand = "defaultvaluekeyuserand";
c.SchemaStaticDataValue.sDefaultValueKeyRandArray = "defaultvaluekeyrandarray";
c.SchemaStaticDataValue.sDefaultValueDocumentType = "defaultvaluedocumenttype";

c.SchemaStaticDataValue.sKeyPath = "keypath"; //array of string in static data to a data object
c.SchemaStaticDataValue.sDocumentTypeArray = "documenttypearray"; //array of types that we allow child documents to be
c.SchemaStaticDataValue.sArrayLengthMin = "arraylengthmin";
c.SchemaStaticDataValue.sArrayLengthMax = "arraylengthmax";
c.SchemaStaticDataValue.sStringLengthMin = "stringlengthmin";
c.SchemaStaticDataValue.sStringLengthMax = "stringlengthmax";
c.SchemaStaticDataValue.sIntRangeLow = "intrangelow";
c.SchemaStaticDataValue.sIntRangeHigh = "intrangehigh";
c.SchemaStaticDataValue.sFloatRangeLow = "floatrangelow";
c.SchemaStaticDataValue.sFloatRangeHigh = "floatrangehigh";

c.SchemaStaticDataValue.sDimension = "dimension";
//islocale is based on type, key (and keyarray, keymap) are always locale strings?
