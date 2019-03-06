var app = require('express')();
var http = require('http').Server(app);
//npm install --save socket.io 
var io = require('socket.io')(http);

var users = [];
var connections = [];

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function(data){
        if (socket.username) {
            users.splice(users.indexOf(socket.username), 1);
        }
        updateUserNames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconected: %s sockets connected', connections.length);
    });

    //Send Message
    socket.on('send_message', function(data){
         io.emit('new_message', { msg: data, user: socket.username });
    });

    //New User
    socket.on('new_user', function(data, callback){
         console.log(data)
         socket.username = data;
         users.push(socket.username);
         updateUserNames();
         callback(data);
    });

    function updateUserNames(){
        console.log(users);
        io.emit('update_users', users);
    }

});