//inicio
window.onload=()=> {
    //loopMachine();
    setTimeout(()=> {
     //moveBall(orientacion);
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
       // console.log("No bajas mas")
        return true;
    }
}

function up(param: any): boolean | void {
    let newPosition = param.position().top - 20;
    if(newPosition > $("#board").position().top) {
        param.css("top", "-=20px");
        return true;
    } else {
       // console.log("No subes mas");
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
    },500);
}


//movimiento pelota
let orientacion = "infIzq"; //infIzq,infDer,supIzq,supDer
let turno = "maquina";


let moveAni: any;

function stopInterval() {
    //console.log("parando animacion");
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
    },300);
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
        //console.log("colision jugador");
        change_orientacion();
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
        //console.log("colision maquina");
        change_orientacion();
    }
   
}

/**
 * change orientacion
 * cuando colisionas te envia aqui va a cambiar tu orientacion.
 */
function change_orientacion() {
    switch(orientacion) {
        case "infIzq":
                orientacion = "infDer";
            break;
            case "infDer":
                orientacion = "supDer";
            break;
            case "supIzq":
               orientacion = "infIzq";
            break;
            case "supDer":
               orientacion = "supIzq";
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
       // console.log("colision abajo");
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
       // console.log("colision arriba");
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
        //console.log("punto para el jugador");
        playerMark++;
        $("#player_mark").text(playerMark);
        stopInterval();
        setTimeout(()=> {
            reboot();
        },500)
    }
}

function point_machina() {
    let left_pelota = $("#ball")[0].getBoundingClientRect().left;
    let right_jugador = $("#machine_figure")[0].getBoundingClientRect().right;
    if(left_pelota >= right_jugador) {
       // console.log("punto para la maquina");
        machineMark++;
        $("#machine_mark").text(machineMark);
        stopInterval();
        setTimeout(()=> {
            reboot();
        },500)
    }
}

function reboot() {
    $("#ball").css("top","30%");
    $("#ball").css("left","49.5%");
    orientacion = "infIzq";
    moveBall(orientacion);
}