var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
    // console.log(socket);

    socket.on('disconnect', function() {
        io.emit('users-changed', { user: socket.username, event: 'left' });
    });

    socket.on('set-name', (name) => {
        console.log('SER Name: ', name);

        socket.username = name;
        io.emit('users-changed', { user: name, event: 'joined' });
    });

    socket.on('send-message', (message) => {
        io.emit('message', { msg: message.text, user: socket.username, created: new Date() });
    });
});

var port = process.env.PORT || 3001;

http.listen(port, function() {
    console.log('listening in http//localhost: ' + port);
});