const getDBName = "TodoDB";
const getDBVersion = 1;

const getTaskTableName = 'Tasks';
const getCommentsTableName ='Comments';
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

	    var db = event.target.result;
	
	    // Create another object store called "names" with the autoIncrement flag set as true.    
	    var objStoreTasks = db.createObjectStore(getTaskTableName, { autoIncrement : true});
	    objStoreTasks.createIndex('id','id',{unique: true});
	    objStoreTasks.createIndex('name','name',{unique: false});
	    objStoreTasks.createIndex('status','status',{unique: false});
		objStoreTasks.createIndex('priority','priority',{unique: false});
		objStoreTasks.createIndex('setTime','setTime',{unique: false});
		objStoreTasks.createIndex('startTime','StartTime',{unique: false});
		objStoreTasks.createIndex('deadline','deadline',{unique: false});
		
		objStoreTasks.transaction.oncomplete = function(event){
			
			
		}
		
		var objStoreComments = db.createObjectStore(getCommentsTableName, { autoIncrement : true });
		objStoreComments.createIndex('id','id',{unique: true});
	    objStoreComments.createIndex('taskId','taskId',{unique: false});
	    objStoreComments.createIndex('text','text',{unique: false});
		objStoreComments.createIndex('createTime','createTime',{unique: false});
		

		
    };
    
    
}

//<<--------------------------------------------------------------------------------------->>//
//												Tasks
//<<--------------------------------------------------------------------------------------->>//
function addDBTask(setTask,setComment){
	
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
			getDBTasks();
		}
		
	}
}

function getDBTasks(){
	let results ;
	let taskTable = db.transaction(getTaskTableName,'readwrite').objectStore(getTaskTableName);
	results = taskTable.getAll()
	results.onsuccess = function(event){
		//console.log('All tasks loadled');
		//console.log(results);
		tasks = results.result;
		generateTodoLists();
		
	}
	//console.log(results);
	return results;
}

//Support to generate TodoLists
function generateTodoLists(){
	//console.log(tasks.length);
	clearTaskLists();
	if(tasks.length>0){
		//console.log(tasks);
		tasks.forEach(inst =>{
			let tmpTask = new Task(inst.id,inst.name,inst.priority,inst.status,inst.setTime,inst.StartTime,inst.deadline);
			//console.log(tmpTask);
			switch(tmpTask.status){
				case 1:
					$('#plannedTasksList').append(tmpTask.GenerateTask());
					break;
					
				case 2:
					$('#workingTasksList').append(tmpTask.GenerateTask());
					break;
					
					
				case 3:
					$('#doneTasksList').append(tmpTask.GenerateTask());
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
				let tmp = cursor.value;
				tmp.id = cursor.key; //Save key as id
				results.push(tmp);
				let comment = new Comment(tmp.id,tmp.taskId,tmp.text,tmp.createTime);
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
