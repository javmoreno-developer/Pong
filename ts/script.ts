//movimiento jugador
$(document).keydown((e)=> {
    //40 abajo 38 arriba
    if(e.which == 40) {
        down($("#player_figure"));
    } else if (e.which == 38) {
        up($("#player_figure"));
    }
});

function down(param: any): boolean | void {
    //let heightBoard: number = $("#board").height() as number;
    let heightBoard: number = $("#board").height() as number;
    let bottomBoard: number = $("#board").position().top + heightBoard;

  

    let figureHeight = param.height() as number;
    let newPosition = (param.position().top + figureHeight)+ 20;
    if(newPosition < bottomBoard) {
        param.css("top", "+=20px");
        return false;
    } else {
        console.log("No bajas mas")
        return true;
    }
}

function up(param: any): boolean | void {
    //$("#board").position().top
    let newPosition = param.position().top - 20;
    if(newPosition > $("#board").position().top) {
        param.css("top", "-=20px");
        return true;
    } else {
        console.log("No subes mas");
        return false;
    }
}

//movimiento maquina
let intervalMachine;
let r: boolean | void = true;

window.onload=()=> {
    //loopMachine();
    setTimeout(()=> {
        startBall();
    },1000);
}

function loopMachine():void {
    intervalMachine = setInterval(()=> {
        if(r == true) {
            r = up($("#machine_figure"));
        } else {
            r = down($("#machine_figure"));
        }
    },1000);
}

//movimiento pelota
let orientacion = "inferior";
let turno = "usuario";

function startBall() {
    //$("#ball").toggleClass("start");
    setTimeout(()=> {
      colision($("#player_figure"));
    },3000);
}
let moveAni: any;

function stopInterval() {
    console.log("parando animacion");
    clearInterval(moveAni);
    let leftB = $("#ball").position().left;
    let topB = $("#ball").position().top;
    if(orientacion == "superior" && turno == "usuario") {
        $("#ball").css("top",topB-20);
        $("#ball").css("left",leftB+20);
    } else if(orientacion == "inferior" && turno == "usuario"){
        $("#ball").css("top",topB+20);
        $("#ball").css("left",leftB-20);
    } else {
        $("#ball").css("top",topB+20);
        $("#ball").css("left",leftB-20);
    }
}

let colisionRepe = false;

function moveBall(param: string) {
    let leftB = $("#ball").position().left;
    let topB = $("#ball").position().top;
    $("#ball").css("top",topB);
    $("#ball").css("left",leftB);
    $("#ball").removeClass("start");

    moveAni = setInterval(()=> {
        if(colisionRepe == false) {
            colisionMach();
        } else {
            
            colisionRepe = false;
        }

        if(turno == "maquina") {
            
            colision($("#player_figure"));
        }

       
        leftB = $("#ball").position().left;
        topB = $("#ball").position().top;

        //vemos si hay colision con el escenario (parte de abajo)
        let heightBoard: number = $("#board").height() as number;
        let bottomBoard: number = $("#board").position().top + heightBoard;
        if(topB >= bottomBoard - 20) {
            console.log("colision escenario abajo");
            stopInterval();
            oriBall();         
        } else if(topB <= $("#board").position().top) {
            console.log("colision escenario arriba");
            stopInterval();
            oriBall(); 
        } else {
            if(param == "superior" && turno == "usuario") {
                $("#ball").css("top",topB+20);
                $("#ball").css("left",leftB+20);
            } else if(param == "inferior" && turno == "usuario"){
                $("#ball").css("top",topB-20);
                $("#ball").css("left",leftB+20);
            } else if(param == "superior" && turno == "maquina") {
                $("#ball").css("top",topB-20);
                $("#ball").css("left",leftB-20);
            } else {
                $("#ball").css("top",topB+20);
                $("#ball").css("left",leftB-20);
            }
        }

        point();
        

    },300);
}

//orientacion de la pelota


function oriBall() {
    console.log("calculando orientacion");
    if(orientacion == "superior") {
        orientacion = "inferior";
    } else {
        orientacion = "superior";
    }
    moveBall(orientacion);
}

//colision de la pelota
function colision(param: any) {
    //console.log("analizando colision");
    let ballLeft2 = $("#ball").position().left;
    let playerLeft2 = param.position().left;
    let aux = playerLeft2 + 20;

    let ballTop2 = $("#ball").position().top;
    let playerTop2 = param.position().top;
    let aux2 = playerTop2 + 20;

    if(aux >= ballLeft2 && aux2 <= ballTop2) {
        console.log("colision");
        console.log("orientacion: "+orientacion);
        console.log("turno: "+turno);
        turno = "usuario";
        stopInterval()
        oriBall();
    } else {
        //console.log("no hay colision");
    }
}

//colision pelota con maquina
function colisionMach() {
    //console.log("diag colision machina");
    let ballLeft23 = $("#ball").position().left;
    let playerLeft23 = $("#machine_figure").position().left;
   
    let aux = playerLeft23 - 30;

    let ballTop23 = $("#ball").position().top;
    let playerTop23 = $("#machine_figure").position().top;
   
    let aux2 = playerTop23 - 30;

    if(aux <= ballLeft23 && aux2 <= ballTop23 ) {
        console.log(ballLeft23);
        console.log(playerLeft23);
        turno = "maquina";
        colisionRepe = true;
        console.log("colision");
        stopInterval();
        auxMach();
    } else {
        //console.log("no hay colision");
    }
}

function auxMach() {
    let leftB = $("#ball").position().left;
    let topB = $("#ball").position().top;
    if(orientacion == "superior") {
        $("#ball").css("top",topB-20);
        $("#ball").css("left",leftB+20);
    } else {
        $("#ball").css("top",topB-40);
        $("#ball").css("left",leftB+40);
    }   
    console.log(orientacion);//inferior
    oriBall();
}

//puntuar
let machineMark = 0;
let playerMark = 0;

function point() {
    let ballLeft = $("#ball").position().left;
    //vemos si ha puntuado el jugador
    let machineLeft = $("#machine_figure").position().left;
    if(ballLeft > machineLeft) {
        playerMark++;
        $("#machine_mark").text(playerMark);
        stopInterval();
        reboot();
    }
    //vemos si ha puntuado la maquina
    let playerLeft = $("#player_figure").position().left;
    if(ballLeft < playerLeft) {
        machineMark++;
        $("#player_mark").text(machineMark);
        stopInterval();
        reboot();
    }
}

function reboot() {
    $("#ball").css("top","30%");
    $("#ball").css("left","49.5%");
    startBall();
}