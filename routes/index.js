var express = require('express');
var router = express.Router();
var config = require('./../config.json');


class users{
  constructor(occupiedSeats,totalSeats,violators){
    this.occupiedSeats = occupiedSeats;
    this.totalSeats = totalSeats;
    this.violators = violators;
  }
}

// cloud RTDB
var firebase = require("firebase");
firebase.initializeApp({
  // databaseURL: "https://ad-webapp-ee28e.firebaseio.com/"
  databaseURL: config.databaseURL
});

var dbRef = firebase.database().ref("users");



/* GET home page. */
router.get('/', function(req, res, next) {

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

        res.render('index',{js:'/javascripts/plot.js',
                            loc:'All Regions',
                            seatsOccupied:allLocation.occupiedSeats,
                            availableSeats:allLocation.totalSeats,
                            violators:allLocation.violators,
                            totalSeats:allLocation.totalSeats
                            });
        
})


});



function tester(cafeteria,res){

  
  dbRef.once('value').then(snap => {         
    cafeteria.violators=0;                 
    cafeteria.occupiedSeats = snap.numChildren()
    snap.forEach(function(childSnapshot){
      const isviolate = childSnapshot.val().isviolate;
      if(isviolate=='true'){
        cafeteria.violators++;
      }
    } )
    cafeteria.seatsocc = cafeteria.seatsOccupied
    
    return cafeteria.violators
    
})
}




// code for the dropdown
router.get('/cafe',function(req,res,next){
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
  res.render('index',{js:'/javascripts/plot.js',
  loc:'Cafeteria',
  seatsOccupied: cafeteria.occupiedSeats,
  availableSeats: cafeteria.totalSeats,
  totalSeats:cafeteria.totalSeats,
  violators:cafeteria.violators

});
})
});

router.get('/test',function(req,res,next){
  res.render('test');
});
module.exports = router;