//keep a central store of database fields

module.exports._sCollectionName = "documents";
module.exports.sID = "_id";
module.exports.sName = "name";
module.exports.sApplication = "application"; // the name of the application associated with this document
module.exports.sCreationTime = "creation_time"; // when the document was created
module.exports.sLastModifyTime = "last_modify_time"; // when the document was last modified
module.exports.sWriteLock = "write_lock"; // help with merge by keeping a version number of the document, incremented on update database. updates are ignored if there write lock doesn't match the database write lock
module.exports.sData = "data"; //object

//ownership .	can read, write, and delete (when there are no owners left, document is deleted)
//write.		can read and write
//read.			can read

module.exports.sOwnerArray = "owner_array"; //infers write, read, allowed to delete (remove ownership). Array of users/ guests ids
module.exports.sWriteArray = "write_array"; //people this document has been shared with. Array of users/ guests ids
module.exports.sReadArray = "read_array"; //people this document has been shared with. Array of users/ guests ids

module.exports.sPublicWrite = "public_write"; // anyone can read and write
module.exports.sPublicRead = "public_read"; // anyone can read

module.exports.sParent = "parent"; //file heirearchy, the parent system.folder of the document, or null for root.
	// in the case of a shared (one we don't own) document, if the parent folder is not visible to the share-ee, then put into share document root

	// type
	// ... properties


