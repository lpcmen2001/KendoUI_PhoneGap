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

function msg()
{
    alert("logoClicked");
	    var src = "myrecording.amr";
        var mediaRec = new Media(src, onSuccess, onError);

        // Record audio
        mediaRec.startRecord();

        // Stop recording after 10 sec
        var recTime = 0;
        var recInterval = setInterval(function() {
            recTime = recTime + 1;
            setAudioPosition(recTime + " sec");
            if (recTime >= 10) {
                clearInterval(recInterval);
                mediaRec.stopRecord();
            }
        }, 1000);
}

    function onSuccess() {
        console.log("recordAudio():Audio Success");
    }
	
	function onError(error) {
        alert('code: '    + error.code    + '\n' + 
              'message: ' + error.message + '\n');
    }