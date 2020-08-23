const getDBName = "TodoDB";
const getDBVersion = 2;

const getTaskTableName = 'Tasks';
const getCommentsTableName ='Comments';
const getTasksListsTableName ='TaskLists';
const getListNameTableName ='ListNames';
var db;


//console.log("Start of DB");

//<<--------------------------------------------------------------------------------------->>//
//												Open DB connection
//<<--------------------------------------------------------------------------------------->>//
function openDB(){
	var req = indexedDB.open(getDBName,getDBVersion);
	req.onsuccess = function(event){
		db = this.result;
		//console.log("Open ok");
		loadValues();//From base.js to load all tasks to screen.
	}
	req.onerror = function(event){
		//console.log(event.target.errorCode);
	}
	
	req.onupgradeneeded = function (event) {

	     db = event.target.result;
	
	    // Create another object store called "names" with the autoIncrement flag set as true.    
	    let objStoreTasks = db.createObjectStore(getTaskTableName, { autoIncrement : true});
	    objStoreTasks.createIndex('id','id',{unique: true});
	    objStoreTasks.createIndex('name','name',{unique: false});
	    objStoreTasks.createIndex('status','status',{unique: false});
		objStoreTasks.createIndex('priority','priority',{unique: false});
		objStoreTasks.createIndex('setTime','setTime',{unique: false});
		objStoreTasks.createIndex('startTime','StartTime',{unique: false});
		objStoreTasks.createIndex('deadline','deadline',{unique: false});
		
		objStoreTasks.transaction.oncomplete = function(event){
			
			
		}
		
		let objStoreComments = db.createObjectStore(getCommentsTableName, { autoIncrement : true });
		objStoreComments.createIndex('id','id',{unique: true});
	    objStoreComments.createIndex('taskId','taskId',{unique: false});
	    objStoreComments.createIndex('text','text',{unique: false});
		objStoreComments.createIndex('createTime','createTime',{unique: false});

		let objStoreTaskList = db.createObjectStore(getTasksListsTableName, {autoIncrement:true});

		objStoreTaskList.createIndex('id','id',{unique:false}); //listnameid
		objStoreTaskList.createIndex('taskId','taskId',{unique:true});

		let objStoreListNames = db.createObjectStore(getListNameTableName, {autoIncrement:true});
		objStoreListNames.createIndex('id','id',{unique:true});
		objStoreListNames.createIndex('name','name',{unique:false});

		
    };
    
    
}

//<<--------------------------------------------------------------------------------------->>//
//												Tasks
//<<--------------------------------------------------------------------------------------->>//
function insertDBTask(setTask,setComment,setListId){
	
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let sentObj = taskTable.add(setTask);
	sentObj.onsuccess = function(event){
		
		setTask.id = sentObj.result;
		let finalRes = taskTable.put(setTask,setTask.id); //update id to be same as key
		writeDeBug("setTask id",setTask.id);
		writeDeBug("setListId", setListId);
		addTaskListConnection(setTask.id,setListId);
		
		//Add comment
		if(setComment.text.length > 0){
			setComment.taskId = setTask.id;
			addDBComment(setComment);
		}
		finalRes.onsuccess = function(event){
			getDBTasks(setListId);
		}
		
	}
}

function updateDBTask(setTask,setListId){
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let sentobj = taskTable.put(setTask,setTask.id);
	
	sentobj.onsuccess = function(event){
		
		getDBTasks(setListId);
	}

}

function deleteDBTask(setTask){
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let deleteobj = taskTable.delete(setTask.id);
}

function getDBTasks(setListId){
	let tmp;
	if(setListId==-1){
		
		getAllDBTasks();
	}else{
		getTaskListConnections(setListId);
	}
	
}

function getAllDBTasks(){
	let results =[] ;
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let tmp = taskTable.getAll()
	tmp.onsuccess = function(event){
		let tmpTask = tmp.result;
		tmpTask.forEach(inst=>{
			let tmpTask = new Task(inst.id,inst.name,inst.priority,inst.status,inst.setTime,inst.StartTime,inst.deadline);
			results.push(tmpTask);
		})
		
		tasks = results;
		generateTodoLists(results);
		return results;
	}
}

function getListDBTasks(setList){
	let results =[] ;
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let tmp = taskTable.getAll()
	tmp.onsuccess = function(event){ //Todo find new better way to find matching than this. slow
		let tmpTask = tmp.result;
		tmpTask.forEach(inst=>{
			setList.forEach(i=>{
				
				if(i.taskId == inst.id){
					let tmpTask = new Task(inst.id,inst.name,inst.priority,inst.status,inst.setTime,inst.StartTime,inst.deadline);
					results.push(tmpTask);
				}
			})
			
		})
		tasks = results;
		generateTodoLists(results);
		return results;
	}
}


//Support to generate TodoLists
function generateTodoLists(setTodoObjects){
	clearTaskLists();
	if(setTodoObjects.length>0){
		setTodoObjects.forEach(inst =>{

			switch(inst.status){
				case 1:
					$('#plannedTasksList').append(inst.GenerateTask());
					break;
					
				case 2:
					$('#workingTasksList').append(inst.GenerateTask());
					break;
					
					
				case 3:
					$('#doneTasksList').append(inst.GenerateTask());
					break;
			}
		});
	}
}




//<<--------------------------------------------------------------------------------------->>//
//												Comments
//<<--------------------------------------------------------------------------------------->>//
function addDBComment(setComment){
	let commentTable = db.transaction(getCommentsTableName,'readwrite').objectStore(getCommentsTableName);
	
	let tmp = commentTable.add(setComment);
	tmp.onsuccess = function(event){
		setComment.id = tmp.result;
		commentTable.put(setComment,setComment.id);
	}
}

function getDBComments(setTaskId){
	$("#Comments").html('');
	let results = [];
	let commentTable = db.transaction(getCommentsTableName,'readwrite').objectStore(getCommentsTableName);
	let rndobj = commentTable.openCursor();
	rndobj.onsuccess = function(event){
		let cursor = event.target.result;
		
		if(cursor){
			if(cursor.value.taskId == parseInt(setTaskId,10)){
				results.push(cursor.value);
				let comment = new Comment(cursor.value.id,cursor.value.taskId,cursor.value.text,cursor.value.createTime);
				$("#Comments").append(comment.getCommentCard());
				
			}
			cursor.continue();
		}else{
			
		}
	}
	return results;
}

//<<--------------------------------------------------------------------------------------->>//
//												TaskLists
//<<--------------------------------------------------------------------------------------->>//

function addDBListName(setName){
	
	let listNameTable = db.transaction(getListNameTableName, 'readwrite').objectStore(getListNameTableName);
	let tmp = listNameTable.add(setName);
	tmp.onsuccess = function(event){
		setName.id = tmp.result;
		let finalRes = listNameTable.put(setName,setName.id);
		finalRes.onsuccess = function(event){
			
			getDBListNames();
		}

	}
}

function getDBListNames(){
	let results = [];
	let listNameTable = db.transaction(getListNameTableName, 'readwrite').objectStore(getListNameTableName);
	let tmp = listNameTable.getAll();
	let defaultOption = new ListName(-1,'All Tasks');
	results.push(defaultOption);
	tmp.onsuccess = function(event){
		let tmpNames = tmp.result;
		tmpNames.forEach(inst=>{
			let tmpObj = new ListName(inst.id,inst.name);

			results.push(tmpObj);
			
			
		});

		generateListNames(results);
	}
}

function deleteDBListName(setid){
	let listNameTable = db.transaction(getListNameTableName, 'readwrite').objectStore(getListNameTableName);
	let tmp = listNameTable.delete(parseInt(setid,10));
	tmp.onsuccess = function(event){
		activeList = -1;
		$('#taskListName').text('All tasks');
		loadValues();
	}
}

function generateListNames(setListNames){
	$('#dropdownLists').html('');
	$('#editListNames').html('');
	setListNames.forEach(inst=>{
		$('#dropdownLists').append(inst.generateMenuObject());
		$('#editListNames').append(inst.generateListEditorObject());
	});

}
//<<--------------------------------------------------------------------------------------->>//
//												TaskList Connection
//<<--------------------------------------------------------------------------------------->>//

function addTaskListConnection(setTaskId,setListId){
	let setObj = {id: parseInt(setListId,10) , taskId: parseInt(setTaskId,10)};
	let taskListsTable = db.transaction(getTasksListsTableName, 'readwrite').objectStore(getTasksListsTableName);
	
	writeDeBug('TaskList Object',setObj);
	let tmp = taskListsTable.add(setObj);
	tmp.onsuccess = function(event){
	}
}

function getTaskListConnections(setListId){
	let results=[];
	let taskListsTable = db.transaction(getTasksListsTableName, 'readwrite').objectStore(getTasksListsTableName);
	let tmp = taskListsTable.getAll();
	tmp.onsuccess = function(event){
		tmp.result.forEach(inst=>{
			if(inst.id==setListId){
				results.push(inst);
			}
			
		});
		getListDBTasks(results);
		return results;
		//Get Tasks assigend to this taskID
	}
}




function writeDeBug(setText,setObj){
	console.log(setText);
	console.log(setObj);
}


































