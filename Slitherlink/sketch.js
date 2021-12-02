const size = 0;

let tiles = [];
let lines = [];
let points = [];
let cursor = 0;

let l;
let r;

function setup() {
	createCanvas(800, 800);

	let s;
	switch (size) {
		case 0:
			s = 6;
			textSize(52);
			break;
		case 1:
			s = 10;
			textSize(40);
			break;
		case 2:
			s = 18;
			textSize(28);
			break;
		case 3:
			s = 24;
			textSize(20);
			break;
	}

	angleMode(DEGREES);
	textAlign(CENTER, CENTER);

	r = width / s;
	l = r / sqrt(3);
	let anchor = createVector((width / 2) + r * (s - 2) / 2 * cos(-120), (height / 2) + r * (s - 2) / 2 * sin(-120));

	for (let layer = 0; layer < s - 1 ; layer++) {
		let middle = (s / 2) - 1;
		for (let num = 0; num < s - 1 - abs(layer - middle); num++) {
			let t = new Tile(anchor.x + num * r, anchor.y, l, -1);
			tiles.push(t);
		}

		if (layer >= middle) {
			anchor.add(createVector(width / s * cos(60), height / s * sin(60)));
		} else {
			anchor.add(createVector(width / s * cos(120), height / s * sin(120)));
		}
	}

	for (let i = 0; i < tiles.length; i++) {
		for (let j = 0; j < tiles[i].points.length; j++) {
			let exists = false;
			for (let k = 0; k < points.length; k++) {
				if (dist(points[k].x, points[k].y, tiles[i].points[j].x, tiles[i].points[j].y) < 0.001) {
					exists = true;
					break;
				}
			}

			if (!exists) {
				points.push(createVector(tiles[i].points[j].x, tiles[i].points[j].y));
			}
		}
	}
	show();
}

function mousePressed() {
	let inRange = false;
	let index;
	for (index = 0; index < tiles.length; index++) {
		if (dist(mouseX, mouseY, tiles[index].x, tiles[index].y) < r * 0.4) {
			inRange = true;
			break;
		}
	}

	if (inRange) {
		cursor = index;
	} else {
		let d1 = Infinity;
		let p1 = createVector(0, 0);
		let d2 = Infinity;
		let p2 = createVector(0, 0);

		for (let i = 0; i < points.length; i++) {
			let d = dist(mouseX, mouseY, points[i].x, points[i].y);
			if (d < d1) {
				d1 = d;
				p1 = createVector(points[i].x, points[i].y);
			}
		}

		for (let i = 0; i < points.length; i++) {
			if (dist(points[i].x, points[i].y, p1.x, p1.y) < 0.001) {
				continue;
			}
			let d = dist(mouseX, mouseY, points[i].x, points[i].y);
			if (d < d2) {
				d2 = d;
				p2 = createVector(points[i].x, points[i].y);
			}
		}

		if (dist(p1.x, p1.y, p2.x, p2.y) < l + 0.001) {

			if (mouseButton == "left") {
				lines.push(new Line(p1.x, p1.y, p2.x, p2.y));
			}

			for (let i = 0; i < tiles.length; i++) {
				tiles[i].assignState(p1, p2, (mouseButton == "left") ? 1 : -1);
			}

			let combined = true;
			while (combined) {
				combined = false;
				quickSort(0, lines.length - 1);

				for (let i = 0; i < lines.length; i++) {
					if (lines[i].combine(i)) {
						combined = true;
						break;
					}
				}
			}
			show();
		}
	}
}

function keyPressed() {
	if (key >= 0 && key <= 5) {
		tiles[cursor].num = key;
	}

	if (keyCode == BACKSPACE) {
		tiles[cursor].num = -1;
	}

	show();
}

function quickSort(start, end) {
	if (start >= end) {
		return;
	}

	let pivotIndex = findPivot(start, end);

	quickSort(start, pivotIndex - 1);
	quickSort(pivotIndex + 1, end);
}

function findPivot(start, end) {
	let pivotValue = lines[end].points.length;
	let pivotIndex = start;

	for (let i = start; i < end; i++) {
		if (lines[i].points.length > pivotValue) {
			swap(i, pivotIndex);
			pivotIndex++;
		}
	}

	return pivotIndex;
}

function swap(a, b) {
	let temp = lines[a];
	lines[a] = lines[b];
	lines[b] = temp;
}

function show() {
	background(245);
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].show();
	}

	stroke(0);
	fill(0);
	for (let i = 0; i < points.length; i++) {
		ellipse(points[i].x, points[i].y, l * 0.1);
	}

	for (let i = 0; i < lines.length; i++) {
		lines[i].show();
	}
}
