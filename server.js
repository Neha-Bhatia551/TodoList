const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 
//loading the proto file in the server
const packageDef = protoLoader.loadSync('todo.proto', {});
//loading the package definition
const grpcObject = grpc.loadPackageDefinition(packageDef);
//loading the package
const todoPackage = grpcObject.todoPackage; 
const server = new grpc.Server();

//binding the server to the port 40000
server.bindAsync('localhost:40000', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`Server binding error: ${error.message}`);
        return;
    }
    console.log(`Server running at localhost:${port}`);
});

const todos = [];
//adding service Todo to the server
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodoStream": readTodoStream
}); 

//defining the function readTodos in my server
function readTodos(call, callback ) {
    callback(null, {"items" : todos} );
}

//defining the function createTodo in my server
function createTodo(call,callback) {

    const todoItem = {
        "id": todos.length + 1,
        "title": call.request.title
    };
    todos.push(todoItem);
    callback(null, todoItem);
     
 }   

 //defining the function readTodoStream in my server, that sends the todos as a stream
 function readTodoStream(call, callback) {

    //call.write , writes data as a stream 
      todos.forEach(item => call.write(item)); 
      call.end(); 
 }
