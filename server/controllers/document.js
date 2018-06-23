const Express = require("express");
const Database = require("./../modules/database");
const Q = require("q");
const Document = require("./../modules/document");
const RestListResponse = require("./../modules/restlistresponse");
const Session = require("./../modules/session");
const SchemaDocuments = require("./../schema/documents");
const SchemaUsers = require("./../schema/users");
const SchemaGuests = require("./../schema/guests");
const Util = require("./../modules/util");

const router = Express.Router({ mergeParams: true });
module.exports = router;

router.all("*", Session.middleware);


// get /documents
router.get("/documents", function(in_request, in_response, in_next) {
	try {
		_routerGetDocuments(in_request, in_response);
	} catch (error) {
		console.log("get documents threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}

	return;
});


// get /documents/:ID
router.get("/documents/:ID", function(in_request, in_response, in_next) {
	try {
		_routerGetDocumentsID(in_request, in_response);
	} catch (error) {
		console.log("get documents id threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}

	return;
});

// post /documents/:ID
router.post("/documents/:ID", function(in_request, in_response, in_next) {
	try {
		_routerPostDocumentsID(in_request, in_response);
	} catch (error) {
		console.log("post documents id threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}

	return;
});


// put /documents/:ID
router.put("/documents/:ID", function(in_request, in_response, in_next) {
	try {
		_routerPutDocumentsID(in_request, in_response);
	} catch (error) {
		console.log("put documents id threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}

	return;
});

// delete /documents/:ID
router.delete("/documents/:ID", function(in_request, in_response, in_next) {
	try {
		_routerDeleteDocumentsID(in_request, in_response);
	} catch (error) {
		console.log("delete documents id threw:" + error);
		in_response.status(500).send("server error");
		//nop
	}

	return;
});
