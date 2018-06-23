/*
{
	//do we need a variation for array (mongo commands for database
	removeitems : [ { path : [] }, ... ] //arrayindex part of path if last leaf is array 
	insertitems : [ { path : [], item : * }, ... ] //where item is any (value | array | object)
	updateitems : [ { path : [], item : * }, ... ] //where item is any (value | array | object)
	
}

c.SchemaObjectDelta = {};
c.SchemaObjectDelta.sRemoveItems = "r"; //"removeitems";
c.SchemaObjectDelta.sInsertItems = "i"; //"insertitems";
c.SchemaObjectDelta.sUpdateItems = "u"; //"updateitems";

c.SchemaObjectDelta.sPath = "p"; //"path";
c.SchemaObjectDelta.sItem = "v"; //"item";
*/

/*
//example ObjectDelta
{
	"lock" : 5,
	"d" : [
		{ 
			"t" : "r",
			"p" : ["a",1]
		},
		{
			"t" : "i",
			"p" : ["a", 2],
			"v" : "c"
		},
		{
			"t" : "u",
			"p" : ["a", 3],
			"v" : "d"
		}
	]
}
*/
c.SchemaObjectDelta = {};
c.SchemaObjectDelta.sWriteLock = "lock";
c.SchemaObjectDelta.sData = "d";
c.SchemaObjectDelta.sType = "t";
c.SchemaObjectDelta.sTypeRemove = "r";
c.SchemaObjectDelta.sTypeInsert = "i";
c.SchemaObjectDelta.sTypeUpdate = "u";

c.SchemaObjectDelta.sPath = "p";
c.SchemaObjectDelta.sValue = "v";
