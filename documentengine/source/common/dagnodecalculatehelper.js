goog.forwardDeclare("c.Document");


/*
*/
c.DagNodeCalculateHelper = {};

/*
	//this.m_displayValue = c.DocumentManagerLocaleHelper.MakeDisplayValue(this.m_value, this.m_type, in_units, this.m_dimention, this.m_isLocale, this.m_staticData);
	//SetToolTip, SetDisplayValue
	this.m_value = c.DagNodeCalculateHelper.CalculateValue(
		this,
		this.m_calculationStack,
		this.m_tooltipStack,
		this.m_instructionArray,
		this.m_staticData,
		this.m_instuctionContext,
		in_units,
		this.m_dimention,
		this.m_tooltipStop
		);

*/
/**
 * @param {!c.DagNodeCalculate} in_node
 * @param {!Array<?>} in_calculationStack
 * @param {!Array<?>} in_tooltipStack
 * @param {!Array<{op:number,value,node:(!c.DagNodeCalculate|c.DagNodeValue)}>} in_instructionArray
 * @param {!Object} in_staticData
 * @param {!Object<string,function(...):*>} in_instuctionContext
 * @param {!string} in_type
 * @param {!string} in_units
 * @param {!string|undefined} in_dimention
 * @param {!boolean} in_isLocale
 * @param {!boolean} in_tooltipStop
 * @return {!*}
 */
c.DagNodeCalculateHelper.CalculateValue = function(in_node, in_calculationStack, in_tooltipStack, in_instructionArray, in_staticData, in_instuctionContext, in_type, in_units, in_dimention, in_isLocale, in_tooltipStop){
	const in_name = in_node.GetName();
	c.Log(STACK, "DagNodeCalculateHelper.CalculateValue name:" + in_name);

	in_calculationStack.length = 0;
	in_tooltipStack.length = 0;
	var keepGoing = true;
	for (var index = 0, len = in_instructionArray.length; ((index < len) && (keepGoing === true)); index++) {
		var instruction = in_instructionArray[index];

		if (instruction == null){
			throw new Error ("null instruction at:" + index);
		}

		//c.Log(LOG, " name:" + in_name + " index:" + index + " instruction.op:" + instruction["op"] + " instruction.value:" + instruction["value"] + " node:" + instruction["node"]);
		// warning, JSON.stringify(in_calculationStack) this will barf if we have a document with a circular ref (like the parent link)
		//c.Log(LOG, " calculationStack:" + JSON.stringify(in_calculationStack));
		//c.Log(LOG, " calculationStack.length:" + in_calculationStack.length);

		/** @const */
		var operation = instruction[c.SchemaStaticDataCalculate.sDataOperation];
		switch (operation)
		{
		default:
			throw new Error ("invalid instruction at:" + index + " operation:" + operation);

		case c.SchemaStaticDataCalculate.Operation.ePushConst:
			var value = instruction[c.SchemaStaticDataCalculate.sDataValue];
			in_calculationStack.push(value);

			if (false === in_tooltipStop){
				var dimention = instruction[c.SchemaStaticDataCalculate.sDimension];
				var isLocale = instruction[c.SchemaStaticDataCalculate.sIsLocale];
				if (undefined === isLocale){
					isLocale = false;
				}
				var displayValue = c.DocumentManagerLocaleHelper.MakeDisplayValue(value, undefined, in_units, in_dimention, isLocale, in_staticData);
				//c.Log(LOG, "DagNodeCalculateHelper.ePushConst value:" + value + " displayValue:" + displayValue + " isLocale:" + isLocale);

				in_tooltipStack.push(displayValue);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eGetStaticDataObject:
			var path = in_calculationStack.pop();
			//console.log("GetStaticDataObject path:" + JSON.stringify(path));
			var result = c.PathObjectGet(in_staticData, path);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var pathArray = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("get_static_data_object", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", pathArray);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eGetNode:
		case c.SchemaStaticDataCalculate.Operation.eGetParentNode:
			/** type {!c.DagNodeValue|!c.DagNodeCalculate} */
			var node = instruction[c.SchemaStaticDataCalculate.sDataNode];
			var value = node.GetValue();
			in_calculationStack.push(value);
			//c.Log(LOG, "node:" + node);
			//c.Log(LOG, "value:" + value);

			if (false === in_tooltipStop){
				var innerArray = [node.GetLocaleName() + "("];
				var tooltip = { "text" : node.GetDisplayValue(in_units)};
				var tooltipInner = node.GetToolTip(in_units);
				if (tooltipInner !== undefined){
					tooltip["tooltip"] = tooltipInner;
				}
				c.DocumentManagerLocaleHelper.PushAddString(innerArray, tooltip);
				c.DocumentManagerLocaleHelper.PushAddString(innerArray, ")");
				in_tooltipStack.push(innerArray);
			}

			break;
		case c.SchemaStaticDataCalculate.Operation.eSetNode:
		case c.SchemaStaticDataCalculate.Operation.eSetParentNode:
			var value = in_calculationStack.pop();
			/** type {!c.DagNodeValue|!c.DagNodeCalculate} */
			var node = instruction[c.SchemaStaticDataCalculate.sDataNode];
			node.SetValue(value);

			if (false === in_tooltipStop){
				in_tooltipStack.pop();
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eGetDocumentValue:
			/** type {!string} */
			var valueName = in_calculationStack.pop();
			//c.Log(DEBUG, "valueName:" + valueName);
			if (false == ((typeof valueName === "string" || valueName instanceof String))){
				throw new Error ("GetDocumentValue valueName not string:" + (typeof valueName));
			};

			var value = undefined;

			/** type {!c.Document} */
			var document = in_calculationStack.pop();
			if (document !== undefined){
				//c.Log(DEBUG, "document:" + document);
				var testB = (document instanceof c.Document);
				const typeTestA = "c.Document";
				const typeTestB = (typeof document);
				var testA = (typeTestA === typeTestB);
				if (false == (testA || testB)){
					throw new Error ("GetDocumentValue document not document:" + (typeof document));
				};

				value = document.GetValue(valueName);
			}

			in_calculationStack.push(value);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop(); //valueName
				var param1 = in_tooltipStack.pop(); //document

				if (value === undefined){
					in_tooltipStack.push("");
				} else {
					var displayName = (document !== undefined) ? document.GetLocaleName(valueName) : undefined;
					var displayValue = (document !== undefined) ? document.GetDisplayValue(valueName, in_units) : undefined;
					//c.Log(LOG, "eGetDocumentValue valueName:" + valueName + " displayValue:" + displayValue);
					var tooltip = (document !== undefined) ? document.GetTooltip(valueName, in_units) : undefined;
					in_tooltipStack.push(tooltip);
				}
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eSetDocumentValue:
			var value = in_calculationStack.pop();
			/** type {!string} */
			var valueName = in_calculationStack.pop();
			/** type {!c.Document} */
			var document = in_calculationStack.pop();
			if (document !== undefined){
				document.SetValue(valueName, value);
			}

			if (false === in_tooltipStop){
				in_tooltipStack.pop();
				in_tooltipStack.pop();
				in_tooltipStack.pop();
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eGetArrayValue:
			var subIndex = in_calculationStack.pop();
			var array = in_calculationStack.pop();
			var result = undefined;
			//console.log("eGetArrayValue subIndex:" + subIndex + " array:" + array);
			if ((subIndex !== undefined) && (array !== undefined) && (array.length !== undefined) && (0 <= subIndex) && (subIndex < array.length)){
				result = array[subIndex];
			}
			//console.log(" result:" + result);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				in_tooltipStack.pop();
				in_tooltipStack.pop();
				in_tooltipStack.push((result !== undefined) ? result.toString() : "");
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eSetArrayValue:
			var subIndex = in_calculationStack.pop();
			var value = in_calculationStack.pop();
			var array = in_calculationStack.pop();
			if ((subIndex !== undefined) && (array !== undefined) && (array.length !== undefined) && (0 <= subIndex) && (subIndex < array.length)){
				array[index] = value;
			}
			in_calculationStack.push(array);

			if (false === in_tooltipStop){
				in_tooltipStack.pop();
				in_tooltipStack.pop();
				in_tooltipStack.pop();
				in_tooltipStack.push("");
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eGetDocumentArrayValue:
			//console.log("GetDocumentArrayValue name:" + in_name);

			/** type {!string} */
			var valueName = in_calculationStack.pop();
			//console.log(" valueName:" + valueName);
			//c.Log(DEBUG, "valueName:" + valueName);
			if (false == ((typeof valueName === "string" || valueName instanceof String))){
				throw new Error ("GetDocumentArrayValue valueName not string:" + (typeof valueName));
			};

			/** type {!Array<!c.Document>} */
			var valueArray = [];

			var documentArray = in_calculationStack.pop();
			//console.log(" documentArray:" + documentArray + " type:" + typeof(documentArray) + " IsArray:" + c.IsArray(documentArray));
			if (false === c.IsArray(documentArray)){
				throw new Error ("GetDocumentArrayValue documentArray not array:" + (typeof documentArray));
			}

			for (var subIndex = 0, subTotal = documentArray.length; subIndex < subTotal; subIndex++) {
				var document = /** type {!c.Document} */(documentArray[subIndex]);
				if (document === undefined){
					continue;
				}
				var value = document.GetValue(valueName);
				if (value !== undefined){ //allow undefined members to not be added to result array? use case, make working with results easier (equipment array without all types having absorption)
					valueArray.push(value);
				}
			}

			in_calculationStack.push(valueArray);
			//console.log(" valueArray:" + valueArray);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop(); //valueName
				var param1 = in_tooltipStack.pop(); //documentArray

				var innerArray = [];
				var trace = 0;
				for (var subIndex = 0, subTotal = documentArray.length; subIndex < subTotal; subIndex++) {
					var document = /** type {!c.Document} */(documentArray[subIndex]);
					if (document === undefined){
						continue;
					}
					var value = document.GetValue(valueName);
					if (value === undefined){
						continue;
					}
					if (trace != 0){
						c.DocumentManagerLocaleHelper.PushAddString(innerArray, ", ");
					}
					trace += 1;
					var displayName = document.GetLocaleName(valueName);
					var tooltip = document.GetTooltip(valueName, in_units);

					c.DocumentManagerLocaleHelper.PushAddString(innerArray, displayName + "(");
					//console.log("eGetDocumentArrayValue tooltip:" + JSON.stringify(tooltip) + " value:" + value + " valueName:" + valueName);
					c.DocumentManagerLocaleHelper.PushAddString(innerArray, tooltip);
					c.DocumentManagerLocaleHelper.PushAddString(innerArray, ")");
				}

				in_tooltipStack.push(innerArray);
			}

			break;

		//pop value name array, pop document, push value array. get a array of values from a document
		case c.SchemaStaticDataCalculate.Operation.eGetDocumentValueArray:
			//console.log("GetDocumentValueArray name:" + in_name);

			/** type {!Array<!string>} */
			var valueNameArray = in_calculationStack.pop();
			//c.Log(DEBUG, "valueName:" + valueName);
			if (false === c.IsArray(valueNameArray)){
				throw new Error ("GetDocumentValueArray valueNameArray not array:" + (typeof valueNameArray));
			}

			/** type {!c.Document} */
			var document = in_calculationStack.pop();

			var valueArray = [];
			for (var subIndex = 0, subTotal = valueNameArray.length; subIndex < subTotal; subIndex++) {
				var valueName = /** type {!string} */(valueNameArray[subIndex]);
				var value = document.GetValue(valueName);
				if (value !== undefined){ //allow undefined members to not be added to result array? use case, make working with results easier (equipment array without all types having absorption)
					valueArray.push(value);
				}
			}

			in_calculationStack.push(valueArray);
			//console.log(" valueArray:" + valueArray);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop(); //valueNameArray
				var param1 = in_tooltipStack.pop(); //document

				var innerArray = [];
				var trace = 0;
				for (var subIndex = 0, subTotal = valueNameArray.length; subIndex < subTotal; subIndex++) {
					var valueName = /** type {!string} */(valueNameArray[subIndex]);
					var value = document.GetValue(valueName);
					if (value === undefined){
						continue;
					}
					if (trace != 0){
						c.DocumentManagerLocaleHelper.PushAddString(innerArray, ", ");
					}
					trace += 1;

					var displayName = document.GetLocaleName(valueName);
					var tooltip = document.GetTooltip(valueName, in_units);

					c.DocumentManagerLocaleHelper.PushAddString(innerArray, displayName + "(");
					c.DocumentManagerLocaleHelper.PushAddString(innerArray, tooltip);
					c.DocumentManagerLocaleHelper.PushAddString(innerArray, ")");
				}

				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eGetObjectValue:
			var key = in_calculationStack.pop();
			var value = in_calculationStack.pop();
			var result = undefined;
			if (value !== undefined){
				result = value[key];
			}
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop(); //key
				var param1 = in_tooltipStack.pop(); //value
				var innerArray = ["("];
				c.DocumentManagerLocaleHelper.PushAddString(innerArray, param1);
				c.DocumentManagerLocaleHelper.PushAddString(innerArray, ").");
				c.DocumentManagerLocaleHelper.PushAddString(innerArray, param0);
				in_tooltipStack.push(innerArray);
			}

			break;
		case c.SchemaStaticDataCalculate.Operation.eSetObjectValue:
			var key = in_calculationStack.pop();
			var value = in_calculationStack.pop();
			var result = in_calculationStack.pop();
			if (result !== undefined){
				result[key] = value;
			}
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				in_tooltipStack.pop();
				in_tooltipStack.pop();
				in_tooltipStack.pop();
				in_tooltipStack.push("");
			}

			break;
		case c.SchemaStaticDataCalculate.Operation.eObjectHasKey:
			var key = in_calculationStack.pop();
			var value = in_calculationStack.pop();
			var result = false;
			if (value !== undefined){
				result = (key in value);
			}
			in_calculationStack.push(result);
			break;
		case c.SchemaStaticDataCalculate.Operation.eObjectAddKey:
			var key = in_calculationStack.pop();
			var result = in_calculationStack.pop();
			result[key] = 0;
			in_calculationStack.push(result);
			break;
		case c.SchemaStaticDataCalculate.Operation.eObjectRemoveKey:
			var key = in_calculationStack.pop();
			var result = in_calculationStack.pop();
			delete result[key];
			in_calculationStack.push(result);
			break;
		case c.SchemaStaticDataCalculate.Operation.eObjectToStack:
			var value = in_calculationStack.pop();
			for (var prop in value){
				if (value.hasOwnProperty(prop)){
					in_calculationStack.push(value[prop]);
					in_calculationStack.push(prop);
				}
			}
			break;
		case c.SchemaStaticDataCalculate.Operation.eStackToObject:
			//console.log("eStackToObject in_calculationStack:" + JSON.stringify(in_calculationStack));
			var result = {};
			while(1 < in_calculationStack.length) {
				var keything = in_calculationStack.pop();
				var value = in_calculationStack.pop();
				result[keything] = value;
				//console.log(" working result:" + JSON.stringify(result));
			}
			in_calculationStack.push(result);
			//console.log(" result:" + JSON.stringify(result));
			break;

		case c.SchemaStaticDataCalculate.Operation.eIf:
			var condition = in_calculationStack.pop();
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			in_calculationStack.push(condition ? valueA : valueB);

			/* longhand
			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var param2 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("if", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", param2);
				in_tooltipStack.push(innerArray);
			}
			shorthand */
			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var param2 = in_tooltipStack.pop();
				in_tooltipStack.push(condition ? param1 : param2);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eTestUndefined:
			var value = in_calculationStack.pop();
			var result = (value === undefined);
			in_calculationStack.push(result);
			//console.log("eTestUndefined result:" + result + " value:" + value + " " + JSON.stringify(value)); 

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("test_undefined", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", result);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eReplaceUndefined: //"replaceundefined", //popA, popB, if B undefined, push A, else push B
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			if (valueB !== undefined){
				in_calculationStack.push(valueB);
			} else {
				in_calculationStack.push(valueA);
			}

			/* longhand
			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("replace_undefined", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				in_tooltipStack.push(innerArray);
			}
			shorthand */
			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				if (valueB !== undefined){
					in_tooltipStack.push(param1);
				} else {
					in_tooltipStack.push(param0);
				}
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eEqual:
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			var result = (valueA == valueB);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("equal", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", result);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eLessEqual:
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			var result = (valueA <= valueB);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("lessequal", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", result);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eLess:
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			var result = (valueA < valueB);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("less", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", result);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eAnd:
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			var result = (valueA && valueB);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("and", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eOr:
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			var result = (valueA || valueB);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("or", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eXor:
			var valueA = in_calculationStack.pop();
			var valueB = in_calculationStack.pop();
			var result = (valueA !== valueB);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var param1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("xor", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", param1);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eNot:
			var valueA = in_calculationStack.pop();
			var result = (!valueA);
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				var param0 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData("not", in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", param0);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eArrayToStack:
			var value = in_calculationStack.pop();

			if (value !== undefined){
				//while(0 < value.length) {
				//	in_calculationStack.push(value.pop());
				//}
				// if value is static data, we should treat it as imutable (pop is NOT imutable)
				for (var subIndex = 0, subTotal = value.length; subIndex < subTotal; subIndex++) {
					var item = value[value.length - 1 - subIndex];
					in_calculationStack.push(item);
				}
			}

			if (false === in_tooltipStop){
				in_tooltipStack.pop();
				//if (false === in_tooltipStop){
				//	in_tooltipStack.push(item.toString());
				//}
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eArrayOfArrayToStack:
			var value = in_calculationStack.pop();
			if (value !== undefined){
				for (var subIndex = 0, subTotal = value.length; subIndex < subTotal; subIndex++) {

					var subValue = value[value.length - 1 - subIndex];
					if (subValue === undefined){
						continue;
					}
					for (var subSubIndex = 0, subSubTotal = subValue.length; subSubIndex < subSubTotal; subSubIndex++) {
						var item = subValue[subValue.length - 1 - subSubIndex];
						if (item === undefined){
							continue;
						}
						in_calculationStack.push(item);
					}
				}
			}

			if (false === in_tooltipStop){
				var tooltipValue = in_tooltipStack.pop();
				if (tooltipValue !== undefined){
					for (var subIndex = 0, subTotal = tooltipValue.length; subIndex < subTotal; subIndex++) {

						var subValue = tooltipValue[tooltipValue.length - 1 - subIndex];
						if (subValue === undefined){
							continue;
						}
						for (var subSubIndex = 0, subSubTotal = subValue.length; subSubIndex < subSubTotal; subSubIndex++) {
							var item = subValue[subValue.length - 1 - subSubIndex];
							if (item === undefined){
								continue;
							}
							in_tooltipStack.push(item);
						}
					}
				}
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eStackToArray:
			var value = [];
			while(0 < in_calculationStack.length) {
				value.push(in_calculationStack.pop());
			}
			in_calculationStack.push(value);

			if (false === in_tooltipStop){
				var tooltipValue = [];
				while(0 < in_tooltipStack.length) {
					tooltipValue.push(in_tooltipStack.pop());
				}
				in_tooltipStack.push(tooltipValue);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eStackAllTrue:
			var result = true;
			while(0 < in_calculationStack.length) {
				var item = in_calculationStack.pop();
				result = (result && item);
			}
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				//todo?
				in_tooltipStack.length = 0;
				in_tooltipStack.push(value);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eStackAnyTrue:
			var result = false;
			while(0 < in_calculationStack.length) {
				var item = in_calculationStack.pop();
				if (true === item){
					result = true;
					in_calculationStack.length = 0;
					break;
				}
			}
			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				//todo?
				in_tooltipStack.length = 0;
				in_tooltipStack.push(value);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eArrayToMap:
			var value = in_calculationStack.pop();
			var result = {};
			if (value !== undefined){
				for (var subIndex = 0, subTotal = value.length; subIndex < subTotal; subIndex++) {
					var subValue = value[subIndex];
					result[subValue] = 0
				}
			}

			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				//todo?
				in_tooltipStack.length = 0;
				in_tooltipStack.push(result);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eMapToArray:
			var value = in_calculationStack.pop();
			var result = [];
			if (value !== undefined){
				for (var key in value) {
					if (false === value.hasOwnProperty(key)) {
						continue;
					}
					result.push(key);
				}
			}

			in_calculationStack.push(result);

			if (false === in_tooltipStop){
				//todo?
				in_tooltipStack.pop();
				in_tooltipStack.push(result);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eF0:
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction();
			} else {
				throw new Error ("F0 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var tooltipString = c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData);
				in_tooltipStack.push(tooltipString);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eF1:
			var param0 = in_calculationStack.pop();
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction(param0);
			} else {
				throw new Error ("F1 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var toolparam0 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", toolparam0);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eF2:
			var param0 = in_calculationStack.pop();
			var param1 = in_calculationStack.pop();
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction(param0, param1);
			} else {
				throw new Error ("F2 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var toolparam0 = in_tooltipStack.pop();
				var toolparam1 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", toolparam0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", toolparam1);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eF3:
			var param0 = in_calculationStack.pop();
			var param1 = in_calculationStack.pop();
			var param2 = in_calculationStack.pop();
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction(param0, param1, param2);
			} else {
				throw new Error ("F3 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var toolparam0 = in_tooltipStack.pop();
				var toolparam1 = in_tooltipStack.pop();
				var toolparam2 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", toolparam0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", toolparam1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", toolparam2);
				in_tooltipStack.push(innerArray);
			}

			break;

		case c.SchemaStaticDataCalculate.Operation.eF4:
			var param0 = in_calculationStack.pop();
			var param1 = in_calculationStack.pop();
			var param2 = in_calculationStack.pop();
			var param3 = in_calculationStack.pop();
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction(param0, param1, param2, param3);
			} else {
				throw new Error ("F4 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var toolparam0 = in_tooltipStack.pop();
				var toolparam1 = in_tooltipStack.pop();
				var toolparam2 = in_tooltipStack.pop();
				var toolparam3 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", toolparam0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", toolparam1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", toolparam2);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__D__", toolparam3);
				in_tooltipStack.push(innerArray);
			}

			break;
		case c.SchemaStaticDataCalculate.Operation.eF5:
			var param0 = in_calculationStack.pop();
			var param1 = in_calculationStack.pop();
			var param2 = in_calculationStack.pop();
			var param3 = in_calculationStack.pop();
			var param4 = in_calculationStack.pop();
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction(param0, param1, param2, param3, param4);
			} else {
				throw new Error ("F5 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var toolparam0 = in_tooltipStack.pop();
				var toolparam1 = in_tooltipStack.pop();
				var toolparam2 = in_tooltipStack.pop();
				var toolparam3 = in_tooltipStack.pop();
				var toolparam4 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", toolparam0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", toolparam1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", toolparam2);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__D__", toolparam3);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__E__", toolparam4);
				in_tooltipStack.push(innerArray);
			}

			break;
		case c.SchemaStaticDataCalculate.Operation.eF6:
			var param0 = in_calculationStack.pop();
			var param1 = in_calculationStack.pop();
			var param2 = in_calculationStack.pop();
			var param3 = in_calculationStack.pop();
			var param4 = in_calculationStack.pop();
			var param5 = in_calculationStack.pop();
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction(param0, param1, param2, param3, param4, param5);
			} else {
				throw new Error ("F6 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var toolparam0 = in_tooltipStack.pop();
				var toolparam1 = in_tooltipStack.pop();
				var toolparam2 = in_tooltipStack.pop();
				var toolparam3 = in_tooltipStack.pop();
				var toolparam4 = in_tooltipStack.pop();
				var toolparam5 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", toolparam0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", toolparam1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", toolparam2);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__D__", toolparam3);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__E__", toolparam4);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__F__", toolparam5);
				in_tooltipStack.push(innerArray);
			}

			break;
		case c.SchemaStaticDataCalculate.Operation.eF7:
			var param0 = in_calculationStack.pop();
			var param1 = in_calculationStack.pop();
			var param2 = in_calculationStack.pop();
			var param3 = in_calculationStack.pop();
			var param4 = in_calculationStack.pop();
			var param5 = in_calculationStack.pop();
			var param6 = in_calculationStack.pop();
			var key = instruction[c.SchemaStaticDataCalculate.sDataValue];
			var contextFunction = in_instuctionContext[key];
			var value = undefined;
			if (contextFunction !== undefined){
				value = contextFunction(param0, param1, param2, param3, param4, param5, param6);
			} else {
				throw new Error ("F7 method not found:" + key + " in CalculateValue name:" + in_name);
			}
			in_calculationStack.push(value);

			if(false === in_tooltipStop){
				var toolparam0 = in_tooltipStack.pop();
				var toolparam1 = in_tooltipStack.pop();
				var toolparam2 = in_tooltipStack.pop();
				var toolparam3 = in_tooltipStack.pop();
				var toolparam4 = in_tooltipStack.pop();
				var toolparam5 = in_tooltipStack.pop();
				var toolparam6 = in_tooltipStack.pop();
				var innerArray = [c.DocumentManagerLocaleHelper.GetLocaleData(key, in_staticData)];
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__A__", toolparam0);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__B__", toolparam1);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__C__", toolparam2);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__D__", toolparam3);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__E__", toolparam4);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__F__", toolparam5);
				innerArray = c.DocumentManagerLocaleHelper.SubstituteArrayString(innerArray, "__G__", toolparam6);
				in_tooltipStack.push(innerArray);
			}

			break;
		}
	}
	if (in_calculationStack.length <= 0) {
		throw new Error("invalid calculation stack:" + in_calculationStack.length + " " + JSON.stringify(in_calculationStack));
	}
	var result = in_calculationStack.pop();

	var displayValue = c.DocumentManagerLocaleHelper.MakeDisplayValue(result, in_type, in_units, in_dimention, in_isLocale, in_staticData);
	in_node.SetDisplayValueInternal(displayValue);

	if (false === in_tooltipStop){
		var tooltip = [in_node.GetLocaleName() + "(" + displayValue + ") = "];
		if (in_tooltipStack.length <= 0) {
			throw new Error("invalid tooltip stack:" + in_tooltipStack.length + " " + JSON.stringify(in_tooltipStack));
		}
		var tooltipResult = in_tooltipStack.pop();
	
		c.DocumentManagerLocaleHelper.PushAddString(tooltip, tooltipResult);
		in_node.SetToolTipInternal(tooltip);
	}

	return result;
}
