var express = require('express');
var router = express.Router();


class users{
  constructor(occupiedSeats,totalSeats,violators){
    this.occupiedSeats = occupiedSeats;
    this.totalSeats = totalSeats;
    this.violators = violators;
  }
}

// cloud RTDB
var firebase = require("firebase");
// firebase.initializeApp({
//   databaseURL: "https://ad-webapp-ee28e.firebaseio.com/"
// });

var dbRef = firebase.database().ref("users");



/* GET home page. */
router.get('/', function(req, res, next) {
    var objToday = new Date(),
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	dayOfWeek = weekday[objToday.getDay()],
	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return ""; a = parseInt((a + "").charAt(1)); return 1 == a ? "" : 2 == a ? "" : 3 == a ? "" : "" }(),
	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = months[objToday.getMonth()],
	curYear = objToday.getFullYear(),
	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
	curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
var today = curMonth + " " + dayOfMonth + ", " + curYear;
var timee = curHour + ":" + curMinute + " " + curMeridiem ;

  const allLocation = new users();
  allLocation.totalSeats = 100;
  allLocation.violators = 0;
  dbRef.once('value').then(snap => {                          
        allLocation.occupiedSeats = snap.numChildren()
        snap.forEach(function(childSnapshot){
          const isviolate = childSnapshot.val().isviolate;
          if(isviolate=='true'){
            allLocation.violators++;
          }
        })
        allLocation.availableSeats = allLocation.totalSeats - allLocation.occupiedSeats;

        res.render('home',{js:'/javascripts/plot.js',
                            loc:'All Regions',
                            seatsOccupied:allLocation.occupiedSeats,
                            availableSeats:allLocation.availableSeats,
                            violators:allLocation.violators,
                            totalSeats:allLocation.totalSeats,
                            dater: today,
                        timee:timee });
        
})


});





// code for the dropdown
router.get('/cafe',function(req,res,next){

    var objToday = new Date(),
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	dayOfWeek = weekday[objToday.getDay()],
	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return ""; a = parseInt((a + "").charAt(1)); return 1 == a ? "" : 2 == a ? "" : 3 == a ? "" : "" }(),
	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = months[objToday.getMonth()],
	curYear = objToday.getFullYear(),
	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
	curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
var today = curMonth + " " + dayOfMonth + ", " + curYear;
var timee = curHour + ":" + curMinute + " " + curMeridiem ;

  const cafeteria = new users(0,0,0);

  dbRef.once('value').then(snap => {

    cafeteria.totalSeats = 40;
    cafeteria.occupiedSeats = 0;
    cafeteria.violators = 0;

    snap.forEach(function(childSnapshot,req,res){
      const isviolate = childSnapshot.val().isviolate;
      const loc = childSnapshot.val().beaconLocation;
      if(loc=='cafeteria'){
        cafeteria.occupiedSeats++;
        if(isviolate=='true'){
          cafeteria.violators++;
         }
      }
    })

    cafeteria.availableSeats = cafeteria.totalSeats - cafeteria.occupiedSeats;
  res.render('home',{js:'/javascripts/plot.js',
  loc:'Cafeteria',
  seatsOccupied: cafeteria.occupiedSeats,
  availableSeats: cafeteria.availableSeats,
  totalSeats:cafeteria.totalSeats,
  violators:cafeteria.violators,
  dater: today,
  timee:timee 

});
})
});


module.exports = router;