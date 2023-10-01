class LifeSquare extends fabric.Rect {
    setLife(alive) {
        this.alive = alive;
        this.flushColor();
    }

    live() {
        this.setLife(true);
    }

    die() {
        this.setLife(false);
    }

    liveordie(neighbors) {
        if (this.alive && (neighbors < 2 || neighbors > 3)) {
            return false;
        } 
        else if (!this.alive && neighbors === 3) {
            return true;
        } 
        else {
            return this.alive;
        }
    }

    flipState() {
        if (this.alive) this.die()
        else this.live()
    }

    setColor(color) {
        this.set("fill", color);
        if(!this.strokeBorder)
            this.set("stroke", color)
    }

    flushColor(mouseOn) {
        if (this.alive) {
            if (mouseOn) {
                this.setColor("red");
            }
            else {
                this.setColor("green");
            }
        }
        else {
            if (mouseOn) {
                this.setColor("lightgreen");
            }
            else {
                this.setColor("grey");
            }

        }
      

    }

    constructor(x, y, len) {
        super({
            left: x * len,
            top: y * len,
            width: len,
            height: len,
            fill: 'grey',
            selectable: false,
            hasControls: false,
            hasBorders: false
        });

        this.x = x;
        this.y = y;
        this.alive = false;

        this.strokeBorder = false;

        if (!this.strokeBorder) {
            this.set("stroke", "grey");
        }

        console.log(this);

        // Add hover event listener
        this.on('mouseover', function() {
            this.flushColor(true);
            canvas.renderAll();
        });

            // Add mouseout event listener
        this.on('mouseout', function() {
            this.flushColor(false);
            canvas.renderAll();
        });

        // Add click event listener
        this.on('mousedown', function() {
            this.flipState();
            this.flushColor(true);
            canvas.renderAll();
        });
    }
}

class LifeGrid {
    constructor(squareLen, Nx, Ny) {
        this.grid = [];
        this.gridBool = Array(Nx);
        this.Nx = Nx;
        this.Ny = Ny;
        // Create the grid of squares
        for (var i = 0; i < Nx; i++) {
            let row = [];
            for (var j = 0; j < Ny; j++) {
                var square = new LifeSquare(i, j, squareLen);
                row.push(square);
                canvas.add(square);
            }
            this.grid.push(row);
            this.gridBool[i] = Array(Ny).fill(false);
        }
    }

    getNeighbors (x, y, alive) {
        var neighbors = 0;
        for (var i = x-1; i <= x+1; i++) {
            if (i < 0 || i >= this.Nx) continue;
            for (var j = y-1; j <= y+1; j++) {
                if (j < 0 || j >= this.Ny) continue;
                if (this.grid[i][j].alive) {
                    neighbors++;
                }
            }
        }
        if (alive) neighbors--;
        return neighbors;
    }

    gridWriteback() {
        for (var i = 0; i < this.Nx; i++) {
            for (var j = 0; j < this.Ny; j++) {
                var Rect = this.grid[i][j];
                Rect.setLife(this.gridBool[i][j]);
            }
        }
    }

    killAll() {
        for (var i = 0; i < this.Nx; i++) {
            for (var j = 0; j < this.Ny; j++) {
                this.grid[i][j].die();
            }
        }
    }

    paintSplatter(pctg) {
        for (var i = 0; i < this.Nx; i++) {
            for (var j = 0; j < this.Ny; j++) {
                if ( pctg >= Math.floor(Math.random() * 101) ) {
                    this.grid[i][j].live();
                }
            }
        }
    }

    step() {
        for (var i = 0; i < this.Nx; i++) {
            for (var j = 0; j < this.Ny; j++) {
                var Rect = this.grid[i][j];
                var n = this.getNeighbors(i, j, Rect.alive);
                this.gridBool[i][j] = Rect.liveordie(n);
            }
        }
        this.gridWriteback();
    }


}

class LifeCanvas extends fabric.Canvas {
    constructor(squareLen) {
        var htmlCanvas = document.getElementById("canvas");

        var canvWidth = window.screen.width - 4*squareLen;
        var canvHeight = window.screen.height - 4*squareLen;

        console.log(`${[window.screen.width,window.screen.height]}`)

        var Nx = Math.floor(canvHeight / squareLen)
        var Ny = Math.floor(canvWidth / squareLen)

        htmlCanvas.height = Nx*squareLen;
        htmlCanvas.width = Ny*squareLen;

        super('canvas');

        this.Nx = Nx
        this.Ny = Ny


        this.hoverCursor = 'pointer';
        this.width = this.getWidth();
        this.height = this.getHeight();
        console.log(this.width)
        console.log(this.height)

        this.squareLen = squareLen;
    }

    step() {
        const startTime = new Date();
        this.grid.step();
        this.renderAll();
        const endTime = new Date;
        //var dstring = `${endTime.getMinutes()}:${endTime.getSeconds()}`
        //console.log(`${dstring} ${endTime-startTime}ms render ${this.Nx} by ${this.Ny} grid`)
    }

    addGrid() {
        var Nx = Math.floor(this.width / this.squareLen);
        var Ny = Math.floor(this.height / this.squareLen);
        this.grid = new LifeGrid(this.squareLen, Nx, Ny);
    }

    pauseAnimation() {
        clearTimeout(this.timeoutId)
    }


    run(delay) {
        this.timeoutId = setTimeout(()=>{
            this.step();
            this.run(delay);
        }, delay);
    }

    startAmimation(delay) {
        this.timeoutId = setTimeout(()=>{
            this.run(delay);
        }, Math.floor(2.5*delay))
    }
}

/*

// get total height for <header>, including padding
var headerEl = document.getElementById("header");
var headerHeight = +headerEl.offsetHeight;
var headerBoxShadow = window.getComputedStyle(headerEl).boxShadow;
var headerBoxShadowY = +headerBoxShadow.split("px")[2].trim();

// set margin-top to <form> depending on <header> height
var formEl = document.getElementById("form");
formEl.style.marginTop = headerHeight + headerBoxShadowY + 'px';

*/

var canvas = new LifeCanvas(30);
canvas.addGrid();
const stepButton = document.getElementById("step");
stepButton.onclick = () => {canvas.step()}
const runButton = document.getElementById("run");
runButton.onclick = () => {canvas.startAmimation(250)}
const clearButton = document.getElementById("clear");
clearButton.onclick = () => {canvas.grid.killAll(); canvas.renderAll()}
const randomButton = document.getElementById("random");
randomButton.onclick = () => {canvas.grid.paintSplatter(14); canvas.renderAll();}
const pauseButton = document.getElementById("pause")
pauseButton.onclick = () => {canvas.pauseAnimation()}