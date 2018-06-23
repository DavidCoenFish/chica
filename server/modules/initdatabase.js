const Database = require("./database");
const SchemaUsers = require("./../schema/users");
const Q = require("q");

module.exports = function(){
	return Database.addUniqueIndex(SchemaUsers._sCollectionName, SchemaUsers.sEmail);
}
