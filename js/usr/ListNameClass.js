class ListName{
	id;
	name;

	constructor(id,name){
		this.id = id;
		this.name = name;
	}

//<<--------------------------------------------------------------------------------------->>//
//												Getters
//<<--------------------------------------------------------------------------------------->>//
	get setid(){
		return this.id;
	}


	get setname(){
		return this.name;
	}
//<<--------------------------------------------------------------------------------------->>//
//												Setters
//<<--------------------------------------------------------------------------------------->>//

	set getid(setnewid){
		this.id = parseInt(setnewid,10);
	}

	set getname(setnewname){
		this.name =setnewname;
	}

//<<--------------------------------------------------------------------------------------->>//
//												functions
//<<--------------------------------------------------------------------------------------->>//


//<<--------------------------------------------------------------------------------------->>//
//												Generate HTML
//<<--------------------------------------------------------------------------------------->>//
	generateMenuObject(){
		return '<a class="dropdown-item btnTodoListSelect" id="todoListName_'+this.id+'" href="#">'+this.name+'</a>'
	}

	generateListEditorObject(){
		return '<div class="row"><div class="card w-100 btnDeleteList " id="listName_'+parseInt(this.id,10)+'"><div class="card-body listName">'+this.name+'</div></div></div>'
	}

}