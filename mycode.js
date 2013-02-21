var recordFileName = "recording.wav";
var recordedPath = null;
var mediaVar = null;
var my_media = null;

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
        //confirm("Is that working");
        //console.log("this is a console log");
        //alert("This is an alert");
        //var userAge = prompt("What is your age ?");
		console.log("File system requested !");
		//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function success(){}, function fail(){});
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

/*
var gotFS = function (fileSystem) {
    fileSystem.root.getFile("blank.wav",
        { create: true, exclusive: false }, //create if it does not exist
		gotFile,function fail() {}
		
		
        function success(entry) {
            var src = entry.toURI();
            console.log(src); //logs blank.wav's path starting with file://
        },
		
		
		
        
    );
};
*/

var getRecordSrc = function() {
	var fsFail = function(error){
		alert("fsFail");
		console.log("error creating file for recording");
	};
	var gotFile = function(file){
		alert("gotFile");
		//recordSrc = file.fullPath;
		mediaVar = new Media(file.fullPath, launchRecord, onError);
		recordedPath = file.fullPath;
		alert("leavingGotFile");
		launchRecord();
		//recordSrc = file.toURI();
		//console.log("recording Src: " + recordSrc);
	};
	var gotFS = function(fileSystem){
	alert("gotFS");
	fileSystem.root.getFile(recordFileName, {create: true, exclusive: false}, gotFile, fsFail);
	};
	
	var launchRecord = function(){
    mediaVar.startRecord();
    // Stop recording after 10 sec
    var recTime = 0;
    var recInterval = setInterval(function() {
        recTime = recTime + 1;
        if (recTime >= 3) {
            clearInterval(recInterval);
            mediaVar.stopRecord();
			alert("End of the recording");
        }
    }, 1000);
	//mediaVar.play();
	//playAudio("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
	playAudio(recordedPath);
	};
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fsFail);
};

var playAudio = function(src) {
            if (my_media == null) {
                // Create Media object from src
                my_media = new Media(src, onSuccess, onError);
            } // else play current audio
            // Play audio
            my_media.play();

         };

/*
 var manageFiles = function () {
                //first create the file
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                    fileSystem.root.getFile(recordFileName, {
                        create: true,
                        exclusive: false
                    }, function(fileEntry){
                        log("File " + recordFileName + " created at " + fileEntry.fullPath);
                        mediaVar = new Media(fileEntry.fullPath, function(){
                            log("Media created successfully");
                        }, onError, mediaStatusCallback); //of new Media
                        onMediaCreated();
                    }, onError); //of getFile
                }, onError); //of requestFileSystem
            };
*/



var record = function() {

	alert("touched");
    //var src = "blank.wav";
	var none = getRecordSrc();
	//manageFiles();
    //mediaVar = new Media(src, onSuccess, onError);

    // Record audio

};



    function onSuccess() {
        console.log("recordAudio():Audio Success");
		alert("Record success!");
    }
	
	function onError(error) {
        alert("Fail" + 'code: '    + error.code    + '\n' + 
              'message: ' + error.message + '\n');
    }