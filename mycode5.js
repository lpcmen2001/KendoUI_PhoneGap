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
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSytemSuccess, null); 
        //fsRef = window.requestFileSystem(LocalFileSystem.TEMPORARY, 1024*1024, onInitFs, null);
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 1024*1024, removeFs, null);
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
	else if (getDevice() == "iPhone" || getDevice() == "iOS") {
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
 
 function callSuccess(){
     alert("Success alert! Get cover.");
 }
 
function getDevice() {
	return device.platform;
}

function onInitFs(fs) {
    fs.root.getFile("test.txt", {create: true, exclusive: true}, gotFileEntry, callError);
}

function removeFs(fs) {
    fs.root.getFile("test.txt",{create:false, exclusive:false}, removeFile, callError);
        
}

function removeFile(fileEntry){
    fileEntry.remove(function () {alert("file deleted");} ,callError);
    
}

function gotFS(fs) {
    fs.root.getFile("database.txt", {create: true, exclusive: false},
    callSuccess(), callError());
}

function gotFileEntry(fileEntry) {
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
class progressBar {
    var maxValue : int;
    var currentValue : int;
    var name : String;
    
    function progressBar(p_maxVal, p_currentVal, p_name) {
        maxValue = p_maxVal;
        currentValue = p_currentVal;
        name = p_name;
    }
    
    function update(p_currentVal){
        currentValue = p_currentVal;
        //UPDATE GRAPHICS HERE
    }
    
    function display() {
        // IMPLEMENT
    }
};
*/


function ProgressBar (container, maxVal, currentVal, name) {
    
    var bar = document.createElement('div');
    var text = document.createElement('div');
    
    this.maxVal = maxVal;
    this.currentVal = currentVal;
    this.name = name;
    
    bar.style.background = '#823D3D';
    //bar.style.borderRadius = '10px';
    bar.style.width = '0px';
    bar.style.height = '100%';
    
    /*
            borderRadius: 10,
    		width: 300,
    		height: 20,
    		maxValue: 100,
    		labelText: "Loaded in {value,0} %",
    		orientation: ProgressBar.Orientation.Horizontal,
    		direction: ProgressBar.Direction.LeftToRight,
    		animationStyle: ProgressBar.AnimationStyle.LeftToRight1,
    		animationSpeed: 1.5,
    		imageUrl: 'faire',
    		backgroundUrl: 'faire'
    		markerUrl: 'faire' 
     */
    
    container.appendChild(bar);
    
    text.style.textSize = '15px';
    container.appendChild(text);
    
    this.setPercentage = function(percentage){
        bar.style.width = percentage + "%";
    }
}

ProgressBar.prototype.update = function(newValue){
    this.currentVal = newValue;
}






/*
// Stock user data info
class DataNode {
    var timer : String;
    var nom : String;
    var info : string;
    
    // Object constructor
    function DataNode(p_timer, p_nom, p_info) {
        timer = p_timer;
        nom = p_nom;
        info = p_info;
    }
}

// Heritage class from dataNode
class DataClient {
    var autre : String;
    
    function DataClient(p_timer, p_nom, p_info, p_autre) {
    	DataNode.call(this, p_timer, p_nom, p_info);
    	autre = p_autre;
    }
    
    DataClient.prototype = new DataNode();
    DataClient.prototype.constructor = DataClient;
}*/


