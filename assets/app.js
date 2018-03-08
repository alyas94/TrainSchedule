var config = {
    apiKey: "AIzaSyDBh0AHFNCapA3dRtAIoImRFP8UVAG_emo",
    authDomain: "firestation-daf13.firebaseapp.com",
    databaseURL: "https://firestation-daf13.firebaseio.com",
    projectId: "firestation-daf13",
    storageBucket: "firestation-daf13.appspot.com",
    messagingSenderId: "198590382604"
};
firebase.initializeApp(config);

var database = firebase.database();
var trainName, destination, firstTime, frequency, minsAway;
var arrival;

$("#add-train").on("click", function () {
    event.preventDefault();
    trainName = $("#name").val().trim();
    console.log(trainName);
    destination = $("#destination").val().trim();
    firstTime = $("#time").val().trim();
    frequency = $("#frequency").val().trim();
    calculateTimes();
});

function calculateTimes() {
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var time = moment();
    console.log("CURRENT TIME: " + moment(time).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    minsAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minsAway);

    // Next Train
    arrival = moment().add(minsAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(arrival).format("hh:mm"));
    arrival = moment(arrival).format("hh:mm");

    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        arrival: arrival,
        minsAway: minsAway,
        firstTime: firstTime
    };
    console.log(newTrain);
    //push the input to database
    database.ref().push(newTrain);
};


database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTime);
    console.log(snapshot.val().arrival);
    console.log(snapshot.val().frequency);
    console.log(snapshot.val().minsAway);

    $("#current-train").append("<tbody>");
    $("#current-train").append("<tr>");

    $("#current-train").append("<td>" + snapshot.val().trainName + "</td>");
    $("#current-train").append("<td>" + snapshot.val().destination + "</td>");
    $("#current-train").append("<td>" + snapshot.val().frequency + "</td>");
    $("#current-train").append("<td>" + snapshot.val().arrival + "</td>");
    $("#current-train").append("<td>" + snapshot.val().minsAway + "</td>");

    $("#current-train").append("</tbody>");
    $("#current-train").append("</tr>");
});

