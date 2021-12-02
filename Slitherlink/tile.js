class Tile {
	constructor(x_, y_, r_, n = -1) {
		this.x = x_;
		this.y = y_;
		this.r = r_;
		this.num = n;
		this.points = [];
		for (let a = 30; a < 390; a += 60) {
			let v = createVector(this.x + this.r * cos(a), this.y + this.r * sin(a));
			this.points.push(v);
		}
		this.sides = [];
		for (let i = 0; i < 6; i++) {
			this.sides[i] = 0;
		}
	}

	show = function() {
		strokeWeight(2);
		for (let i = 0; i < 6; i++) {
			let v = this.points[i];
			let v1 = this.points[(i + 1) % 6];

			stroke(0);
			noFill();

			stroke(150);
			for (let j = 0.05; j <= 1; j += .2) {
				let p1 = createVector(lerp(v.x, v1.x, j), lerp(v.y, v1.y, j));
				let p2 = createVector(lerp(v.x, v1.x, j + 0.1), lerp(v.y, v1.y, j + 0.1));

				line(p1.x, p1.y, p2.x, p2.y);
			}
		}

		stroke(0);
		fill(0);
		if (this.num != -1) {
			text(this.num, this.x, this.y);
		}
	}

	assignState = function(v1, v2, state) {
		for (let i = 0; i < 12; i++) {
			if (i % 6 == 0) {
				let temp = v1;
				v1 = v2;
				v2 = temp;
			}

			if (this.points[i % 6].sub(v1) == 0 && this.points[(i + 1) % 6].sub(v2) == 0) {
				this.sides[i % 6] = state;
			}
		}
	}
}
