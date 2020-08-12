let tasks=[];
let tmpID = 0;
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

//Add new task

$("#addNewTask").click(function(){
	addTask();
});

//<<--------------------------------------------------------------------------------------->>//
//												Support functions
//<<--------------------------------------------------------------------------------------->>//

function addTask(){
	let newTask = new Task(tmpID,$("#setTaskName").val(),$("#setProprty").val(),$("#setInfo").val(),1);
	tmpID++;
	tasks.push(newTask);
	$('#addNewTaskModal').modal('hide');
	saveValues();
	generateTodos(false);
};

function addComment(){
	tasks[openID].addInfo($("#addCommentBox").val(),false);
	$('#editModal').modal('hide');
	saveValues();
}

function updateStatus(){ //Comes when click one object on main desk

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


function generateTodos(setDelete){

	clearTaskLists(setDelete);//maybe not smartest way to do
	
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

  				case 2:
  					addComment();
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
//												Save and load storage
//<<--------------------------------------------------------------------------------------->>//

function loadValues(){
	if(localStorage.length>0){
		let tmptasks = JSON.parse(localStorage.getItem('tasks') );
		tmptasks.forEach(element =>{
			let newTask = new Task(element.id,element.name,element.priority,'',element.status);
			element.info.forEach(inst =>{
				newTask.addInfo(inst,false);
			})
			tasks.push(newTask);
		})
		//console.log(tasks);
		tmpID		=	localStorage.getItem('id');
		lastSave 	= 	localStorage.getItem('last');
	}
	
}

function saveValues(){
	localStorage.setItem('last',moment().format('MMMM Do YYYY, HH:mm:ss'))
	localStorage.setItem('id',tmpID);
	localStorage.setItem('tasks',JSON.stringify(tasks));
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
 	$("#setTaskLabelModal").text(tasks[openID].name);
 	$("#editTaskName").val(tasks[openID].name);
 	$("#editPriorty").val(tasks[openID].TaskText);
 	$("#addCommentBox").val('');
 	$("#Comments").html(tasks[openID].getInfoCards());

});
$('#editModal').on('shown.bs.modal', function (e) {
	document.getElementById("addCommentBox").focus();
 	modalNumOpen = 2;
});
$('#editModal').on('hidden.bs.modal', function (e) {
 	modalNumOpen = -2;
});

//<<--------------------------------------------------------------------------------------->>//
//												Page load
//<<--------------------------------------------------------------------------------------->>//

window.onload = (event) => {
	loadValues();
	generateTodos(false);
  	console.log('page is fully loaded');
};