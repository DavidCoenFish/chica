const Config = require("config");
const Util = require("./util");
const Url = require("url");
/*
rest helper, write out the response for a restful list and deal with pageing
*/


const _getRequestQueryInt = function(in_request, in_name, in_default){
	if ((null != in_request.query) && (in_name in in_request.query))
	{
		var pageString = in_request.query[in_name];
		if (false == isNaN(pageString))
		{
			return parseInt(pageString);
		}
	}

	return in_default;
}

module.exports = function(in_request, in_response, in_dataArray) {
	var pageIndex = _getRequestQueryInt(in_request, "page", 0);
	var itemsPerPage = _getRequestQueryInt(in_request, "perpage", Config.paginationLimit);
	if (false === (0 <= pageIndex))
	{
		Util.responseSendError(in_response, 400, "invalid page index");
		return;
	}
	if (false === (1 <= itemsPerPage))
	{
		Util.responseSendError(in_response, 400, "invalid items per page");
		return;
	}

	var total = in_dataArray.length;
	var pageCount = Math.max(Math.ceil(total / itemsPerPage), 1);

	var outputArray = [];
	for (var index = 0; index < itemsPerPage; index++) {
		var localIndex = (pageIndex * itemsPerPage) + index;
		if ((0 <= localIndex) && (localIndex < total)){
			outputArray.push(in_dataArray[localIndex]);
		}
	}

	var links = [];
	var url = Url.parse(in_request.originalUrl);
	links.push({"self": url.href});
	links.push({"first": url.pathname + "?page=0&perpage=" + itemsPerPage});
	if (0 < pageIndex){
		links.push({"previous": url.pathname + "?page=" + (pageIndex - 1) + "&perpage=" + itemsPerPage});
	}
	if (pageIndex + 1 < pageCount){
		links.push({"next": url.pathname + "?page=" + (pageIndex + 1) + "&perpage=" + itemsPerPage});
	}
	links.push({"last": url.pathname + "?page=" + (pageCount - 1) + "&perpage=" + itemsPerPage});

	var body = {};
	body["metadata"] = {
			"page" : pageIndex,
			"per_page" : itemsPerPage,
			"page_count" : pageCount,
			"total_count" : total,
			"links" : links
		};
	body["records"] = outputArray;

	//console.log("accounts result:" + JSON.stringify(result));

	in_response.statusCode = 200;
	in_response.setHeader("total-count", total);
	in_response.setHeader("Pagination-Count", total);
	in_response.setHeader("Pagination-Page", pageIndex);
	in_response.setHeader("Pagination-Limit", itemsPerPage);
	in_response.setHeader("Content-Type", "application/json");
	in_response.json(body);
	in_response.end();

	return;
}
