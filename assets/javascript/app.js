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

    function currentTime() {
        var current = moment().format('LT');
        $("#currentTime").html(current);
        setTimeout(currentTime, 1000);
    };

    currentTime();

    // Initial Values
    var trainName = "";
    var destination = "";
    var frequency = 0;
    var firstTime = 0;


    // Capture Button Click
    $("#submit").on("click", function (event) {
        event.preventDefault();

        if ($("#trainName").val().trim() === "" ||
            $("#destination").val().trim() === "" ||
            $("#firstTime").val().trim() === "" ||
            $("#frequency").val().trim() === "") {

            alert("Please fill in all details to add new train");
        } else {

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
        }
    });



    // Firebase watcher
    database.ref().on("child_added", function (snapshot) {

        // storing the snapshot val and key
        var sv = snapshot.val();
        var key = snapshot.key;

        var newRow = $("<tr>");

        var nameData = $("<td class='align-middle'>");
        nameData.text(sv.trainName);

        var destinationData = $("<td class='align-middle'>");
        destinationData.text(sv.destination);


        //performing calculations to determine next train time and minutes left

        // First Time Converted
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        // Difference between first time and current time -- current time = moment() --
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % sv.frequency;

        // Minute Until Train
        var minutesLeft = sv.frequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(minutesLeft, "minutes").format("hh:mm a");


        // storing remaining snapshot.val() after calculations in variables
        var frequencyData = $("<td class='text-center align-middle'>");
        frequencyData.text(sv.frequency);

        var arrivalData = $("<td class='text-center align-middle'>");
        arrivalData.text(nextTrain);

        var minutesLeftData = $("<td class='text-center align-middle'>");
        minutesLeftData.text(minutesLeft);

        var remove = ($("<td class='text-center align-middle'><button class='remove btn btn-sm p-2 text-white font-weight-bold' style='background-color: #E29B65' data-key='" + key + "'>x</button></td>"));

        //appending new row
        newRow.append(nameData, destinationData, frequencyData, arrivalData, minutesLeftData, remove);
        $("tbody").append(newRow);

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $(document).on("click", ".remove", function () {
        keyref = $(this).attr("data-key");
        database.ref().child(keyref).remove();
        window.location.reload();
    });
});

//reloads the page every minute to refresh the next arrival time and number of minutes left
setInterval(function () {
    window.location.reload();
}, 60000);