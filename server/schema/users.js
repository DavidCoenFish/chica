//keep a central store of database fields

module.exports._sCollectionName = "users";
module.exports.sID = "_id";
module.exports.sName = "name";
module.exports.sCreationTime = "creation_time";
module.exports.sEmail = "email";
//module.exports.sAllowEmailSearch = "email_search"; or just send link to email
//module.exports.sValidated = "validated";
module.exports.sSalt = "salt";
module.exports.sPasswordHash = "password_hash";

module.exports.sArrayOwnedDocument = "owned_document";
module.exports.sArrayWriteDocument = "write_document";
module.exports.sArrayReadDocument = "read_document";


