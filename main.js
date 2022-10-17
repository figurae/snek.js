const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const SNAKE_POSITION = new Coordinate(width/2, height/2)
const SNAKE_VELOCITY = .5;
const SNAKE_COLOR = 'rgba(87, 176, 46, 1)'
const SNAKE_LENGTH = 5;
const SNAKE_DIRECTION = Direction.Right;
const SNAKE_SIZE = 20;

class Segment {
    constructor(pos) {
	this.pos = pos;
    }
}

class Snake {
    segments = [];

    constructor(pos, vel, color, length, direction) {
	this.pos = pos;
	this.vel = vel;
	this.color = color;
	this.length = length;
	this.direction = direction;

	for (const i of range(length)) {
	    // create tail segments by manipulating unit vectors.
	    this.segments[i] = new Segment(
		pos.add(
		    selectUnit(direction).
		    mul(-1).
		    mul(SNAKE_SIZE).
		    mul(i + 1)
		)
	    );
	}
    }

    draw() {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	// draw the head.
	ctx.fillRect(
	    this.pos.x - SNAKE_SIZE/2,
	    this.pos.y - SNAKE_SIZE/2,
	    SNAKE_SIZE,
	    SNAKE_SIZE
	);

	// draw the tail.
	for (const i of range(this.length)) {
	    ctx.fillRect(
		this.segments[i].pos.x - SNAKE_SIZE/2,
		this.segments[i].pos.y - SNAKE_SIZE/2, 
		SNAKE_SIZE,
		SNAKE_SIZE
	    );
	}
    }

    update() {
	

	// move the head.
	this.pos = this.pos.add(selectUnit(this.direction).mul(this.vel));

	// move the tail.
	for (const i of range(this.length)) {
	    this.segments[i].pos = this.segments[i].pos.add(selectUnit(this.direction).mul(this.vel));
	}
    }

    move() {
	if (keys.ArrowUp)    { this.direction = Direction.Up; }
	if (keys.ArrowDown)  { this.direction = Direction.Down; }
	if (keys.ArrowLeft)  { this.direction = Direction.Left; }
	if (keys.ArrowRight) { this.direction = Direction.Right; }
    }

    collide() {
    }
}

// generate a unit vector based on direction.
function selectUnit(direction) {
    switch(direction) {
        case Direction.Up:
	    return Unit.Up;
	case Direction.Down:
	    return Unit.Down;
        case Direction.Left:
	    return Unit.Left;
	case Direction.Right:
	    return Unit.Right;
    }
}

// canvas.style.imageRendering = 'pixelated';
ctx.imageSmoothingEnabled = false;
// ctx.translate(0.5, 0.5);

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    snake.move();
    snake.draw();
    snake.update();

    requestAnimationFrame(loop);
}

snake = new Snake(SNAKE_POSITION, SNAKE_VELOCITY, SNAKE_COLOR, SNAKE_LENGTH, SNAKE_DIRECTION);

canvas.addEventListener('click', () => requestAnimationFrame(loop), { once: true });
// loop();
