var express = require('express');
var router = express.Router();

class holder{
    constructor(val){
        this.seats = val
    }
    set valv(x){
      this.seats = x
    }
}

const p = new holder();
// cloud RTDB
var firebase = require("firebase");
firebase.initializeApp({
  databaseURL: "https://rssicheck2.firebaseio.com/"
});

var dbRef = firebase.database().ref("UsersGlobal");
   dbRef.on("value", function(snapshot)
   {
       p.val = 0;
      var count =0;
    snapshot.forEach(function(childSnapshot){
        const isviolate=  childSnapshot.val().is_violate;
        console.log(isviolate);
        // console.log (childcount);
        if (isviolate=='true'){
         p.val++;

      }
      

    })
    p.valv = p.val
    console.log(p.val);
    console.log("seats",p.seats)
   })
