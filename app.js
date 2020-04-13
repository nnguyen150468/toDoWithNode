
// todo:
// 1. Read all commands from terminal
// 2. Do sth based on the commands (add or read todos)
// 3. store those data somewhere
// 4. functions to read/write the data

const fs = require('fs');
const chalk = require('chalk');
const yargs = require('yargs');

// console.log(chalk.bold.blueBright('Hello world'))

function loadData(){
    const buffer = fs.readFileSync('./data/database.json') //read file from system
    const data = buffer.toString() //convert buffer to string
    return JSON.parse(data) //parse string to JS object
}


function saveData(todo){
    //todo should be an object

    //read existing data
    let data = loadData();
    //make changes
    data.push(todo)
    //save it

    fs.writeFileSync("./data/database.json", JSON.stringify(data));
}

function addToDo(todoBody, todoStatus){
    let todos = loadData();
    
    let newID;

    //if array is empty, then first ID is 1
    if(todos.length===0){
        newID = 1;
    } else {
        newID = todos[todos.length-1].id + 1; //if array has elements, newID = last item's ID + 1
    }
    
    console.log(chalk.bold.bgCyan.red("New To-do:"));
    console.log(chalk.bold.yellow("ID:"),newID,chalk.bold.blueBright("\nTODO:"),todoBody, chalk.bold.redBright("\nCOMPLETE:"),todoStatus)

    saveData({id: newID, todo: todoBody, status: todoStatus});
}




// console.log(process.argv)
// if(process.argv[2] === 'add'){
//     addToDo(process.argv[3], process.argv[4])
//     // add todo later
    
// } else if(process.argv[2] === 'list'){
//     //render todos
//     const todos = loadData();
//     for(let {todo,status} of todos){
//         console.log( todo, status)
//     }
// }

yargs.command({
    command: "add",
    describe: "add some todo",
    builder: {
        id: {
            describe: "id of todo",
            demandOption: false,
            type: "number"
        },
        todo: {
            alias: "t",
            describe: "content of our todo",
            demandOption: true, //is it required
            type: 'string'
        },
        status: {
            describe: "status of todo",
            demandOption: false,
            default: false,
            type: "boolean"
        }
    },
    handler: function({todo, status}){
        addToDo(todo, status);
    }   
})

yargs.command({
    command: "list",
    describe: "show list of todos",
    builder: {
        id: {
            describe: "todo id",
            type: "number",
            demandOption: false
        },
        status: {
            describe: "todo status",
            type: "string",
            demandOption: false,
            default: "all"
        }
    },
    handler: function(args){
        const todos = loadData();
        console.log(chalk.bold.bgGrey.red("List of all To-dos:"))
        for (let {id, todo, status} of todos){
            if(args.status === "all"){
                if(status===true){
                    status="completed"
                    console.log(id, todo, chalk.blueBright(status))
                } else status="incomplete"
                console.log(id, todo, chalk.red(status))
            }
            else if( args.status==="completed" ){
                if(status===true){
                    status = "completed"
                    console.log(id, todo, status)
                }
            } else if( args.status==="incomplete"){
                if(status===false){
                    status="incomplete"
                    console.log(id, todo, status)
                }
            }
        }
    }
})

yargs.command({
    command: "delete",
    describe: "delete todo by id",
    builder: {
        id: {
            describe: "id of todo",
            demandOption: true,
            type: "string"
        }
    },
    handler: function({id}){
        let todos = loadData();
        let newTodos;

        if(id==="all"){
            newTodos = []
        } else if(id==="all_completed"){
            newTodos = todos.filter(item => item.status!==true);
        } 
        else{
            newTodos = todos.filter(item => item.id!==parseInt(id));
        }
        console.log(chalk.bold.bgGrey.red('Todos after delete'))
        for (let {id, todo, status} of newTodos){
            if(status===true){
                status="completed"
                console.log(id, todo, chalk.blueBright(status))
            } else status="incomplete"
            console.log(id, todo, chalk.red(status))
        }
        fs.writeFileSync('./data/database.json', JSON.stringify(newTodos))
    }
})

yargs.command({
    command: "toggle",
    describe: "change status of todo",
    builder: {
        id: {
            describe: "id of todo",
            demandOption: true,
            type: "number"
        }
    },
    handler: function({id}){
        let todos = loadData();

        for(let i=0; i<todos.length; i++){
            if(todos[i].id === id){
                todos[i].status = !todos[i].status
            }
        }

        console.log('after toggle',todos)
        fs.writeFileSync('./data/database.json', JSON.stringify(todos))
    }
})

yargs.parse();