/*
*/

c.MissionContext = {}
//c["MissionContext"] = c.MissionContext;

c.MissionContext.StepMap = {
	"mission_step_reward" : {
		"onActivation" : c.MissionContext.RewardOnActivation,
		"onInput" : c.MissionContext.RewardOnInput,
	},
	"mission_step_dialog_tree" : {
		"onActivation" : c.MissionContext.DialogTreeOnActivation,
		"onInput" : c.MissionContext.DialogTreeOnInput,
	},
	"mission_step_competing_attribute_roll" : {
		"onActivation" : c.MissionContext.CompetingAttributeRollOnActivation,
		"onInput" : c.MissionContext.CompetingAttributeRollOnInput,
	},
};

/*
we take in the mission data document, and the mission instance document
we possibly advance mission instance based on owner input (result of dialog input)
we either return nothing (if no permission), info for dialog to show owner, info on mission completion (also dialog info?)

we can run the step
we can change the step
we can return the current display for the step
*/
c.MissionContext.Run = function(in_missionDocument, in_inputOwnerOrUndefined, in_inputOrUndefined){
	const missionData = in_missionDocument.GetValue("data");
	const missionInstance = in_missionDocument.GetValue("instance");

	var finished = missionInstance.GetValue("finished");
	if (finished === true){
		return;
	}

	// no step yet? kick it off
	var stepID = missionInstance.GetValue("step_id");
	if (stepID === undefined){
		const defaultStep = missionData.GetValue("entry_step_id");
		c.MissionContext.GotoStep(missionData, missionInstance, defaultStep);

		finished = missionInstance.GetValue("finished");
		if (finished === true){
			return;
		}

		stepID = missionInstance.GetValue("step_id");
	}

	//var stepData = in_missionInstanceDocument.GetValue("step_data");
	var stepMap = missionData.GetValue("steps");
	if (stepID in stepMap){
		var step = stepMap[stepID];
		var type = step.GetType();
		if (type in c.MissionContext.StepMap){
			var stepMethods = c.MissionContext.StepMap[type];
			stepMethods["onInput"](missionData, missionInstance, in_inputOwnerOrUndefined, in_inputOrUndefined);
		}
	}

	return;
}

c.MissionContext.ReturnError = function(in_title, in_text){
	return {
		"dialog" : {
			"contents" : [
				{
					"title" : in_title,
					"text" : in_text
				}
			]
		},
		"finished" : false
	};
}

c.MissionContext.GotoStep = function(in_missionDataDocument, in_missionInstanceDocument, in_stepID){
	var stepMap = in_missionDataDocument.GetValue("steps");
	if (in_stepID in stepMap){
		var step = stepMap[stepID];
		var type = step.GetType();
		if (type in c.MissionContext.StepMap){
			var stepMethods = c.MissionContext.StepMap[type];
			stepMethods["onActivation"](in_missionDataDocument, in_missionInstanceDocument, step);
			in_missionInstanceDocument.SetValue("step_id", in_stepID);
			return;
		}
	}
	//step not found?
	in_missionInstanceDocument.SetValue("finished", true);
	return;
}

c.MissionContext.RewardOnActivation = function(in_missionDataDocument, in_missionInstanceDocument, in_stepDataDocument){
}

c.MissionContext.RewardOnInput = function(in_missionDataDocument, in_missionInstanceDocument, in_owner, in_ownerInputOrUndefined){
	//wait for each each agent to have a owner click ok?
}

c.MissionContext.RewardRender = function(in_missionDataDocument, in_missionInstanceDocument){
	//if the owner has any characters that got a reward, plus the waiting count if we are waiting
}

c.MissionContext.DialogTreeOnActivation = function(in_missionDataDocument, in_missionInstanceDocument, in_stepDataDocument){
}

c.MissionContext.DialogTreeOnInput = function(in_missionDataDocument, in_missionInstanceDocument, in_owner, in_ownerInputOrUndefined){
}

c.MissionContext.DialogTreeRender = function(in_missionDataDocument, in_missionInstanceDocument){
}

c.MissionContext.CompetingAttributeRollOnActivation = function(in_missionDataDocument, in_missionInstanceDocument, in_stepDataDocument){
}

c.MissionContext.CompetingAttributeRollOnInput = function(in_missionDataDocument, in_missionInstanceDocument, in_owner, in_ownerInputOrUndefined){
}

c.MissionContext.CompetingAttributeRollRender = function(in_missionDataDocument, in_missionInstanceDocument){
}

