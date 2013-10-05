

/*var dgram = require('dgram');
var message = new Buffer("test");
var client = dgram.createSocket("udp4");
client.send(message, 0, message.length, 41234, "localhost", function(err, bytes) {
  client.close();
}); */

var osc = require('node-osc');

var client = new osc.Client('127.0.0.1', 3333);
client.send('/oscAddress', 200);