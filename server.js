const express = require('express');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(5000,function(){
console.log('server running...');});

app.get('/', (req, res) => {
    console.log('opening client page');
    res.sendFile(__dirname + '/client.html')
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('connect : %s sockets connected', connections.length);

    socket.on('disconnect', function (data) {

        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('disconnect :remaining %s sockets connected', connections.length);
    });

    socket.on('send message', function (data) {
        console.log({ msg: data, user: socket.username });
        io.sockets.emit('new message', { msg: data, user: socket.username });
    })

    socket.on('location', function (data) {
        console.log('on location socket');
        console.log(data);
        var strcoords = 'Location : ' + data.userlat + ' and ' + data.userlong + ' find me!';
        //console.log(strcoords);
        data = strcoords;
        io.sockets.emit('new message', { msg: data, user: socket.username });
    })

    socket.on('new user', function (data, callback) {
        callback(true);
        console.log('new user : ' + data);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();

    });

    socket.on('locationError', function (data) {
        console.log(`location Error : ${data.err}`);
        console.log(data);
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);

    };
});
