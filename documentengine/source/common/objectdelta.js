c.ObjectDelta = {}
c["ObjectDelta"] = c.ObjectDelta;

/**
 * @public
 * @nosideefect
 * @param {!Object} in_source
 * @param {!Object} in_target
 * @param {!number|undefined} in_writeLockOrUndefined
 * @param {!Array<!string|number>|undefined} in_rootPathOrUndefined
 * @return {!Object}
 */
c.ObjectDelta.Factory = function(in_source, in_target, in_writeLockOrUndefined, in_rootPathOrUndefined){
	var arrayData = [];
	var rootPath = in_rootPathOrUndefined;
	if (rootPath === undefined){
		rootPath = [];
	}

	c.ObjectDelta.CollectDeltaObject(arrayData, rootPath, in_source, in_target);

	const result = {};
	if (0 < arrayData.length){
		result[c.SchemaObjectDelta.sData] = arrayData;
	}
	if (in_writeLockOrUndefined != undefined){
		result[c.SchemaObjectDelta.sWriteLock] = in_writeLockOrUndefined;
	}

	return result;
}
c.ObjectDelta["Factory"] = c.ObjectDelta.Factory;

/**
 * @private
 * @nosideefect
 * @param {!Array<Object>} in_arrayData
 * @param {!Array<!string|number>} in_path
 * @param {*} in_sourceValue
 * @param {*} in_targetValue
 * @return {undefined}
 */
c.ObjectDelta.CollectDelta = function(in_arrayData, in_path, in_sourceValue, in_targetValue){
	// value removed
	if ((in_sourceValue !== undefined) && (in_targetValue === undefined)){
		const op = {};
		op[c.SchemaObjectDelta.sType] = c.SchemaObjectDelta.sTypeRemove;
		op[c.SchemaObjectDelta.sPath] = c.ArrayShallowClone(in_path);
		in_arrayData.push(op);
		return;
	}

	// value inserted
	if ((in_sourceValue === undefined) && (in_targetValue !== undefined)){
		const op = {};
		op[c.SchemaObjectDelta.sType] = c.SchemaObjectDelta.sTypeInsert;
		op[c.SchemaObjectDelta.sPath] = c.ArrayShallowClone(in_path);
		op[c.SchemaObjectDelta.sValue] = in_targetValue;
		in_arrayData.push(op);
		return;
	}

	// has value changed
	if ((in_sourceValue !== undefined) && (in_targetValue !== undefined)){
		const sourceType = Object.prototype.toString.call(in_sourceValue);
		const targetType = Object.prototype.toString.call(in_targetValue);

		if (sourceType !== targetType){
			c.Log(EXCEPTION, "c.ObjectDelta.CollectDelta type missmatch sourceType:" + sourceType + " targetType:" + targetType + " path:" + JSON.stringify(in_path));
			return;
		}

		if ("[object Array]" === sourceType){ //is array
			c.ObjectDelta.CollectDeltaArray(in_arrayData, in_path, in_sourceValue, in_targetValue);
		} else if ("[object Object]" === sourceType){ //is object
			c.ObjectDelta.CollectDeltaObject(in_arrayData, in_path, in_sourceValue, in_targetValue);
		} else if (in_sourceValue !== in_targetValue) { //is value
			const op = {};
			op[c.SchemaObjectDelta.sType] = c.SchemaObjectDelta.sTypeUpdate;
			op[c.SchemaObjectDelta.sPath] = c.ArrayShallowClone(in_path);
			op[c.SchemaObjectDelta.sValue] = in_targetValue;
			in_arrayData.push(op);
		}
	}

	return;
}

/**
 * @private
 * @nosideefect
 * @param {!Array<Object>} in_arrayData
 * @param {!Array<!string|number>} in_path
 * @param {*} in_sourceValue
 * @param {*} in_targetValue
 * @return {undefined}
 */
c.ObjectDelta.CollectDeltaArray = function(in_arrayData, in_path, in_sourceValue, in_targetValue){
	/*
		our aim is to generate a delta to get from source to target
		work backwards from target, we want to know the sequencial best match of each source item 
			sequencial in that we can't change order to get from source to target, just remove, insert, update
	*/

	var sortData = [];
	for (var index = 0, total = in_targetValue.length; index < total; index++) {
		var targetValue = in_targetValue[index];

		var sortSubData = [];
		for (var subIndex = 0, subTotal = in_sourceValue.length; subIndex < subTotal; subIndex++) {
			var sourceValue = in_sourceValue[subIndex];

			var match = c.ObjectDelta.CalculateMatch(sourceValue, targetValue);
			if (match <= 0.0){
				continue;
			}
			sortSubData.push({"s" : subIndex, "m" : match});
		}

		sortData.push(sortSubData);
	}

	sortData = c.ObjectDelta.SelectOptimalSortData(sortData);
	//c.Log(LOG, "CollectDeltaArray sortData:" + JSON.stringify(sortData));

	//if there is no difference (same length, all diff === 1.0), bail?
	//if the total diff is <= 0, just assign? < 0.25?

	//generate the list of instructions to get from sourceValue to targetValue
	//sortData is one to one with targetValue containing info for what sourceValue can be used

	var insertCount = 0;
	var removeCount = 0;
	var trace = 0;
	for (var index = 0, total = sortData.length; index < total; index++) {
		var targetValue = in_targetValue[index];
		var sortItem = sortData[index];
		if (sortItem == undefined){
			c.ObjectDelta.DeltaArrayApplyInsert(in_arrayData, in_path, targetValue, index);
			insertCount += 1;
		} else {
			var sourceIndex = sortItem["s"];
			var pathIndex = sourceIndex + insertCount - removeCount;
			while (index < pathIndex){
				c.ObjectDelta.DeltaArrayApplyRemove(in_arrayData, in_path, pathIndex - 1);
				removeCount += 1;
				pathIndex = sourceIndex + insertCount - removeCount;
			}
			var match = sortItem["m"];
			if (match < 1.0){
				var sourceItem = in_sourceValue[sourceIndex];
				c.ObjectDelta.DeltaArrayApplyUpdate(in_arrayData, in_path, sourceItem, targetValue, pathIndex);
			}
		}
		trace += 1;
	}

	while (trace < in_sourceValue.length + insertCount - removeCount){
		c.ObjectDelta.DeltaArrayApplyRemove(in_arrayData, in_path, trace);
		removeCount += 1;
	}

	return;
}

/*
	var state = {
		"i" : 0, //insertCount
		"r" : 0, //removeCount
		"s" : 0, //sourceTrace
		"p" : 0 // path trace
	};
in_index is the 
*/


/*
return 1.0f if value matches, otherwise for array/object return % match [0.0 ... 1.0]

 * @private
 * @nosideefect
 * @param {*} in_sourceValue
 * @param {*} in_targetValue
 * @return {number}
*/
c.ObjectDelta.CalculateMatch = function(in_sourceValue, in_targetValue){
	const sourceType = Object.prototype.toString.call(in_sourceValue);
	const targetType = Object.prototype.toString.call(in_targetValue);

	if (sourceType !== targetType){
		// one side may be undefined?
		//c.Log(EXCEPTION, "c.ObjectDelta.CalculateMatch type missmatch sourceType:" + sourceType + " targetType:" + targetType + " path:" + JSON.stringify(in_path));
		return 0.0;
	}

	if ("[object Array]" === sourceType){ //is array
		var sumMatch = 0;
		var matchMul = 1.0;
		if (in_sourceValue.length !== in_targetValue.length){
			matchMul = 0.5;
		}

		var count = Math.min(in_sourceValue.length, in_targetValue.length);
		for (var index = 0; index < count; index++) {
			var sourceItem = in_sourceValue[index];
			var targetItem = in_targetValue[index];
			sumMatch += c.ObjectDelta.CalculateMatch(sourceItem, targetItem);
		}

		var match = 1.0;
		if (0 < count){
			match = sumMatch / count;
		}
		match *= matchMul;

		return match;

	} else if ("[object Object]" === sourceType){ //is object
		var count = 0;
		var sumMatch = 0;

		for (var key in in_sourceValue) {
			if (false === in_sourceValue.hasOwnProperty(key)) {
				continue;
			}
			count += 1;
			sumMatch += c.ObjectDelta.CalculateMatch(in_sourceValue[key], in_targetValue[key]);
		}

		for (key in in_targetValue) {
			if (false === in_targetValue.hasOwnProperty(key)) {
				continue;
			}
			//already calculated diff for key
			if (key in in_sourceValue) {
				continue;
			}

			count += 1;
			sumMatch += c.ObjectDelta.CalculateMatch(in_sourceValue[key], in_targetValue[key]);
		}

		var match = 1.0;
		if (0 < count){
			match = sumMatch / count;
		}

		return match;

	} else if (in_sourceValue === in_targetValue) { //is value (that matches)
		return 1.0;
	}

	return 0.0;
}

/*
 * @private
 * @nosideefect
 * @param {!Array<Object>} in_arrayData
 * @param {!Array<!string|number>} in_path
 * @param {number} in_matchPathIndex
 * @return {undefined}
*/
c.ObjectDelta.DeltaArrayApplyRemove = function(in_arrayData, in_path, in_matchPathIndex){
	var op = {};
	var path = c.ArrayShallowClone(in_path);
	path.push(in_matchPathIndex);
	op[c.SchemaObjectDelta.sType] = c.SchemaObjectDelta.sTypeRemove;
	op[c.SchemaObjectDelta.sPath] = path;
	in_arrayData.push(op);
	return;
}

/*
 * @private
 * @nosideefect
 * @param {!Array<Object>} in_arrayData
 * @param {!Array<!string|number>} in_path
 * @param {*} in_targetValue
 * @param {number} in_matchPathIndex
 * @return {undefined}
*/
c.ObjectDelta.DeltaArrayApplyInsert = function(in_arrayData, in_path, in_targetValue, in_matchPathIndex){
	var op = {};
	var path = c.ArrayShallowClone(in_path);
	path.push(in_matchPathIndex);
	op[c.SchemaObjectDelta.sType] = c.SchemaObjectDelta.sTypeInsert;
	op[c.SchemaObjectDelta.sPath] = path;
	op[c.SchemaObjectDelta.sValue] = in_targetValue;
	in_arrayData.push(op);

	//c.Log(LOG, "DeltaArrayApplyInsert op:" + JSON.stringify(op));

	return;
}

/*
 * @private
 * @nosideefect
 * @param {!Array<Object>} in_arrayData
 * @param {!Array<!string|number>} in_path
 * @param {*} in_sourceValue
 * @param {*} in_targetValue
 * @param {number} in_matchPathIndex
 * @return {undefined}
*/
c.ObjectDelta.DeltaArrayApplyUpdate = function(in_arrayData, in_path, in_sourceValue, in_targetValue, in_matchPathIndex){
	var path = c.ArrayShallowClone(in_path);
	path.push(in_matchPathIndex);
	c.ObjectDelta.CollectDelta(in_arrayData, path, in_sourceValue, in_targetValue);
	return;
}


//todo: magic to reduce sortData items down to only having max length of one
c.ObjectDelta.SelectOptimalSortData = function(in_sortData){
	var result = [];
	var trace = -1;

	//for now, just select a vaild path, selecting an optimal path is a TODO:
	for (var index = 0, total = in_sortData.length; index < total; index++) {
		var sortDataItem = in_sortData[index];
		var found = undefined;

		for (var subIndex = 0, subTotal = sortDataItem.length; subIndex < subTotal; subIndex++) {
			var item = sortDataItem[subIndex];
			if (trace < item["s"]){
				trace = item["s"];
				found = item;
				break;
			}
		}

		result.push(found);
	}

	return result;
}

/**
 * @private
 * @nosideefect
 * @param {!Array<Object>} in_arrayData
 * @param {!Array<!string|number>} in_path
 * @param {*} in_sourceValue
 * @param {*} in_targetValue
 * @return {undefined}
 */
c.ObjectDelta.CollectDeltaObject = function(in_arrayData, in_path, in_sourceValue, in_targetValue){
	//if source and target objects match, there is nothing to do
	//if they completly dont match? 100% 75%? then replace the object
	// for now, just recurse for objects, leave replace object as one blob for TODO: dcoen

	for (var key in in_sourceValue) {
		if (false === in_sourceValue.hasOwnProperty(key)) {
			continue;
		}

		const path = c.ArrayShallowClone(in_path);
		path.push(key);
		c.ObjectDelta.CollectDelta(in_arrayData, path, in_sourceValue[key], in_targetValue[key]);
	}

	for (var key in in_targetValue) {
		if (false === in_targetValue.hasOwnProperty(key)) {
			continue;
		}
		//already delta with
		if (key in in_sourceValue) {
			continue;
		}

		const path = c.ArrayShallowClone(in_path);
		path.push(key);

		c.ObjectDelta.CollectDelta(in_arrayData, path, in_sourceValue[key], in_targetValue[key]);
	}

	return;
}

/**
 * @nosideefect
 * @param {!Object} in_base
 * @param {!Object} in_objectDelta
 * @return {!Object}


c.SchemaObjectDelta = {};
c.SchemaObjectDelta.sData = "d";
c.SchemaObjectDelta.sType = "t";
c.SchemaObjectDelta.sTypeRemove = "r";
c.SchemaObjectDelta.sTypeInsert = "i";
c.SchemaObjectDelta.sTypeUpdate = "u";

c.SchemaObjectDelta.sPath = "p";
c.SchemaObjectDelta.sValue = "v";

 */
c.ObjectDelta.ApplyDelta = function(in_base, in_objectDelta){ //return new object
	//c.Log(LOG, "ApplyDelta in_base:" + JSON.stringify(in_base) + " in_objectDelta:" + JSON.stringify(in_objectDelta));
	const result = /** @type {!Object} */ (c.DeepClone(in_base));
	//c.Log(LOG, " result0:" + JSON.stringify(result));

	const data = in_objectDelta[c.SchemaObjectDelta.sData];
	if (data == null){
		return result;
	}
	for (var index = 0, total = data.length; index < total; index++) {
		var op = data[index];
		var type = op[c.SchemaObjectDelta.sType];
		var path = c.ArrayShallowClone(op[c.SchemaObjectDelta.sPath]);
		switch (type){
			default:
				break;
			case c.SchemaObjectDelta.sTypeRemove:
				//we expect the path to have the last item as the array index if parent is array, else object key
				var removeKey = path[path.length - 1];
				path.splice(-1, 1);
				var parent = c.PathObjectGet(result, path);
				if (true === c.IsArray(parent)){
					parent.splice(removeKey, 1);
					//c.PathObjectSet(result, path, targetArray);
				} else {
					delete parent[removeKey];
					//redundant? c.PathObjectSet(result, path, parent);
				}

				break;
			case c.SchemaObjectDelta.sTypeInsert:
				//we expect the path to have the last item as the array index if parent is array, else object key
				const insertKey = path[path.length - 1];
				path.splice(-1, 1);
				var parent = c.PathObjectGet(result, path);
				var value = op[c.SchemaObjectDelta.sValue];

				if (true === c.IsArray(parent)){
					parent.splice(insertKey, 0, value);
				} else {
					parent[insertKey] = value;
					//redundant? c.PathObjectSet(result, path, parent);
				}

				break;
			case c.SchemaObjectDelta.sTypeUpdate:
				var value = op[c.SchemaObjectDelta.sValue];
				c.PathObjectSet(result, path, value);
				break;
		}
	}

	return result;
}
c.ObjectDelta["ApplyDelta"] = c.ObjectDelta.ApplyDelta;

