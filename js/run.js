const COLORES = {
  rojo: 'rojo',
  verde: 'verde',
  azul: 'azul',
  amarillo: 'amarillo',
  naranja: 'naranja',
  rosa: 'rosa',
  azulClaro: 'azulClaro'
}
var musica = new Audio ('assets/music/tetris_gameboy.mp3');
  musica.volume = 0.1;
  musica.loop = true;
  musica.play();

var scoreDisplay = document.querySelector('#score')

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const modal = document.getElementById("myModal");
const instructionsButton = document.getElementById("instructions");
const span = document.getElementsByClassName("close")[0];

const TIPOS_PIEZAS = [
  {
    tipo: "O",
    pos: [{ x: 7, y: 0 }, { x: 8, y: 0 }, { x: 7, y: 1 }, { x: 8, y: 1 }]
  },
  {
    tipo: "I",
    pos: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }]
  },
  {
    tipo: "Z",
    pos: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }]
  },
  {
    tipo: "S",
    pos: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }]
  },
  {
    tipo: "T",
    pos: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 1 }, { x: 2, y: 1 }]
  },
  {
    tipo: "L",
    pos: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }]
  },
  {
    tipo: "J",
    pos: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }]
  },
]

function Pieza() {
  this.tipo = JSON.parse(JSON.stringify(TIPOS_PIEZAS[Math.floor(Math.random()*7)]));

}

Pieza.prototype.generarPiezaAleatorio

Pieza.prototype.movimientoAutomatico = function () {
  this.tipo.pos.forEach(pos => {
    pos.y++
  })
}
Pieza.prototype.abajo = function () {
  this.tipo.pos.forEach(pos => {
    var movimiento = true
    var celdaSiguenteAbajo = document.querySelector(`.row${pos.y} .col${pos.x}`)
    if (celdaSiguenteAbajo.classList.contains('tetromino')) {
      movimiento = false
      game.fijarPiezaTablero()
      game.pieces.pop()
      game.pieces.push(new Pieza() )
    }
    if (movimiento) {
      pos.y++
    }

  })
}
Pieza.prototype.derecha = function () {
  this.tipo.pos.forEach(pos => {
    var celdaSiguenteDerecha = document.querySelector(`.row${pos.y} .col${pos.x}`)
    var movimiento = true
    if (celdaSiguenteDerecha.classList.contains('tetromino')) {
      movimiento = false
    } else {
      movimiento = true
    }

    if (movimiento) {
      pos.x++
    }

  })
}
Pieza.prototype.izquierda = function () {
  this.tipo.pos.forEach(pos => {
    pos.x--
  })
}

function Game() {
  this.velocidadJuego = 8
  this.filasTabla = 26
  this.columnasTabla = 16
  this.timerId = null;
  this.pieces = [];
  this.score = 0;

  this.crearTabla = function () {
    
      for (let i = 0; i < this.filasTabla; i++) {
        let filaActual = document.getElementById('tablero').insertRow(i)
        filaActual.classList.add(`row${i}`)
        for (let j = 0; j < this.columnasTabla; j++) {
          let celda = filaActual.insertCell(j)
          celda.classList.add(`col${j}`)
        }
      }
  }
  
  this.monitorizarFilas = function () {
    for (let i = 25; i > 0; i--) {

      const fila = Array.from(document.querySelectorAll(`.row${i} td`))
      
      const filaCompleta = fila.every(cell => {
        return cell.classList.contains('tetromino')
      })

      if (filaCompleta) {
        this.score += 10
        scoreDisplay.innerHTML = `${this.score}`
        
        for (let j = i; j > 0; j--) {
          // Copio j-1  en j 
          for (let k = 0; k < 16; k++) {
            const elemAbajo = document.querySelector(`.row${j} > .col${k}`)
            const elemArriba = document.querySelector(`.row${j - 1} > .col${k}`)
            if (elemArriba.classList.contains('tetromino')) {
              elemAbajo.classList.add('tetromino')
            } else {
              elemAbajo.classList.remove('tetromino')
              
            }
          }
        }
        return this.monitorizarFilas()
      }
    }
  }

  this.limpiaTabla = function () {
    document.querySelectorAll('.pieza').forEach(function (elem) {
      elem.classList.remove('pieza')
    })
  }

  //cambia la clase de tetro a nada
  this.moverFila = function (fila, numFila) {
    var cols = fila.querySelectorAll("td");

    cols.forEach((e, idx) => {
      if (e.classList.contains('tetromino')) {
        e.classList.remove('tetromino')
        document.querySelector(`.row${numFila + 1} > .col${idx}`).classList.add('tetromino')
      }
    })
  }

  this.pintaPiezas = function () {
    this.pieces.forEach(pieza => {
      pieza.tipo.pos.forEach(pos => {
        if (pos.y <= this.filasTabla) {
          var casilla = document.querySelector(`.row${pos.y} .col${pos.x}`)
          casilla.classList.add('pieza')
        }
      })
    })
  }

  this.checkBottom = function (pieza) {
    return (pieza.tipo.pos[0].y < 25
      && pieza.tipo.pos[1].y < 25
      && pieza.tipo.pos[2].y < 25
      && pieza.tipo.pos[3].y < 25)
  }

  this.fijarPiezaTablero = function () {
    var posicionPieza = document.querySelectorAll('.pieza')
    posicionPieza.forEach(e => {
      e.classList.remove('pieza')
      e.classList.add('tetromino')
    })
  }

  this.checkTetromino = function (pieza) {
    pieza.tipo.pos.forEach(pos => {
      var celdaSiguente = document.querySelector(`.row${pos.y} .col${pos.x}`)
      if (celdaSiguente.classList.contains('tetromino')) {
        this.fijarPiezaTablero()
        this.pieces.pop()
        this.pieces.push(new Pieza())
      }
    })
  }

    this.gameOver = function(){
     var row1 = document.querySelectorAll(`.row0 td`)
     row1.forEach(e=> {
        if(e.classList.contains('tetromino')){
          console.log("gameOver")
          window.clearInterval(this.timerId)
          var gameOverText = document.getElementById("gameOver")
          gameOverText.style.display = "block"
          var closeButton = document.getElementsByClassName("close2")[0];
          closeButton.addEventListener("click", () => {
            gameOverText.style.display = "none";
          });
        }
     })
    }
  this.movePiezas = function () {
    this.pieces.forEach(pieza => {
      /* switch (pieza.tipo.tipo) {
         case "O":
           pieza.classList.add(COLORES.rojo)
           break;
         case "I" :
           pieza.classList.add(COLORES.verde)
         break
         case "Z" :
           pieza.classList.add(COLORES.azul)
         break
         case "S" :
           pieza.classList.add(COLORES.amarillo)
         break
         case "T" :
           pieza.classList.add(COLORES.naranja)
         break
         case "L" :
           pieza.classList.add(COLORES.rosa)
         break
         case "J" :
           pieza.classList.add(COLORES.azulClaro)
         break
        
       }*/
      if (this.checkBottom(pieza)) {
        pieza.movimientoAutomatico()
        this.checkTetromino(pieza)
      } else {
        this.fijarPiezaTablero()
        this.pieces.pop()
        this.pieces.push(new Pieza())
      }
    })
  }

  this.movePiece = function (dir) {
    const piezaActual = this.pieces[0]

    switch (dir) {
      case 'ArrowLeft':
        if (piezaActual.tipo.pos[0].x > 0
          && piezaActual.tipo.pos[1].x > 0
          && piezaActual.tipo.pos[2].x > 0
          && piezaActual.tipo.pos[3].x > 0) {
          piezaActual.izquierda();
        }
        break;
      case 'ArrowRight':
        if (piezaActual.tipo.pos[0].x < 15
          && piezaActual.tipo.pos[1].x < 15
          && piezaActual.tipo.pos[2].x < 15
          && piezaActual.tipo.pos[3].x < 15) {

          piezaActual.derecha();
        }
        break;
      case 'ArrowDown':
        if (piezaActual.tipo.pos[0].y < 25
          && piezaActual.tipo.pos[1].y < 25
          && piezaActual.tipo.pos[2].y < 25
          && piezaActual.tipo.pos[3].y < 25) {
          piezaActual.abajo();
        }
        break;
    }
  }

  this.borrarTabla = function(){

    for (let i = 0; i < this.filasTabla; i++) {
      
      let filaActual = document.getElementById('tablero').insertRow(i)
      filaActual.classList.add(`row${i}`)
      for (let j = 0; j < this.columnasTabla; j++) {
        let celda = filaActual.insertCell(j)
        celda.classList.add(`col${j}`)
      }
      
    }
  }
  this.start = function () {
    this.crearTabla()
    //Pasa la copia del array TIPOS_PIEZAS
    this.pieces.push(new Pieza())
    this.timerId = setInterval(() => {
      this.updateGame();
    }, 1000 / this.velocidadJuego);
  }

  this.reiniciar = function(){
    var todo = document.querySelectorAll('td')
    var divGameOver = document.querySelector('.gameOver')
    divGameOver.setAttribute('hidden','')
    todo.forEach(e=>  {
      e.classList.remove('tetromino')
    })
      this.pieces.pop()
      this.pieces.push(new Pieza())

      this.timerId = setInterval(() => {
        this.updateGame();
      }, 1000 / this.velocidadJuego);
  }

  this.updateGame = function () {
    this.limpiaTabla()
    this.monitorizarFilas()
    this.pintaPiezas()
    this.movePiezas()
    this.gameOver()

  }
}
const game = new Game()
game.start()
game.gameOver()

document.addEventListener('keydown', function (tecla) {
  if (['ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(tecla.code)) {
    game.movePiece(tecla.code)
  }
})
startButton.addEventListener("click", () => {
});

resetButton.addEventListener("click", () => {
  location.reload();
});

instructionsButton.addEventListener("click", () => {
  modal.style.display = "block";
});

span.addEventListener("click", () => {
  modal.style.display = "none";
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};