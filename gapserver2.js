/***********************
*     GAP Server      *
***********************/

/* "node gapserver.js" starts local server with this script */


/* Definitions */
var express = require('express');
var app = express.createServer(express.static(__dirname));
var io = require('socket.io').listen(app);
var dgram = require('dgram');

var udpsock = dgram.createSocket('udp4');

/* Routing */
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

/* Open Ports */
app.listen(8080);
udpsock.bind(7788);


io.sockets.on('connection', function (socket) {

	socket.on('udpforward', function (data) {
		var message = new Buffer("Some bytes");
		console.log("yep");
		udpsock.send(message, 0, message.length, 7070, "localhost", function(err, bytes) {
		  console.log(err);
		});
	});
	
});