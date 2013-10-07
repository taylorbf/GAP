/***********************
*     GAP Server      *
***********************/

/* "node gapserver.js" starts local server with this script */


/* Definitions */
var express = require('express');
var app = express.createServer(express.static(__dirname));
var io = require('socket.io').listen(app);
var osc = require('node-osc');

var client = new osc.Client('192.168.1.219', 3333);
client.send('/lala', 5);

var hostlocation;


var os=require('os');
var ifaces=os.networkInterfaces();
for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
      //console.log(dev+(alias?':'+alias:''),details.address);
      if (details.address!="127.0.0.1") {
      	console.log(details.address);
      	hostlocation = details.address;
      }
      ++alias;
    }
  });
}


/* Routing */
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

/* Open Port */
app.listen(8080);

/* For future usernames */
var usernames = {};


io.sockets.on('connection', function (socket) {

	socket.on('tiltdata', function (data) {
		io.sockets.emit('sharetilt', data);
		client.send('/tilty', data[0]);
		client.send('/tiltx', data[1]);
	});
	
	socket.on('sendeffects', function (data) {
		for (var i=0;i<data.length;i++) {
			client.send('/'+data.type, data.value);
			client.send('/'+data.type, data.value);
		}
	});
	

	socket.on('disconnect', function() {
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});

	/* User connects */
	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit('updatechat', 'SERVER', 'you have connected');
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});
});