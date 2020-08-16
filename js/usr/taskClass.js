class Task{

	id;
	name;
	status;
	priority;
	setTime;
	startTime;
	deadline;
	

	constructor(id,name,priority,status,setTime,startTime,deadline){
		this.id = id;
		this.setName = name;
		this.priority = parseInt(priority,10);
		this.status = parseInt(status,10);
		this.setTime = setTime;
		this.startTime = startTime;
		this.deadline = deadline;


		//console.log("New Task, " + this.name + " " + this.priority + " " +this.info);

	}

//<<--------------------------------------------------------------------------------------->>//
//												Getters
//<<--------------------------------------------------------------------------------------->>//

	get TaskObject(){
		return this.GenerateTask();
	}

	get TaskText(){
		return this.GenerateTextPriority();
	}

	get getPriority(){
		return this.priority;
	}

//<<--------------------------------------------------------------------------------------->>//
//												Setters
//<<--------------------------------------------------------------------------------------->>//
	set setName(setNewName){
		this.name = setNewName;
	}

	set setPriorty(setNewPriority){
		this.priority = parseInt(setNewPriority,10);
	}

	set setStatus(setNewStatus){
		this.status = parseInt(setNewStatus,10);
	}
	
	set setTime(setNewSetTime){
		this.setTime = setNewsetTime;
	}
	
	set startTime(setNewStartTime){
		this.setNewStartTime;
	}
	
	set deadline(setNewDeadLine){
		this.deadline = setNewDeadLine;
	}
//<<--------------------------------------------------------------------------------------->>//
//												functions
//<<--------------------------------------------------------------------------------------->>//

	updateSetTime(){
		this.setTime = moment().format('MMMM Do YYYY, HH:mm:ss');
	}

//<<--------------------------------------------------------------------------------------->>//
//												Generate HTML
//<<--------------------------------------------------------------------------------------->>//
	
	GenerateTask(){
		return  '<li class="list-group-item '+this.GenerateColorClass()+' todoObj" id="todo_'+this.id+'"><span>['+this.GenerateTextPriority()+']</span> - '+this.name+'</li>';
	}


//<<--------------------------------------------------------------------------------------->>//
//												Text/Colors from numbers
//<<--------------------------------------------------------------------------------------->>//
	GenerateColorClass(){
		switch(this.priority){

			case 1:
				return "lowPriority";
				break;

			case 2:
				return "normalPriority";
				break;

			case 3: 
				return "highPriority";
				break;

		};
	}

	GenerateTextPriority(){
		
		let tmpTxt = "";
		switch(this.priority){

			case 1:
				tmpTxt = "Low";
				break;

			case 2:
				tmpTxt = "Normal";
				break;

			case 3: 
				tmpTxt = "High";
				
				break;

			default:
				tmpTxt = "Unknown priority: " + this.priority;

		};
		
		return tmpTxt;
	}
}