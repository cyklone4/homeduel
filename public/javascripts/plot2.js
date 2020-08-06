function refresh(totalSeats,totalCount,totalViolators) {
    var totalseats = totalSeats;
    var totalcount =  totalCount;
    //initializing big cirlce
    var canvas = document.getElementById("canvas2");
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = 0.8;
    var containerR = 200;
    canvas.width = canvas.height = containerR * 2;
    // canvas.style["border-radius"] = containerR + "px";
    
    ctx.clearRect(0,0,400,400);

    var radius = 7;
    for(i = 0; i< totalCount - totalViolators; i++){
        var x = Math.floor(Math.random()*300);  
        var y = Math.floor(Math.random()*300);
        ctx.beginPath();
          ctx.arc(x,y,radius,Math.PI*2,0,false);
          ctx.fillStyle = "green";
          ctx.fill();
          ctx.closePath(); 
    }
    for(i = 0;i<totalViolators;i++){
        var x = Math.floor(Math.random()*300);  
        var y = Math.floor(Math.random()*300);
        ctx.beginPath();
          ctx.arc(x,y,radius,Math.PI*2,0,false);
          ctx.fillStyle = "red";
          ctx.fill();
          ctx.closePath(); 
          console.log("i've plotted the violators")
    }
       var Freeseats = totalSeats - totalCount;
       if(Freeseats==5)
       {
           alert('distancing breached');
        }

    }
