// Declare global variables
var state = 0; // 0 record, 1 stop, 2 playback   
var src = "recording.wav"; // name of auio file
var mediaRec = null; // the object for recording and play sound
var directory = null; // holds a reference for directory reading

var app = {
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
		alert(device.platform);
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

// For this simple example we'll use the same file
function onClick() {
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
	src = "recording.apr";
	}
  mediaRec = new Media(directory.fullPath+"/"+src,
  // Success callback
  function() {
    console.log("mediaRec -> success");
  },
  // Error callback
  function(err) {
    console.log("mediaRec -> error: "+ err.code);
  });
  // Record audio
  mediaRec.startRecord();
}
 
function stopRecording() {
   console.log("stopRecording()");
   mediaRec.stopRecord();
}
 
function playRecording() {
  console.log("playRecording()");
  mediaRec.play();
}
 
function onFileSytemSuccess(fileSystem) {
  // Get the data directory, creating it if it doesn't exist.
  fileSystem.root.getDirectory("",{create:true},onDirectory,onError);
    if (getDevice() == "Android") {
	src = "recording.apr";
	}
  // Create the lock file, if and only if it doesn't exist.	
  fileSystem.root.getFile(src, {create: true, exclusive: false}, onFileEntry, onError);  
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
	src = "recording.apr";
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
 
/*var phoneCheck = {
	ios: ua.match(/(iphone|ipod|ipad)/i),
    blackberry: ua.match(/blackberry/i), // not used in this sample
    android: ua.match(/android/i),
    windows7: ua.match(/windows phone os 7.5/i) // not used in this sample
};*/

function getDevice() {
	return device.platform;
}

