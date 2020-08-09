var tasks=[];
var tmpID = 0;
var openID = 0;

var modalNumOpen = -1;

clearTaskLists(false);

//Time
var secondTimer = setInterval(updateTime,1000);
updateTime(); //To set in on load
function updateTime(){
	var timeStr = moment().format('MMMM Do YYYY, HH:mm:ss');
	$("#setTime").text(timeStr);
	//console.log("Tic toc");
}

//<<--------------------------------------------------------------------------------------->>//
//												Actions
//<<--------------------------------------------------------------------------------------->>//

//Todo object clikc to open edit panel
$(document).on('click', ".todoObj", function() {
    //alert("Hello: " + $(this).attr('id'));   
   
    var gettmpId = $(this).attr('id').split("_");
	var getID = parseInt(gettmpId[1],10);
	console.log("ID is:" + getID);

	openID = tasks.findIndex(inst => inst.id==getID ); 
	$('#editModal').modal('show');	
    
});

//add new task
$(document).on('click', "#showAddModal",function(){
	console.log("showAddModal");

	$('#addNewTaskModal').modal('show');
	$('#setTaskName').focus();
});

$(document).on('click', "#setMoveNextStep",function(){
	updateStatus();
});

//Add new task

$("#addNewTask").click(function(){
	addTask();
});

//<<--------------------------------------------------------------------------------------->>//
//												Support functions
//<<--------------------------------------------------------------------------------------->>//

function addTask(){
	var newTask = new Task(tmpID,$("#setTaskName").val(),$("#setProprty").val(),$("#setInfo").val(),1);
	tmpID++;
	tasks.push(newTask);
	$('#addNewTaskModal').modal('hide');
	$("#setTaskName").val('');
	$("#setInfo").val('');
	generateTodos(false);
};

function generateTodos(setDelete){

	clearTaskLists(setDelete);
	
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
	}else{
		tasks = [];
		$("#plannedTasksList").text("");
		$("#workingTasksList").text("");
		$("#doneTasksList").text("");
	}
}


function updateStatus(){ //Comes when click one object on main desk

	console.log(openID);
	var tmpObj = tasks[openID];
	

	switch(tmpObj.status){
		case 1:
			tmpObj.status = tmpObj.status+1;
			tasks[openID] = tmpObj;
			
			
			break;
		case 2:
			tmpObj.status = tmpObj.status+1;
			tasks[openID] = tmpObj;
		
				
			break;
		case 3:
			tasks.splice(openID,1);
			break;

	}
	
	
	generateTodos(false);
}


//<<--------------------------------------------------------------------------------------->>//
//												Keyboard handling
//<<--------------------------------------------------------------------------------------->>//
$(document).ready(function() {
  $(window).keydown(function(event){
  	switch(event.keyCode){
  		case 13:
  			event.preventDefault();
  			switch(modalNumOpen){
  				case 1:
  					addTask();
  					break;

  				default:
  					$('#addNewTaskModal').modal('show');
  					break;
  			}
      		
  			break;

  		case 'a':
  			$('#addNewTaskModal').modal('show');
  			break;
  	}
    if(event.keyCode == 13) {
      
    }
  });
});


//<<--------------------------------------------------------------------------------------->>//
//												Modal load/unload functions
//<<--------------------------------------------------------------------------------------->>//
//Modal events add new task
$('#addNewTaskModal').on('shown.bs.modal', function (e) {
 	modalNumOpen = 1;
 	document.getElementById("setTaskName").focus();

});
$('#addNewTaskModal').on('hidden.bs.modal', function (e) {
 	modalNumOpen = -1;
});

//Modal events Edit  task
$('#editModal').on('show.bs.modal', function (e) {
 	$("#setTaskLabelModal").text(tasks[openID].name);
 	$("#editTaskName").val(tasks[openID].name);
 	$("#editPriorty").val(tasks[openID].TaskText);
});
$('#editModal').on('shown.bs.modal', function (e) {
 	modalNumOpen = 2;
});
$('#editModal').on('hidden.bs.modal', function (e) {
 	modalNumOpen = -2;
});