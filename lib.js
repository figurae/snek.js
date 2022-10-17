class Coordinate {
    constructor(x, y) {
	this.x = x;
	this.y = y;
    }

    add(coord) {
	return new Coordinate(this.x + coord.x, this.y + coord.y);
    }

    sub(coord) {
	return new Coordinate(this.x - coord.x, this.y - coord.y);
    }

    mul(num) {
	return new Coordinate(this.x * num, this.y * num);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function range(length, start = 0) {
    return [...Array(length).keys()].map(i => i + start);
}

const Direction = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
}

const Unit = {
    Up: new Coordinate(0, -1),
    Down: new Coordinate(0, 1),
    Left: new Coordinate(-1, 0),
    Right: new Coordinate(1, 0)
}
