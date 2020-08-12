class Task{

	info =[];

	constructor(id,name,priority,info,status){
		this.id = id;
		this.setName = name;
		this.setPriority = parseInt(priority,10);
		this.addInfo(info);
		this.setStatus = parseInt(status,10);


		//console.log("New Task, " + this.name + " " + this.priority + " " +this.info);

	}

	//Getters

	get TaskObject(){
		return this.GenerateTask();
	}

	get TaskText(){
		return this.GenerateTextPriority();
	}

	get getPriority(){
		return this.priority;
	}

	//Setters

	set setName(setNewName){
		this.name = setNewName;
	}

	set setPriority(setNewPriority){
		this.priority = parseInt(setNewPriority,10);
	}

	set setStatus(setNewStatus){
		this.status = parseInt(setNewStatus,10);
	}



	//Start of internal methos

	addInfo(text, setAddTimeStamp){

		if(text.length>2){
			if(setAddTimeStamp){
				this.info.push(text + " - ["+moment().format('MMMM Do YYYY, HH:mm:ss')+"]");
			}else{
				this.info.push(text);
			}
			
		}
		

	}

//<<--------------------------------------------------------------------------------------->>//
//												Generate HTML
//<<--------------------------------------------------------------------------------------->>//
	GenerateInfoCards(){ //Comments of tasks
		let emptyTxt = "";
		this.info.forEach(element =>{
			emptyTxt = emptyTxt + '<div class="row"><div class="card w-100"><div class="card-body">'+element+'</div></div></div>';
		});

		return emptyTxt;
	}

	
	GenerateTask(){
		return  '<li class="list-group-item '+this.GenerateColorClass()+' todoObj" id="todo_'+this.id+'"><span>['+this.GenerateTextPriority()+']</span> - '+this.name+'</li>';
	}

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