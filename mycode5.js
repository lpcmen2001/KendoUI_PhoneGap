// Declare global variables
var state = 0; // 0 record, 1 stop, 2 playback   
var src = "recording.wav"; // name of auio file
var mediaRec = null; // the object for recording and play sound
var directory = null; // holds a reference for directory reading
var app = null;
var timer = null;
var fsRef = null;

// to navigate using code :   window.kendoMobileApplication.navigate('#view-muzico');

app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    	//fsRef = 
        //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSytemSuccess, null); 
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, null);
		//alert(device.platform);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;'); 

        console.log('Received Event: ' + id);
    }
};


timer = {
	getTimeLeft: function(){
		return timeLeft;
	},
	getTimePassed: function(){
		return timePassed;
	},
	start: function(sec){
		alert("in timer!");
		var timeLeft = null;
		var timePassed = null;
		if (timeLeft == null || timePassed == null){
			timeLeft = sec;
			timePassed = 0;
		}
		var timeInterval = setInterval(
			function() {
				document.getElementById("maVar").innerHTML = "Reste " + timeLeft + " secondes !";
				console.log(timeLeft + " sec");
				timeLeft = timeLeft - 1;
				if (timeLeft+1 <= 1) {
					clearInterval(timeInterval);
					console.log("finished");
				}
			}
		, 1000);
	}
};

function onLogin(){
	var usernameLBL =  document.getElementById("username").value;
	var passwordLBL =  document.getElementById("password").value;
	
	switch (usernameLBL){
		case "Lp":
			if (passwordLBL == "qwerty"){
				alert("Logged in");
			}
			else{
				alert("Wrong Login");
			}
			break;
		case "Sandra":
			if (passwordLBL == "qwerty123"){
				alert("Logged in");
			}
			else{
				alert("Wrong Login");
			}
			break;
		default:
			alert("Wrong Username");
			break;
	}
}

function onRecord() {
  console.log("onClick() "+state);
  switch(state) {
    case 0: 
      startRecording();
      break;
    case 1: 
      stopRecording(); 
      break;
    default: 
      playRecording();
    }
  // Cycle back for another recording
  if( ++state > 2 ) {
    state =0;
  }
}
 
function startRecording() {
  console.log("startRecording()"); 
  // Create your Media object
  if (getDevice() == "Android") {
			src = "recording.amr";
			mediaRec = new Media(src,
		  // Success callback
		  function() {
			console.log("mediaRec -> success");
		  },
		  // Error callback
		  function(err) {
			console.log("mediaRec -> error: "+ err.code);
			alert("mediaRec -> error!");
		  });
		  // Record audio
		  mediaRec.startRecord();
		  alert("Started recording at :" +"/"+ src );
	}
  else if (getDevice() == "iPhone" || getDevice() == "iOS" ){
			  mediaRec = new Media(directory.fullPath+"/"+src,
		  // Success callback
		  function() {
			console.log("mediaRec -> success");
		  },
		  // Error callback
		  function(err) {
			console.log("mediaRec -> error: "+ err.code);
			alert("mediaRec -> error!");
		  });
		  // Record audio
		  mediaRec.startRecord();
		  alert("Started recording at :" +"/"+ src );
  }

}
 
function stopRecording() {
   console.log("stopRecording()");
   mediaRec.stopRecord();
   alert("Stopped recording");
}
 
function playRecording() {
  console.log("playRecording()");
  if (getDevice() == "Android"){
	  src = "recording.amr";
	  mediaRec = new Media(src,
  // Success callback
  function() {
    console.log("mediaRec play -> success");
  },
  // Error callback
  function(err) {
    console.log("mediaRec play -> error: "+ err.code);
	alert("mediaRec play -> error!");
  });
  }
  mediaRec.play();
  alert("Playing Back");

}
 
function onFileSytemSuccess(fileSystem) {
  // Get the data directory, creating it if it doesn't exist.
  fileSystem.root.getDirectory("",{create:true},onDirectory,onError);
    if (getDevice() == "Android") {
		src = "recording.amr";
	}
	else if (getDevice() == "iPhone" || getDevice() == "iOS"){
	  // Create the lock file, if and only if it doesn't exist.	
		fileSystem.root.getFile(src, {create: true, exclusive: false}, onFileEntry, onError);
	}
  
}
 
function onFileEntry(fileEntry) {
  console.log("onFileEntry()");
}
 
function onDirectory(d) {
  console.log("onDirectory()");
  directory = d;
  var reader = d.createReader();
  reader.readEntries(onDirectoryRead,onError);
}
 
// Helpful if you want to see if a recording exists 
function onDirectoryRead(entries) {
  //console.log("The dir has "+entries.length+" entries.");
  // Scan for audio src
    if (getDevice() == "Android") {
	src = "recording.amr";
	}
  for (var i=0; i<entries.length; i++) {
    //console.log(entries[i].name+' dir? '+entries[i].isDirectory);
    if(entries[i].name == src) {
      console.log("file found");
     }
  }
}
 
function onSuccess() {
  console.log("onSuccess()");
}
 
function onError(error) {
  alert('onError(): '    + error.code    + '\n' + 
  'message: ' + error.message + '\n');
 }
 
 function callError(){
     alert("Error alert! Shoot to kill.");
 }
 
function getDevice() {
	return device.platform;
}
	
function gotFS(fs) {
    alert("getting fs");
    var fail = failCB('getFile');
    fs.root.getFile("database.db", {create: true, exclusive: false},
    gotFileEntry, callError());
    alert("done with gotFS");
}

function gotFileEntry(fileEntry) {
    alert("got file entry");
    var fail = failCB('createWriter');
    file.entry = fileEntry;	 
    fileEntry.createWriter(gotFileWriter, fail);
    readText();
}

function gotFileWriter(fileWriter) {
    file.writer.available = true;
    file.writer.object = fileWriter;
}

function saveText(e) {
    var name = $('name').value,
    desc = $('desc').value,
    fail;
    dbEntries.push('<dt>' + name + '</dt><dd>' + desc + '</dd>')
    $('name').value = '';
    $('desc').value = '';
    $('varAfficher').innerHTML = dbEntries.join('');
    if (file.writer.available) {
    		file.writer.available = false;
    		file.writer.object.onwriteend = function (evt) {
    		file.writer.available = true;
    		file.writer.object.seek(0);
    		}
    		file.writer.object.write(dbEntries.join("\n"));
    	}
     
    return false;
}

function readText() {
    if (file.entry) {
    file.entry.file(function (dbFile) {
    var reader = new FileReader();
    reader.onloadend = function (evt) {
    var textArray = evt.target.result.split("\n");
     
    dbEntries = textArray.concat(dbEntries);
     
    $('varAfficher').innerHTML = dbEntries.join('');
    }
    reader.readAsText(dbFile);
    }, failCB("FileReader"));
    }
     
    return false;
}
/*
// Stock user data info
class dataNode {
    var timer : String;
    var nom : String;
    var info : string;
    
    // Object constructor
    function dataNode(p_timer, p_nom, p_info) {
        timer = p_timer;
        nom = p_nom;
        info = p_info;
    }
}*/


