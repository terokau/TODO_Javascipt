let tasks;
let openID = 0;
let lastSave = ""

let modalNumOpen = -1;

clearTaskLists(false);

//Time
let secondTimer = setInterval(updateTime,1000);
updateTime(); //To set in on load
function updateTime(){
	let timeStr = moment().format('MMMM Do YYYY, HH:mm:ss');
	$("#setTime").html("Current time: " +timeStr + " <br>Last time saved: " + lastSave);
	//console.log("Tic toc");
}

//<<--------------------------------------------------------------------------------------->>//
//												Actions
//<<--------------------------------------------------------------------------------------->>//

//Todo object clikc to open edit panel
$(document).on('click', ".todoObj", function() {
    //alert("Hello: " + $(this).attr('id'));   
   
    let gettmpId = $(this).attr('id').split("_");
	let getID = parseInt(gettmpId[1],10);
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

$(document).on('click', "#saveComment",function(){
	addComment();
});

$(document).on('click', "#setMoveNextStep",function(){
	updateStatus();
});

$(document).on('click', "#enableEdit",function(){
	$('#editTaskName').prop('disabled',false);
	$('#editPriorty').prop('disabled',false);
	$('#enableEdit').text('edit');
});

//Add new task

$("#addNewTask").click(function(){
	addTask();
});

//Focus out of validation object
$('#setTaskName').focusout(function(){
	
});

//<<--------------------------------------------------------------------------------------->>//
//												Support functions
//<<--------------------------------------------------------------------------------------->>//

function addTask(){
	
	let newTask = new Task(null,$("#setTaskName").val(),$("#setPriority").val(),1,null,'noStartTime','noDeadline');
	let newComment = new Comment(0,0,$('#setInfo').val(),'');
	
	newTask.updateSetTime();
	newComment.updateCreateTime();
	addDBTask(newTask,newComment);
	
	$('#addNewTaskModal').modal('hide');
	
	
};

function addComment(){ //Also change name/priority if modified
	let newComment = new Comment(0,tasks[openID].id,$("#addCommentBox").val(),'');
	newComment.updateCreateTime();
	addDBComment(newComment);
	
	tasks[openID].setName = $("#editTaskName").val();
	tasks[openID].setPriority = $("#editPriorty").val();
	$('#editModal').modal('hide');
	
}

function updateStatus(){ //Comes when click one object on main desk //TODO: change to use indexedDB

	console.log(openID);
	let tmpObj = tasks[openID];
	

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
	
	$('#editModal').modal('hide');
	saveValues();
	generateTodos(false);
}


function clearTaskLists(){ //Empty list 
	$("#plannedTasksList").text("");
	$("#workingTasksList").text("");
	$("#doneTasksList").text("");

	
}


//<<--------------------------------------------------------------------------------------->>//
//												Keyboard handling
//<<--------------------------------------------------------------------------------------->>//
$(document).ready(function() {
  $(window).keydown(function(event){
  	switch(event.key){
  		case 'Enter':
  			event.preventDefault();
  			switch(modalNumOpen){
  				case 1:
  					addTask();
  					break;

  				case 2:
  					addComment();
  					break;


  				default:
  					$('#addNewTaskModal').modal('show');
  					break;
  			}
      		
  			break;

  		case 'r':
  			/*
  			if(openID>0){
  				openID = openID*-1;
  				$('#editModal').modal('show');
  			}
  			*/
  			break;
  	}
    if(event.keyCode == 13) {
      
    }
  });
});

//<<--------------------------------------------------------------------------------------->>//
//												Save and load storage
//<<--------------------------------------------------------------------------------------->>//

function loadValues(){
	getDBTasks();

}

function saveValues(){
	
	//TODO convert to use indexedDB
	localStorage.setItem('last',moment().format('MMMM Do YYYY, HH:mm:ss'))

}


//<<--------------------------------------------------------------------------------------->>//
//												Modal load/unload functions
//<<--------------------------------------------------------------------------------------->>//
//Modal events add new task
$('#addNewTaskModal').on('show.bs.modal', function (e) {
	$("#setTaskName").val('');
	$("#setInfo").val('');
});
$('#addNewTaskModal').on('shown.bs.modal', function (e) {
 	modalNumOpen = 1;
 	document.getElementById("setTaskName").focus();

});
$('#addNewTaskModal').on('hidden.bs.modal', function (e) {
 	modalNumOpen = -1;
});

//Modal events Edit  task
$('#editModal').on('show.bs.modal', function (e) {
	$('#editTaskName').prop('disabled',true);
	$('#editPriorty').prop('disabled',true);
 	$("#setTaskLabelModal").text(tasks[openID].name);
 	$("#editTaskName").val(tasks[openID].name);
 	//$("#editPriorty").val(tasks[openID].TaskText);
 	switch(tasks[openID].priority){
 		case 3:
 			$('#editPriorty3').prop('selected',true)
 			$('#editPriorty2').prop('selected',false)
 			$('#editPriorty1').prop('selected',false)
 			break;
 		case 2:
 			$('#editPriorty3').prop('selected',false)
 			$('#editPriorty2').prop('selected',true)
 			$('#editPriorty1').prop('selected',false)
 			break;
 		case 1:
 			$('#editPriorty3').prop('selected',false)
 			$('#editPriorty2').prop('selected',false)
 			$('#editPriorty1').prop('selected',true)
 			break;
 	}
 	$("#addCommentBox").val('');
 	
 	console.log('Taskid: ' +tasks[openID].id);
 	getDBComments(tasks[openID].id);
 	
 	//TODO Comments
 	//$("#Comments").html(tasks[openID].GenerateInfoCards());

});
$('#editModal').on('shown.bs.modal', function (e) {
	document.getElementById("addCommentBox").focus();
 	modalNumOpen = 2;
});
$('#editModal').on('hidden.bs.modal', function (e) {
	loadValues()
	$('#editTaskName').prop('disabled',true);
	$('#editPriorty').prop('disabled',true);
 	modalNumOpen = -2;
});

//<<--------------------------------------------------------------------------------------->>//
//												Page load
//<<--------------------------------------------------------------------------------------->>//

window.onload = (event) => {
	openDB();
	
	//generateTodos(false);
	
  	console.log('page is fully loaded');
};