/***********************
*     GAP Server      *
***********************/

/* "node gapserver.js" starts local server with this script
 * 
 */

var communicator = require('./node-MaxComm');

var http = require('http')
  , server = http.createServer(handler)
  , Communicator = require('./node-MaxComm');

server.listen(8080);

function handler(request,response){
    // handle the requests here
}

var comm = new Communicator(43000,server);
