const Config = require("config");
const Encript = require("./encript");
const Util = require("./util");

module.exports.middleware = function(in_request, in_response, in_next){
	//console.log("session middleware in_request.url:" + in_request.url + " in_request.method:" + in_request.method);
	//console.log(" in_request body:" + JSON.stringify(in_request.body));

	var cookieSesson = null;
	var querySesson = null;

	if ((null != in_request.signedCookies) &&
		(Config.sessionCookieName in in_request.signedCookies)){
		cookieSesson = {
			"id" : in_request.signedCookies[Config.sessionCookieName],
			"time" : new Date()
		}
	}

	if ((null != in_request.query) && ("sessionkey" in in_request.query)){
		try{
			var sessionKey = in_request.query["sessionkey"];
			querySesson = sessionKeyDecode(sessionKey, new Date());
		}
		catch(error){
			console.log("session threw:" + error);
			querySesson = null;
		}
	}

	//console.log("session found cookieSesson:" + JSON.stringify(cookieSesson));
	//console.log("session found querySesson:" + JSON.stringify(querySesson));

	if (cookieSesson != null){
		in_request.session = cookieSesson;
		// don't cross polinate, only propergate request cookie to resonse cookie
		setSession(in_response, cookieSesson.accountID);
	} else if (querySesson != null){
		in_request.session = querySesson;
	} else {
		delete in_request.session;
	}

	in_next();
}


const setSession = function(in_response, in_account){
	if (in_account == null){
		in_response.clearCookie(Config.sessionCookieName);
		return;
	}
	in_response.cookie(Config.sessionCookieName, in_account, {signed: true, expires: new Date(Date.now() + Config.sessionDurationMS)})
}
module.exports.setSession = setSession;

const sessionKeyFactory = function(in_accountID, in_date){
	if (in_accountID == null){
		return null;
	}
	var session = {
		"id" : in_accountID,
		"time" : in_date.valueOf()
	};
	var sessionKey = Encript.encodeStringBase64(JSON.stringify(session), Config.sessionEncodePassword);
	var sessionKeyEscaped = encodeURIComponent(sessionKey);
	return sessionKeyEscaped; 
}
module.exports.sessionKeyFactory = sessionKeyFactory;

const sessionKeyDecode = function(in_sessionBase64StringEscaped, in_date){
	if ((null == in_sessionBase64StringEscaped) || ("" === in_sessionBase64StringEscaped)){
		return null;
	}

	var sessionBase64String = decodeURIComponent(in_sessionBase64StringEscaped);
	var decodedString = Encript.decodeStringBase64(sessionBase64String, Config.sessionEncodePassword);
	var session = JSON.parse(decodedString);
	//if it has expired, it is no good
	var time = in_date.valueOf();
	if ((session == null) ||
		(false === "time" in session) ||
		(false === "id" in session) ||
		(time < session["time"]) ||
		(session["time"] + Config.sessionDurationMS < time)){
		//console.log("reject session session:" + JSON.stringify(session));
		return null;
	}

	return session;
}
module.exports.sessionKeyDecode = sessionKeyDecode;
