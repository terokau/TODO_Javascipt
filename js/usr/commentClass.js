class Comment{
	id;
	taskId;
	text;
	createTime;
	
	constructor(id,taskid,text,createTime){
		this.id 	= 	parseInt(id,10);
		this.taskId	=	parseInt(taskid,10);
		this.text	=	text;
		this.createTime	=	createTime; 
	}
	
//<<--------------------------------------------------------------------------------------->>//
//												Getters and Setters
//<<--------------------------------------------------------------------------------------->>//
	
	set id(setNewId){
		this.id = parseInt(setNewId,10);
	}
	
	set taskId(setNewTaskId){
		this.taskId = parseInt(setNewTaskId,10);
 	}
 	
 	set text(newText){
	 	this.text = newText;
 	}
 	
 	set createTime(setNewCreateTime){
	 	this.createTime = setNewCreateTime;
 	}
	
	
//<<--------------------------------------------------------------------------------------->>//
//												Functions
//<<--------------------------------------------------------------------------------------->>//	
	getCommentCard(){
		//console.log('Generating comment card');
		return '<div class="row"><div class="card w-100 TaskComment" id=taskComment_"'+this.id+'"><div class="card-body commentCSS">'+this.text+' - [' +this.createTime+ ']</div></div></div>';

	}//End of getCommentCard()
	
	updateCreateTime(){
		this.createTime = moment().format('MMMM Do YYYY, HH:mm:ss');
	}
	
}