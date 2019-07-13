     $(document).ready(function () {
    
     var config = {
       apiKey: "AIzaSyCM3cXFDLDPqHbsHrK-XRLtsE7K0jpGRW8",
       authDomain: "gzahora-project.firebaseapp.com",
       databaseURL: "https://gzahora-project.firebaseio.com",
       projectId: "gzahora-project",
       storageBucket: "gzahora-project.appspot.com",
       messagingSenderId: "590877418606",
       appId: "1:590877418606:web:6d43922a15fb3a3d"
     };
    
     firebase.initializeApp(config);
    
    
     // Create a variable to reference the database.
     var database = firebase.database();
    
     // Initial Values
     var trainName = "";
     var destination = "";
     var frequency = 0;
     var firstTime = "";
    
    
     // Capture Button Click
     $("#submit").on("click", function (event) {
       event.preventDefault();
    
    
    
       // Grabbed values from text boxes
       trainName = $("#trainName").val().trim();
       destination = $("#destination").val().trim();
       frequency = $("#frequency").val().trim();
       firstTime = $("#firstTime").val().trim();
    
       // Code for handling the push
       database.ref().push({
         trainName: trainName,
         destination: destination,
         frequency: frequency,
         firstTime: firstTime,
         dateAdded: firebase.database.ServerValue.TIMESTAMP
       });
    
     });
    
    
     // Firebase watcher .on("child_added"
     database.ref().on("child_added", function (snapshot) {
       // storing the snapshot.val() in a variable for convenience
       var sv = snapshot.val();
    
    
       var newRow = $("<tr>");
       
       var nameData = $("<td>");
       nameData.text(sv.trainName);
    
       var destinationData = $("<td>");
       destinationData.text(sv.destination);
    
       var frequencyData = $("<td>");
       frequencyData.text(sv.frequency);      
        
       newRow.append(nameData, destinationData, frequencyData);
       $("tbody").append(newRow);
    
       // Console.loging the last user's data
       console.log(sv.trainName);
       console.log(sv.destination);
       console.log(sv.frequency);

    
       // Change the HTML to reflect
       $("#trainName-display").text(sv.trainName);
       $("#destination-display").text(sv.destination);
       $("#frequency-display").text(sv.frequency);
    
       // Handle the errors
     }, function (errorObject) {
       console.log("Errors handled: " + errorObject.code);
     });
    });