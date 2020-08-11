class Task{

	info =[];

	constructor(id,name,priority,info,status){
		this.id = id;
		this.name = name;
		this.priority = parseInt(priority,10);
		this.addInfo(info);
		this.status = parseInt(status,10);


		console.log("New Task, " + this.name + " " + this.priority + " " +this.info);

	}

	//Getters

	get TaskObject(){
		return this.GenerateTask();
	}

	get TaskText(){
		return this.GenerateTextPriority();
	}



	//Start of internal methos

	addInfo(text){
		if(text.length>2){
			this.info.push(text + " - ["+moment().format('MMMM Do YYYY, HH:mm:ss')+"]");
		}
		

	}

	getInfoCards(){ //Comments of tasks
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