const getDBName = "TodoDB";
const getDBVersion = 2;

const getTaskTableName = 'Tasks';
const getCommentsTableName ='Comments';
const getTasksListsTableName ='TaskLists';
const getListNameTableName ='ListNames';
var db;


console.log("Start of DB");

//<<--------------------------------------------------------------------------------------->>//
//												Open DB connection
//<<--------------------------------------------------------------------------------------->>//
function openDB(){
	var req = indexedDB.open(getDBName,getDBVersion);
	req.onsuccess = function(event){
		db = this.result;
		console.log("Open ok");
		loadValues();//From base.js to load all tasks to screen.
	}
	req.onerror = function(event){
		console.log(event.target.errorCode);
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
		objStoreTaskList.createIndex('id','id',{unique:true});
		objStoreTaskList.createIndex('taskId','tasld',{unique:false});

		let objStoreListNames = db.createObjectStore(getListNameTableName, {autoIncrement:true});
		objStoreListNames.createIndex('id','id',{unique:true});
		objStoreListNames.createIndex('name','name',{unique:false});

		
    };
    
    
}

//<<--------------------------------------------------------------------------------------->>//
//												Tasks
//<<--------------------------------------------------------------------------------------->>//
function insertDBTask(setTask,setComment){
	
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let sentObj = taskTable.add(setTask);
	sentObj.onsuccess = function(event){
		//console.log(sentObj);
		setTask.id = sentObj.result;
		let finalRes = taskTable.put(setTask,setTask.id);
		
		//TODO Comments add
		if(setComment.text.length > 0){
			setComment.taskId = setTask.id;
			addDBComment(setComment);
		}
		finalRes.onsuccess = function(event){
			tasks = getDBTasks();
		}
		
	}
}

function updateDBTask(setTask){
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let sentobj = taskTable.put(setTask,setTask.id);
	console.log('was here');
	sentobj.onsuccess = function(event){
		console.log('Task ' + setTask.id + ' was updated');
		tasks =getDBTasks();
	}

}

function deleteDBTask(setTask){
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let deleteobj = taskTable.delete(setTask.id);
}

function getDBTasks(){
	let results =[] ;
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	let tmp = taskTable.getAll()
	tmp.onsuccess = function(event){
		let tmpTask = tmp.result;
		tmpTask.forEach(inst=>{
			let tmpTask = new Task(inst.id,inst.name,inst.priority,inst.status,inst.setTime,inst.StartTime,inst.deadline);
			results.push(tmpTask);
		})
		//console.log('All tasks loadled');
		//console.log(results);
		generateTodoLists(results);
	}
	//console.log(results);
	return results;
}


//Support to generate TodoLists
function generateTodoLists(setTodoObjects){
	//console.log(tasks.length);
	clearTaskLists();
	if(setTodoObjects.length>0){
		//console.log(tasks);
		setTodoObjects.forEach(inst =>{
			
			//console.log(tmpTask);
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
	console.log("Add Comment: " + setComment);
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
		//console.log(cursor);
		if(cursor){
			if(cursor.value.taskId == parseInt(setTaskId,10)){
				results.push(cursor.value);
				let comment = new Comment(cursor.value.id,cursor.value.taskId,cursor.value.text,cursor.value.createTime);
				$("#Comments").append(comment.getCommentCard());
				
			}
			cursor.continue();
		}else{
			console.log('readed all comments');
		}
	}
	//console.log(results);
	return results;
}
