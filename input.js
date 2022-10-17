const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    anykey: false
}

function keyboardEvent(event) {
    if (keys[event.code] !== undefined) {
	keys[event.code] = event.type === 'keydown';
	event.preventDefault();
	event.type === 'keydown' && (keys.anykey = true);
    }
}

addEventListener('keydown', keyboardEvent);
addEventListener('keyup', keyboardEvent);
