//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(process.env.PORT || 3000) ;
