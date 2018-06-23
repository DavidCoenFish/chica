/*
	schema is a contract with the static data

staticData = {
	"data" {
		"typea" : {
			"members" : {
				"memberkey0" : {
					"type" : "bool",
					"defaultvaluebool" : true
				},
				"memberkey1" : {
					"type" : "string"
				}
			},
			"rules" : {
				"rulekey" : {
					"calculate0" : {
						"data" : [
							{"op":"pushconst", "value":5},
						]
					},
					"calculate1" : {
						"data" : []
					}
				}
			}
		}
	},
	"documenttypes" : {
		"typea" : {
			"value" : ["data", "typea", "members"],
			"calculate" : ["data", "typea", "rules"]
		}
	},
	"units": {
		"metric": {
			"mass": {
				"convert": 1,
				"length": 0,
				"name0": "kg"
			},
		},
	},
}

*/
c.SchemaStaticData = {};
c.SchemaStaticData.sDocumentTypes = "documenttypes"; //value : string
c.SchemaStaticData.sDocumentTypesValue = "value"; //metadata, value : array strings
c.SchemaStaticData.sDocumentTypesCalculate = "calculate"; //rule, value : array strings

c.SchemaStaticData.sLocale = "locale";
c.SchemaStaticData.sData = "data";
c.SchemaStaticData.sDataUnits = "units";

