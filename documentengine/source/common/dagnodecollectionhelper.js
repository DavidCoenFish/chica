/**
 * @final
 */
c.DagNodeCollectionHelper = {}

/**
 * @param {!Object<string,!(c.DagNodeCalculate|c.DagNodeValue)>} in_mapNameNode
 * @param {!Object<string,!(c.DagNodeCalculate|c.DagNodeValue)>} in_parentNodeMap
 * @return {undefined}
 */
c.DagNodeCollectionHelper.AddNodeMapLinksParent = function(in_mapNameNode, in_parentNodeMap) {
	//c.Log(LOG, "DagNodeCollectionHelper.AddNodeMapLinksParent start");

	for (var nodeName in in_mapNameNode) {
		if (false === in_mapNameNode.hasOwnProperty(nodeName)) {
			continue;
		}
		var node = in_mapNameNode[nodeName];

		var instructionArray = node.GetInstructionArray();
		if (instructionArray === undefined){
			continue;
		}
		node = /** @type {!c.DagNodeCalculate} */ (node);

		for (var subIndex = 0, subLen = instructionArray.length; subIndex < subLen; subIndex++) {
			var instruction = instructionArray[subIndex];
			var operation = instruction[c.SchemaStaticDataCalculate.sDataOperation];
			var getParentNode = c.SchemaStaticDataCalculate.Operation.eGetParentNode === operation;
			var setParentNode = c.SchemaStaticDataCalculate.Operation.eSetParentNode === operation;
			if ((false === getParentNode) && (false === setParentNode)){
				continue;
			}

			var subNodeName = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var subNode = in_parentNodeMap[subNodeName];
			if (undefined === subNode){
				var nodeKeysString = (in_mapNameNode != null) ? JSON.stringify(Object.keys(in_mapNameNode)) : "undefined";
				var parentNodeKeysString = (in_parentNodeMap != null) ? JSON.stringify(Object.keys(in_parentNodeMap)) : "undefined";
				throw new Error ("AddNodeMapLinksParent node not found:" + subNodeName + " for node:" + nodeName + " subIndex:" + subIndex + " instruction:" + JSON.stringify(instruction) + " nodeKeysString:" + nodeKeysString + " parentNodeKeysString:" + parentNodeKeysString);
			}

			instruction[c.SchemaStaticDataCalculate.sDataNode] = subNode;
			if (true === getParentNode){
				c.DagNodeCollectionHelper.SetNodesLinked(subNode, node);
			}
			if (true === setParentNode){
				if (false === (subNode instanceof c.DagNodeValue)){
					throw new Error ("AddNodeMapLinksParent node incorrect type for setNode:" + subNodeName + " link from:" + nodeName);
				}
				c.DagNodeCollectionHelper.SetNodesLinked(node, subNode);
			}
		}
	}

	//c.Log(LOG, "DagNodeCollectionHelper.AddNodeMapLinksParent end");

	return;
}


/**
 * @param {!Object<string,!(c.DagNodeCalculate|c.DagNodeValue)>} in_mapNameNode
 * @return {undefined}
 */
c.DagNodeCollectionHelper.RemoveNodeMapLinksParent = function(in_mapNameNode) {
	//c.Log(LOG, "DagNodeCollectionHelper.RemoveNodeMapLinksParent start");

	for (var nodeName in in_mapNameNode) {
		if (false === in_mapNameNode.hasOwnProperty(nodeName)) {
			continue;
		}
		var node = in_mapNameNode[nodeName];

		var instructionArray = node.GetInstructionArray();
		if (instructionArray === undefined){
			continue;
		}
		node = /** @type {!c.DagNodeCalculate} */ (node);

		for (var subIndex = 0, subLen = instructionArray.length; subIndex < subLen; subIndex++) {
			var instruction = instructionArray[subIndex];
			var operation = instruction[c.SchemaStaticDataCalculate.sDataOperation];
			var getParentNode = c.SchemaStaticDataCalculate.Operation.eGetParentNode === operation;
			var setParentNode = c.SchemaStaticDataCalculate.Operation.eSetParentNode === operation;
			if ((false === getParentNode) && (false === setParentNode)){
				continue;
			}

			var subNodeName = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var subNode = instruction[c.SchemaStaticDataCalculate.sDataNode];
			instruction[c.SchemaStaticDataCalculate.sDataNode] = undefined;
			if (undefined === subNode){
				throw new Error ("RemoveNodeMapLinksParent node not found:" + subNodeName + " for node:" + nodeName + " subIndex:" + subIndex + " instruction:" + JSON.stringify(instruction));
			}

			if (true === getParentNode){
				c.DagNodeCollectionHelper.SetNodesUnlinked(subNode, node);
			}
			if (true === setParentNode){
				c.DagNodeCollectionHelper.SetNodesUnlinked(node, subNode);
			}
		}
	}

	//c.Log(LOG, "DagNodeCollectionHelper.RemoveNodeMapLinksParent end");

	return;
}

/**
 * itterate over the array of calculate nodes to find push_node instructions and add a node link
 * @param {!Object<string,!(c.DagNodeCalculate|c.DagNodeValue)>} in_mapNameNode
 * @return {undefined}
 */
c.DagNodeCollectionHelper.AddNodeMapLinks = function(in_mapNameNode) {
	//c.Log(LOG, "DagNodeCollectionHelper.AddNodeMapLinks start");
	//c.Log(LOG, "DagNodeCollection.AddNodeMapLinks start in_mapNameNode:" + JSON.stringify(in_mapNameNode));
	//c.Log(LOG, "DagNodeCollection.AddNodeMapLinks start in_arrayCalculateNode:" + JSON.stringify(in_arrayCalculateNode));

	for (var nodeName in in_mapNameNode) {
		if (false === in_mapNameNode.hasOwnProperty(nodeName)) {
			continue;
		}
		var node = in_mapNameNode[nodeName];

		var instructionArray = node.GetInstructionArray();
		if (instructionArray === undefined){
			continue;
		}

		for (var subIndex = 0, subLen = instructionArray.length; subIndex < subLen; subIndex++) {
			var instruction = instructionArray[subIndex];
			var operation = instruction[c.SchemaStaticDataCalculate.sDataOperation];
			var getNode = c.SchemaStaticDataCalculate.Operation.eGetNode === operation;
			var setNode = c.SchemaStaticDataCalculate.Operation.eSetNode === operation;
			if ((false === getNode) && (false === setNode)){
				continue;
			}


			var subNodeName = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var subNode = in_mapNameNode[subNodeName];
			if (undefined === subNode){
				var nodeKeysString = (in_mapNameNode != null) ? JSON.stringify(Object.keys(in_mapNameNode)) : "undefined";
				throw new Error ("AddNodeMapLinks node not found:" + subNodeName + " for node:" + nodeName + " subIndex:" + subIndex + " instruction:" + JSON.stringify(instruction) + " nodeKeysString:" + nodeKeysString);
			}

			instruction[c.SchemaStaticDataCalculate.sDataNode] = subNode;
			if (true === getNode){
				c.DagNodeCollectionHelper.SetNodesLinked(subNode, node);
			}
			if (true === setNode){
				if (false === (subNode instanceof c.DagNodeValue)){
					throw new Error ("AddNodeMapLinks node incorrect type for setNode:" + subNodeName + " link from:" + nodeName);
				}
				c.DagNodeCollectionHelper.SetNodesLinked(node, subNode);
			}
		}
	}

	//c.Log(LOG, "DagNodeCollectionHelper.AddNodeMapLinks end");

	return;
}

/**
the instruction 'setNode' makes it possible for the output to be a value
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_input
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_output
 * @return {undefined}
 */
c.DagNodeCollectionHelper.SetNodesLinked = function(in_input, in_output) {
	if(null == in_input) {
		c.Log(LOG, "c.DagNodeCollection.SetNodesLinked in_input:" + in_input);
		return;
	}
	if(null == in_output) {
		c.Log(LOG, "c.DagNodeCollection.SetNodesLinked in_output:" + in_output);
		return;
	}

	in_input.AddOutput(in_output);
	in_output.SetDirty();
	return;
}

/**
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_input
 * @param {!(c.DagNodeCalculate|c.DagNodeValue)} in_output
 * @return {undefined}
 */
c.DagNodeCollectionHelper.SetNodesUnlinked = function(in_input, in_output) {
	in_input.RemoveOutput(in_output);
	in_output.SetDirty();
	return;
}

