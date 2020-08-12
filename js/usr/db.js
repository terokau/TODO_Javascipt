const getDBName = "TodoDB";
const getDBVersion = 3;

console.log("Start of DB");
// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}else{
	var request = window.indexedDB.open(getDBName, getDBVersion);
}

request.onerror = function(event) {
  // Do something with request.errorCode!
};
request.onsuccess = function(event) {
	console.log("Open " + getDBName +" Ok.")
  // Do something with request.result!
  var db = event.result;
};
