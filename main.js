// TODO: input buffering, curved joints instead of polys

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const CELL_SIZE = 20;

const SNAKE_POSITION = snapToGrid(width/2, height/2);
const SNAKE_VELOCITY = 1;
const SNAKE_COLOR = 'rgba(87, 176, 46, 1)';
const SNAKE_LENGTH = 5;
const SNAKE_DIRECTION = Direction.Right;

const SPEEDUP = .5;

const APPLE_COLOR = 'rgba(156, 10, 0, 1)';

class Segment {
    constructor(pos, dir) {
	this.pos = pos;
	this.dir = dir;
    }

    update(vel) {
        this.pos = this.pos.add(selectUnit(this.dir).mul(vel));
    }
}

class Snake {
    segments = [];
    movedBy = 0;

    constructor(pos, vel, color, length, newDir) {
	this.pos = pos;
	this.vel = vel;
	this.color = color;
	this.length = length;
	this.newDir = this.curDir = newDir;

	for (const i of range(length)) {
	    // create tail segments by manipulating unit vectors.
	    this.segments[i] = new Segment(
		pos.add(
		    selectUnit(this.curDir).
		    mul(-1).
		    mul(CELL_SIZE).
		    mul(i + 1)
		),
		this.curDir
	    );
	}
    }

    draw() {
	ctx.fillStyle = this.color;
	// draw the head.
	ctx.fillRect(
	    this.pos.x,
	    this.pos.y,
	    CELL_SIZE,
	    CELL_SIZE
	);

	// draw the tail.
	for (const i of range(this.length)) {
	    ctx.fillRect(
		this.segments[i].pos.x,
		this.segments[i].pos.y, 
		CELL_SIZE,
		CELL_SIZE
	    );
	}

	// draw poly joints.
	this.drawJoints(this, this.segments[0]);
	for (const i of range(this.length - 1)) {
	    this.drawJoints(this.segments[i], this.segments[i + 1]);
	}
    }

    update() {
	// change direction only when on grid.
	if (this.movedBy >= CELL_SIZE) {
	    // propagate new direction through the tail.
	    for (const i of range(this.segments.length - 1, 1).reverse()) {
		this.segments[i].dir = this.segments[i - 1].dir;
	    }
	    this.segments[0].dir = this.curDir;

	    this.curDir = this.newDir;
	    this.movedBy = 0;
	}

	// move the head.
	this.pos = this.pos.add(selectUnit(this.curDir).mul(this.vel));

	// move the tail.
	for (const i of range(this.length)) {
	    this.segments[i].update(this.vel);
	}

	// increase grid counter.
	this.movedBy += this.vel;
    }

    move() {
	if (keys.ArrowUp)    { this.newDir = Direction.Up; }
	if (keys.ArrowDown)  { this.newDir = Direction.Down; }
	if (keys.ArrowLeft)  { this.newDir = Direction.Left; }
	if (keys.ArrowRight) { this.newDir = Direction.Right; }
    }

    grow() {
	this.vel += SPEEDUP;

	this.length += 1;
	const lastSegmentIdx = this.segments.length - 1;
	const newSegment = new Segment(this.segments[lastSegmentIdx].pos, this.segments[lastSegmentIdx].dir);
	this.segments.push(newSegment);
    }

    collide(apple) {
	if (this.pos.distance(apple.pos) < CELL_SIZE) {
	    return true;
	} else {
	    return false;
	}
    }

    drawJoints(seg1, seg2) {
	ctx.beginPath();
	ctx.moveTo(seg1.pos.x, seg1.pos.y);
	ctx.lineTo(seg2.pos.x, seg2.pos.y);
	ctx.lineTo(seg2.pos.x + CELL_SIZE, seg2.pos.y + CELL_SIZE);
	ctx.lineTo(seg1.pos.x + CELL_SIZE, seg1.pos.y + CELL_SIZE);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(seg1.pos.x + CELL_SIZE, seg1.pos.y);
	ctx.lineTo(seg2.pos.x + CELL_SIZE, seg2.pos.y);
	ctx.lineTo(seg2.pos.x, seg2.pos.y + CELL_SIZE);
	ctx.lineTo(seg1.pos.x, seg1.pos.y + CELL_SIZE);
	ctx.closePath();
	ctx.fill();
    }
}

class Apple {
    constructor(pos, color = APPLE_COLOR) {
	this.pos = pos;
	this.color = color;
    }

    draw() {
	ctx.fillStyle = this.color;
	// draw the head.
	ctx.fillRect(
	    this.pos.x,
	    this.pos.y,
	    CELL_SIZE,
	    CELL_SIZE
	);
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

function snapToGrid(x, y) {
    return new Coordinate(closestMultiple(x, CELL_SIZE), closestMultiple(y, CELL_SIZE));
}

function generatePosition() {
    return snapToGrid(random(CELL_SIZE, width - CELL_SIZE), random(CELL_SIZE, height - CELL_SIZE));
}

canvas.style.imageRendering = 'pixelated';
ctx.imageSmoothingEnabled = false;
// ctx.translate(0.5, 0.5);

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    apple.draw();

    snake.move();
    snake.draw();
    snake.update();

    if (snake.collide(apple)) {
	apple = new Apple(generatePosition());
	snake.grow();
    }

    requestAnimationFrame(loop);
}

snake = new Snake(
    SNAKE_POSITION,
    SNAKE_VELOCITY,
    SNAKE_COLOR,
    SNAKE_LENGTH,
    SNAKE_DIRECTION);

// apple = new Apple(snapToGrid(width/2 + 5 * CELL_SIZE, height/2 - 5 * CELL_SIZE));
apple = new Apple(generatePosition());

canvas.addEventListener(
    'click',
    () => requestAnimationFrame(loop),
    { once: true });

// loop();
