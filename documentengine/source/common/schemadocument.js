/*
	only documents that can be referenced by id are obliged to have an id value key
*/
c.SchemaDocument = {};
//nb. type only in database document
c.SchemaDocument.sType = "type";
//WARNING, mongodb has a special meaning for "_id"
c.SchemaDocument.sID = "id";
