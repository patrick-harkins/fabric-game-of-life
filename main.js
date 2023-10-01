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

    constructor(x, y) {
        super({
            left: x * 50,
            top: y * 50,
            width: 50,
            height: 50,
            fill: 'grey',
            selectable: false,
            hasControls: false,
            hasBorders: false
        });

        this.x = x;
        this.y = y;
        this.alive = false;


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
    constructor(canvas, size) {
        this.grid = [];
        this.gridBool = Array(size);
        this.size = size;
        // Create the grid of squares
        for (var i = 0; i < size; i++) {
            let row = [];
            for (var j = 0; j < size; j++) {
                var square = new LifeSquare(i, j);
                row.push(square);
                canvas.add(square);
            }
            this.grid.push(row);
            this.gridBool[i] = Array(size).fill(false);;
        }
    }

    getNeighbors (x, y, alive) {
        var neighbors = 0;
        for (var i = x-1; i <= x+1; i++) {
            if (i < 0 || i >= this.size) continue;
            for (var j = y-1; j <= y+1; j++) {
                if (j < 0 || j >= this.size) continue;
                if (this.grid[i][j].alive) {
                    neighbors++;
                }
            }
        }
        if (alive) neighbors--;
        return neighbors;
    }

    gridWriteback() {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var Rect = this.grid[i][j];
                Rect.setLife(this.gridBool[i][j]);
            }
        }
    }

    step() {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var Rect = this.grid[i][j];
                var n = this.getNeighbors(i, j, Rect.alive);
                this.gridBool[i][j] = Rect.liveordie(n);
            }
        }
        this.gridWriteback();
        canvas.renderAll();
        console.log()
    }


}


var canvas = new fabric.Canvas('canvas');
canvas.hoverCursor = 'pointer';
var grid = new LifeGrid(canvas, 10);
const stepButton = document.getElementById("step");
stepButton.onclick = () => {grid.step()}