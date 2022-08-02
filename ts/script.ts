
 //inicio
 let speed = 0;
 let speedMachine = 0;
 let level = 0;
 let pvp = false;

function startGame() {
    //obtengo los datos del formulario
    speed = $("#speed").val() as number;
    if($("#PVM").is(':checked')) {
        speedMachine = $("#speedMachine").val() as number;
        level = $("#level").val() as number;
        levelAsignation();
        loopMachine();
    } else {
        pvp = true;
        speedMachine = speed;
        level = 10;
        levelAsignation();
        pvp_game();
    }
    //empieza el juego
   
    setTimeout(()=> {
      moveBall(orientacion);
    },1000);
}
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
        return true;
    }
}

function up(param: any): boolean | void {
    let newPosition = param.position().top - 20;
    if(newPosition > $("#board").position().top) {
        param.css("top", "-=20px");
        return true;
    } else {
        return false;
    }
}

//movimiento maquina
let intervalMachine;
let r: boolean | void = true;

function loopMachine():void {
    intervalMachine = setInterval(()=> {
        if(r == true) {
            r = up($("#machine_figure"));
        } else {
            r = down($("#machine_figure"));
        }
    },speedMachine);
}


//movimiento pelota
let orientacion = "infIzq"; //infIzq,infDer,supIzq,supDer
let turno = "maquina";


let moveAni: any;

function stopInterval() {
    clearInterval(moveAni);
}

let colisionRepe = false;

function moveBall(param: string) {
    
    moveAni = setInterval(()=> {
        ///variables clave
        let leftB = $("#ball").position().left;
        let topB = $("#ball").position().top;

        ///vemos si hay colisiones
        //colisiones con el jugador
        player_colision();

        //colisiones con la maquina
        machine_colision();

        //colision borde abajo
        down_colision();

        //colision borde arriba
        top_colision();
        
        //vemos si hay que asignar puntuacion
        //player
        point_player();
        
        //maquina
        point_machina();

        //vemos el tipo de orientacion y movemos
        switch(orientacion) {
            case "infIzq":
                $("#ball").css("top",topB+10);
                $("#ball").css("left",leftB-10);
            break;
            case "infDer":
                $("#ball").css("top",topB+10);
                $("#ball").css("left",leftB+10);
            break;
            case "supIzq":
                $("#ball").css("top",topB-10);
                $("#ball").css("left",leftB-10);
            break;
            case "supDer":
                $("#ball").css("top",topB-10);
                $("#ball").css("left",leftB+10);
            break;
        }
    },speed);
}

/**
 * colision jugador
 * 1.left_pelota < right_jugador && left_pelota > left_jugador
 * 2.top_pelota <= bottom_jugador && top_pelota >= top_jugador
 * ||
 * bottom_pelota >= top_jugador && bottom_pelota <= bottom_jugador
 */
function player_colision() {
    let left_pelota = $("#ball")[0].getBoundingClientRect().left;
    let right_jugador = $("#player_figure")[0].getBoundingClientRect().right;
    let left_jugador = $("#player_figure")[0].getBoundingClientRect().left;
    let top_pelota = $("#ball")[0].getBoundingClientRect().top;
    let bottom_jugador = $("#player_figure")[0].getBoundingClientRect().bottom;
    let top_jugador = $("#player_figure")[0].getBoundingClientRect().top;
    let bottom_pelota = $("#ball")[0].getBoundingClientRect().bottom;

    if((left_pelota <= right_jugador && left_pelota >= left_jugador) && ((top_pelota <= bottom_jugador && top_pelota >= top_jugador) || (bottom_pelota >= top_jugador && bottom_pelota <= bottom_jugador)) ) {
        change_orientacion_aux();
    } 
}

/**
 * colision maquina
 * 1.right_pelota >= left_maquina && right_pelota <= rigth_maquina
 * 2.top_pelota <= bottom_maquina && top_pelota >= top_maquina
 * ||
 * bottom_pelota >= top_maquina && bottom_pelota <= bottom_maquina
 */

function machine_colision() {
    let right_pelota = $("#ball")[0].getBoundingClientRect().right;
    let left_maquina = $("#machine_figure")[0].getBoundingClientRect().left;
    let right_maquina = $("#machine_figure")[0].getBoundingClientRect().right;
    let top_pelota = $("#ball")[0].getBoundingClientRect().top;
    let bottom_maquina = $("#machine_figure")[0].getBoundingClientRect().bottom;
    let top_maquina = $("#machine_figure")[0].getBoundingClientRect().top;
    let bottom_pelota = $("#ball")[0].getBoundingClientRect().bottom;

    if((right_pelota >= left_maquina && right_pelota <= right_maquina) && ((top_pelota <= bottom_maquina && top_pelota >= top_maquina) || (bottom_pelota >= top_maquina && bottom_pelota <= bottom_maquina))) {
        change_orientacion_aux();
    }
   
}

/**
 * change orientacion
 * cuando colisionas te envia aqui va a cambiar tu orientacion.
 */

//machine and player figure
function change_orientacion_aux() {
    switch(orientacion) {
        case "infIzq":
            orientacion = "infDer";
        break;
        case "infDer":
            orientacion = "infIzq";
        break;
        case "supIzq":
            orientacion = "supDer";
        break;
        case "supDer":
            orientacion = "supIzq";
        break;
    }
}
//borders
function change_orientacion() {
    switch(orientacion) {
        case "infIzq":
                orientacion = "supIzq";
            break;
            case "infDer":
                orientacion = "supDer";
            break;
            case "supIzq":
               orientacion = "infIzq";
            break;
            case "supDer":
               orientacion = "infDer";
            break;
    }
} 

/**
 * colision borde abajo
 * 1.bottom_pelota >= bottom_board
 */

function down_colision() {
    let bottom_pelota = $("#ball")[0].getBoundingClientRect().bottom;
    let bottom_board = $("#board")[0].getBoundingClientRect().bottom;
    
    if(bottom_pelota >= bottom_board) {
        change_orientacion();
    }
}

/**
 * colision border arriba
 * 1.top_pelota <= top_board
 */
function top_colision() {
    let top_pelota = $("#ball")[0].getBoundingClientRect().top;
    let top_board = $("#board")[0].getBoundingClientRect().top;

    if(top_pelota <= top_board) {
        change_orientacion();
    }
}

/**
 * Point -> asignar puntuacion
 * player
 * 1.right_pelota <= left_jugador
 * machina
 * 2.left_pelota >= right_jugador
 */
 let machineMark = 0;
 let playerMark = 0;
 
function point_player() {
    let right_pelota = $("#ball")[0].getBoundingClientRect().right;
    let left_jugador = $("#player_figure")[0].getBoundingClientRect().left;
    if(right_pelota <= left_jugador) {
        playerMark++;
        $("#player_mark").text(playerMark);
        stopInterval();
        setTimeout(()=> {
            reboot();
        },500);
        if(playerMark >= 1) {
            endgame(1);
        }
    }
}

function point_machina() {
    let left_pelota = $("#ball")[0].getBoundingClientRect().left;
    let right_jugador = $("#machine_figure")[0].getBoundingClientRect().right;
    if(left_pelota >= right_jugador) {
        machineMark++;
        $("#machine_mark").text(machineMark);
        stopInterval();
        setTimeout(()=> {
            reboot();
        },500);
        if(machineMark >= 1) {
            endgame(0);
        }
    }
}

function reboot() {
    $("#ball").css("top","30%");
    $("#ball").css("left","49.5%");
    orientacion = "infIzq";
    moveBall(orientacion);
}

function endgame(param: number) {
    if(param == 0) {
        if(pvp == true) {
            alert("gano el jugador 1");
        } else {
            alert("ganaste");
        }
    } else {
        if(pvp == true) {
            alert("gano el jugador 2");
        } else {
            alert("gano la maquina");
        }
    }

    window.location.reload();
}

/**
 * Responsive
 */
let move = true;
let start = 0;
$(document).on("touchstart",(e)=> {
    let touch = e.targetTouches[0]; 
    start = touch.pageY;
});

 $(document).on("touchmove",(e)=> {

     
     if(move) {
        let touch = e.targetTouches[0]; 
        if(touch.pageY < start) {
            up($("#player_figure"));
        } else {
            down($("#player_figure"));
        }
        move = false;
    }
    setTimeout(()=> {
        move=true;
    },500);

 });


 //opciones del menu
 //PVP vs PVM
 $("#PVP").click(()=> {
    if($("#PVM").is(':checked')) {
        $("#PVM").prop("checked", false);
    }
    $("#toggle_options").css("display","none");
    $("#toggle_pvp").css("display","flex");
});

$("#PVM").click(()=> {
    if($("#PVP").is(':checked')) {
        $("#PVP").prop("checked", false);
    }
    $("#toggle_pvp").css("display","none");
    $("#toggle_options").css("display","flex");
 });

 //confirm
 $("#confirm").click(()=> {
    if($("#PVP").is(':checked') || $("#PVM").is(':checked')) {
        $("#menu").css("opacity","0");
        startGame();
        setTimeout(()=> {
            $("#menu").css("display","none");
        },1000);
    }
 });

 //levelAsignation
function levelAsignation() {
    $("#machine_figure").css("height",`${level}%`);
   
}

//controles pj2
function pvp_game() {
    //s = 83 w = 87
    $(document).keydown((e)=> {
        if(e.which == 83) {
            down($("#machine_figure"));
        } else if(e.which == 87) {
            up($("#machine_figure"));
        }
    });
}
