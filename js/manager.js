/* SERVER */

/* Put connection address here */
var socket = io.connect('http://localhost:8080');




var Users = new Array();
var target = null;
var myName = false;
var operators = {
	freq: 0,
	dur: 0,
	wait: 0,
	amp: 0,
	pos: 0
};

var daisyVals = {
	sample: "audio/pianowav/piano-00.wav", // bell, gutter, ring, pot
	ratio: 1,
	amp: 1,
	dur: 1000,
	wait: 500,
	pattern: 5,
	verb: 0,
	delay: 0
	
}

var funnyNames = [
	"Morty",
	"Barty",
	"Prince",
	"Hobart",
	"Spock",
	"Ingleby",
	"Barney",
	"Poe",
	"Chuck",
	"Mace",
	"Obiwan",
	"Yoda"
]

// on connection to server
socket.on('connect', function() {
	//users and user interaction
	if (!myName){
		myName = funnyNames[Math.floor(Math.random()*funnyNames.length)]+Math.floor(Math.random()*100);
	}
	$("#welcome").fadeOut(500);
	socket.emit('adduser', myName);
});

socket.on('disconnect', function() {
	socket.emit('removeuser', myName);
});

// LISTEN for daisies
socket.on('updatechat', function (type, data) {
	if (type=="daisy") {
		if (data.target == myName) {
			console.log(data.pattern);
			daisyBloom(data.pattern);
		} else {
			$("#user"+data.target).stop().css("background-color", "#49f").animate({backgroundColor: "#DDD"}, 500);
		}
	}
	if (type=="connection") {
		addConnection(data[0],data[1]);
	}
	if (type=="soundProfile") {
		if (data.direction == myName) {
			daisyVals.pos = data.pos;
		}
	}
	/*
	if (type=="node") {
		position1.groupNode(data);
	} 
	*/
});

// update user list
socket.on('updateusers', function(data) {
	$('#users').empty();
	Users = new Array();
	$.each(data, function(key, value) {
		Users.push(key);
		$('#users').append('<div class="a_user" id="user'+key+'" onclick="selectUser(\''+key+'\')">' + key + '</div>');
	});
	$("#user"+myName).css("border","solid 2px #4af");
	defineUserPaths();
	makeAllConnections();
});


var context, carrier, mod, modpoint, modgain, buff, delay, delayGain, verb, ring, prefxbus;
var canvas, visctx;


/* Onload */

$(document).ready(function() {
	
	canvas = document.getElementById("paths");
	visctx = canvas.getContext("2d");
	
	canvas.width = 400;
	canvas.height = 400;
	
	// gibberish priming will go here
	
//	context = new webkitAudioContext();
	Gibberish.init(); 
	prefxbus = new Gibberish.Bus2();

//	prefxbus = context.createGainNode();	
//	prefxbus.gain.value = 1;
//	prefxbus.connect(context.destination);
//	prefxbus.connect(delay);

//	distortion = new Gibberish.Decimator({ input:prefxbus, bitDepth:16, sampleRate:1000 });

	ringMod = new Gibberish.RingModulation({ input:prefxbus, frequency:3, amp:1, mix:0 });
	
	delay = new Gibberish.Delay({input:ringMod, time: 500, feedback: 0.8}); 
//	delay = new Gibberish.Delay(distortion).connect(); 
	
	verb = new Gibberish.Reverb({input:delay, roomSize:10, wet:0.9, dry:1}).connect();
	
	//prefxbus.connect();
	//distortion.connect();
	
	
	/* test of ADSR envelope.

	adsr = new Gibberish.ADSR(22050, 22050, 88200, 22050, 1, .35);
	
	a = new Gibberish.Sine( 440, Mul(.5, adsr) ).connect();
	
	b = new Gibberish.Sequencer({
	  target:adsr, key:'run',
	  durations:[ seconds(4) ],
	}).start();
	
	 */
	
	
	/*
	buff = new Audio("audio/dh_source1.mp3");
	buff.load();
	
	console.log("audio starting to load");
	
	buff.addEventListener("canplaythrough", function() {
		console.log("audio is loaded");
	});
	*/
		
});




/* UI via Net */

function selectUser(key) {
	if (target!=key) {
		target = key;
	} else {
		target = null;
	}
	
	addMyOwnConnection(myName, target);
	
}


//FIX: UPDATE this list for new value categories

function editDaisy(e, val) {
	console.log(val);
	if (event.which==13) {
		val=val.split(" ");
		if (val[0]=="sample") {
			eval("daisyVals."+val[0]+" = '"+val[1]+"';");
		} else {
			eval("daisyVals."+val[0]+" = "+val[1]);
		//	distortion.bitDepth = daisyVals.bitDepth
			delay.feedback = limitRange(daisyVals.delay,0,0.99); 
			verb.roomSize = daisyVals.verb;
		}
		$("#daisyeditor").val("");
		
	}
}
			
function setParam(type,val) {
}

function limitRange(val,low,high) {
	if (val<low) {
		val = low;
	} else if (val>high) {
		val = high;
	}
	return val;
}

function startPulse() {
	
	sendDaisy(daisyVals.pattern);
	
}


function sendDaisy(pattLen) {
	if (!pattLen) {
		pattLen = daisyVals.pattern;
	}
	var daisy = {
					"target": target,
					"pattern": pattLen
	}
	socket.emit('sendchat', "daisy", daisy);
}

var allBuffers = new Array();
var samplersUsed = 0;
var volumes = new Array();

function daisyBloom(patternLen) {
	
	patternLen--;

	$("#user"+myName).stop().css("background-color", "#49f").animate({backgroundColor: "#FFF"}, 500);
	
	// play sound code here
	
	if (samplersUsed<=10) {
/*		volumes.push(context.createGainNode());
	//	var volume = volumes[volumes.length-1];
		volumes[volumes.length-1].gain.value = 0;
	//	volume.connect(context.destination);
		volumes[volumes.length-1].connect(prefxbus);
		
	*/
	//	volumes.push(new Gibberish.ADSR(2050, 2050, 8200, 2050, 1, .5));
	
	//	a = new Gibberish.Sine( 440, Mul(.5, adsr) ).connect();
		
	/*	b = new Gibberish.Sequencer({
		  target:adsr, key:'run',
		  durations:[ seconds(4) ],
		}).start(); */
		
		buffNum = allBuffers.length;
		allBuffers.push(new Gibberish.Sampler({ file:daisyVals.sample }).connect(prefxbus)); 
		
	/*	volume.gain.linearRampToValueAtTime(0, context.currentTime);
		volume.gain.linearRampToValueAtTime(daisyVals.amp, context.currentTime + 0.1);
		volume.gain.linearRampToValueAtTime(0, context.currentTime + daisyVals.dur/1000 + 0.1);
	*/	
		allBuffers[buffNum].note(daisyVals.ratio);
	//	allBuffers[buffNum].mod("amp", volumes[volumes.length-1], "=");
	//	volumes[volumes.length-1].run();
		
	} else {
		allBuffers[samplersUsed%10].file = daisyVals.sample;
	//	allBuffers[samplersUsed%10].initialized = false;
	//	allBuffers[samplersUsed%10].request = new AudioFileRequest(daisyVals.sample);
   	//	allBuffers[samplersUsed%10].request.onSuccess = allBuffers[samplersUsed%10]._onload;
    //	allBuffers[samplersUsed%10].request.send();
	
	
	//	allBuffers[samplersUsed%10]._onload();
	//	allBuffers[samplersUsed%10] = new Gibberish.Sampler({ file:daisyVals.sample }).connect(prefxbus);
	//	allBuffers[samplersUsed%10].amp = daisyVals.amp;
		daisyVals.wait = allBuffers[samplersUsed%10].bufferLength/44100;
		allBuffers[samplersUsed%10].note(daisyVals.ratio);
		console.log("sampler: "+samplersUsed&10);
	}
	
	
	samplersUsed++;
	
	if (patternLen > 0) {
		setTimeout("sendDaisy("+patternLen+")", daisyVals.wait);	
	}
}

function eraseSamplers() {
//	allBuffers = new Array();
//	console.log("samples cleared");
}


function sendMySound() {
	var profile = {
		specs: daisyVals,
		direction: target 
	} 
	
	socket.emit('sendchat', "soundProfile", profile);
}





/* UI Front-end */
var userNames = new Array();


function defineUserPaths() {
	userNames = new Array();
	for (i=0;i<Users.length;i++) {
		var thisUser = Users[i];
		Users[i] = new Object();
		Users[i].name = thisUser;
		var radius = 200;
		var center = 200;
		//$("#user"+Users[i].name).html(Users.length);
		var pipos = ((Math.PI*2)/Users.length)*i;
		//var pipos = ((Math.PI*2)/3)*1;
		Users[i].xPos = Math.sin(pipos)*radius+center-40;
		Users[i].yPos = Math.cos(pipos)*radius+center-40;
		$("#user"+Users[i].name).css("left", Users[i].xPos+"px");
		$("#user"+Users[i].name).css("top", Users[i].yPos+"px");
		userNames.push(Users[i].name);
	}
}

var connections = new Array();
var fromPoint = new Array();
var toPoint = new Array();

function addMyOwnConnection(person1,person2) {
	socket.emit('sendchat', "connection", [person1,person2]);
	addConnection(person1,person2);
}

function addConnection(person1, person2) {
	if (fromPoint.indexOf(person1)==-1) {
		fromPoint.push(person1);
		toPoint.push(person2);
	} else {
		toPoint[fromPoint.indexOf(person1)] = person2;
	}
	makeAllConnections();
}

//connections
function makeAllConnections() {
	canvas.width = canvas.width;
	pathControl = new Array();
	for (i=0;i<fromPoint.length;i++) {
		var fromI, toI;
		for (j=0;j<Users.length;j++) {
			if (Users[j].name==fromPoint[i]) {
				fromI = j;
			}
			if (Users[j].name==toPoint[i]) {
				toI = j;
			}
		}
		if (fromI>-1 && toI >-1) {
			drawConnection(fromI, toI);
		} else {
			fromPoint.splice(i,1);
			toPoint.splice(i,1);
		}
	}	
} 

var pathControl = new Array();

function drawConnection(fromI, toI) {
	var pathCheck = fromI+"to"+toI;
	var pathCheck2 = toI+"to"+fromI;
	if (pathControl.indexOf(pathCheck)==-1) {
		visctx.strokeStyle = "#bbb";
		pathControl.push(pathCheck);
		pathControl.push(pathCheck2);
	} else {
		visctx.strokeStyle = "#333";
	}
	with (visctx) {
		lineWidth = 3;
		beginPath();
		moveTo(Users[fromI].xPos+40,Users[fromI].yPos+40);
		lineTo(Users[toI].xPos+40,Users[toI].yPos+40);
		stroke();
		closePath();
	}
}




/* HANDLE KEYS */

function handleKeys(e) {
	
	console.log(e.which);
	
	if (e.which>=65 && e.which <= 91) {
		
		daisyVals.sample = 'audio/pianowav/piano-0'+(e.which-65)+'.wav';
	//	startPulse();
	
		daisyBloom(0);
		
	//	daisyVals.wait = (e.which-64)*50;
	//	console.log('audio/piano/piano-0'+(e.which-65)+'.mp3');
		
	} else {
		
		switch(e.which) {
			case 39:
				if (target==null) {
					target = Users[0].name;
				}
				var tI = userNames.indexOf(target);
				tI = tI - 1;
				if (tI<0) {
					tI = Users.length-1;
				}
				var nextTarget = userNames[tI]; 
				selectUser(nextTarget);
				break;
			case 37:
				if (target==null) {
					target = Users[0].name;
				}
				var tI = userNames.indexOf(target);
				tI++;
				if (tI>Users.length-1) {
					tI = 0;
				}
				var nextTarget = userNames[tI]; 
				selectUser(nextTarget);
				break;
			case 16:
				daisyVals.pos = Math.floor(Math.random()*100)+2;
				delay.delayTime.value = Math.floor(Math.random()*10)/10+0.05;
				break;
			case 65:
			//	eraseSamplers();
				break;
		//	case 32:
		//		sendMySound();
		//		break;
			case 32:
				startPulse();
				break;
		}
	}
	
}





/* Helpful funcs */

function dream(scaleNum) {
	var randNum = Math.floor(Math.random()*scaleNum);
	return randNum;
}

