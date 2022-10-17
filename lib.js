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

    distance(that) {
	const dx = this.x - that.x;
	const dy = this.y - that.y;
	return Math.hypot(dx, dy);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function range(length, start = 0) {
    return [...Array(length).keys()].map(i => i + start);
}

function closestMultiple(target, num) {
    if (num > target) {
	return num;
    }
    
    target = target + parseInt(num / 2, 10);
    return target - (target % num);
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
