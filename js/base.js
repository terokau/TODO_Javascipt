var tasks=[];
var tmpID = 0;

clearTaskLists(false);

//Time
var secondTimer = setInterval(updateTime,1000);
updateTime(); //To set in on load
function updateTime(){
	var timeStr = moment().format('MMMM Do YYYY, HH:mm:ss');
	$("#setTime").text(timeStr);
	//console.log("Tic toc");
}

$(document).on('click', ".todoObj", function() {
    //alert("Hello: " + $(this).attr('id'));    
    updateStatus($(this).attr('id'));   
});

//Add new tas

$("#addNewTask").click(function(){
	var newTask = new Task(tmpID,$("#setTaskName").val(),$("#setProprty").val(),$("#setInfo").val(),1);
	tmpID++;
	tasks.push(newTask);
	clearTaskLists(false);
	generateTodos();
});


//Support functions

function generateTodos(){
	
	tasks.forEach(element=>{
		//console.log(element.name);
		switch(element.status){
			case 1:
				$("#plannedTasksList").append(element.TaskObject);
				break;

			case 2:
				$("#workingTasksList").append(element.TaskObject);
				break;

			case 3:
				$("#doneTasksList").append(element.TaskObject);
				break;

			default:
				console.log("Horror happened on generating objects");
				break;
		}
		
	});

}

function clearTaskLists(setDelete){
	if(setDelete==false){
		$("#plannedTasksList").text("");
		$("#workingTasksList").text("");
		$("#doneTasksList").text("");
	}
}


function updateStatus(id){
	var gettmpId = id.split("_");
	var getID = parseInt(gettmpId[1],10);
	console.log("ID is:" + getID);

	var tmpIndex = tasks.findIndex(inst => inst.id==getID );
	console.log(tmpIndex);
	var tmpObj = tasks[tmpIndex];
	tmpObj.status = tmpObj.status+1;
	if(tmpObj.status>3){
		tasks.splice(tmpIndex,1);
	}else{
		tasks[tmpIndex] = tmpObj;	
	}
	
	clearTaskLists(false);
	generateTodos();
}