const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); 

//loading the proto file in the client
const packageDef = protoLoader.loadSync('todo.proto', {});
//loading the package definition
const grpcObject = grpc.loadPackageDefinition(packageDef);
//loading the package
const todoPackage = grpcObject.todoPackage;  
//creating a client and connecting to the server on port 40000
const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure()); 
//getting the text from the command line
const text = process.argv[2];

//calling the readtodos function which is defined in the server, which returns all todos 
/*client.readTodos(null, (error, response) => {
    if(response.items != undefined) {
        response.items.forEach(a => console.log(a.title));
    } 
 } ); */
 //calling the createTodo function which is defined in the server, which creates a new todo in the server
client.createTodo({ 
    "id" : -1,
    "title" : text
}, (error, response) => {
    console.log("Created Todo " + JSON.stringify(response));    
 });

//calling the readTodoStream function which is defined in the server, which returns a stream of todos
const call = client.readTodoStream();

//on receive event from the server, print the todo, receiving as a stream
call.on("data", item => {
    console.log("Received from server as a Stream: " + JSON.stringify(item));
})
//when the stream of todos ends, print the message
call.on("end", e => console.log("Stream ended"));  

