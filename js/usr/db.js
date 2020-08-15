const getDBName = "TodoDB";
const getDBVersion = 4;
var db;
let setColumns= {name: 'id',unique: false};
let openTime = moment().format('MMMM Do YYYY, HH:mm:ss');

console.log("Start of DB");

const customerData = [
  { name: "Bill", status: 1, priority: 1,setTime:openTime ,startTime:openTime, deadline: openTime},
  { name: "Jaska", status: 1, priority: 1,setTime:openTime ,startTime:openTime, deadline: openTime},
];

function openDb(){
	var req = indexedDB.open(getDBName,getDBVersion);
	req.onsuccess = function(event){
		db = this.result;
		console.log("Open ok");
	}
	req.onerror = function(event){
		console.log(event.target.errorCode);
	}
	
	req.onupgradeneeded = function (event) {

	    var db = event.target.result;
	
	    // Create another object store called "names" with the autoIncrement flag set as true.    
	    var objStoreTasks = db.createObjectStore("Tasks", { autoIncrement : true });
	    objStoreTasks.createIndex('name','name',{unique: false});
	    objStoreTasks.createIndex('status','status',{unique: false});
		objStoreTasks.createIndex('priority','priority',{unique: false});
		objStoreTasks.createIndex('setTime','setTime',{unique: false});
		objStoreTasks.createIndex('startTime','StartTime',{unique: false});
		objStoreTasks.createIndex('deadline','deadline',{unique: false});
		
		objStoreTasks.transaction.oncomplete = function(event){
			var tst = db.transaction('Tasks','readwrite').objectStore('Tasks');
			customerData.forEach(element =>{
				console.log(element);
				tst.add(element);
			});
		}
		
		var objStoreComments = db.createObjectStore("Comments", { autoincrement : true });
	    objStoreComments.createIndex('id','id',{unique: false});
	    objStoreComments.createIndex('text','text',{unique: false});
		objStoreComments.createIndex('setTime','setTime',{unique: false});
		

		
    };
}

