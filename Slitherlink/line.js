class Line {
	constructor(x1, y1, x2, y2) {
		this.points = [];
		this.points.push(createVector(x1, y1));
		this.points.push(createVector(x2, y2));
		this.color = 60 * floor(random(0, 6));
	}


	show = function() {
		colorMode(HSB);

		stroke(this.color, 100, 100);
		strokeWeight(4);
		for (let i = 0; i < this.points.length - 1; i++) {
			line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
		}

		colorMode(RGB);
	}

	combine = function(index) {
		for (let i = index + 1; i < lines.length; i++) {
			for (let j = 0; j < 4; j++) {
				let thisPoint = (j < 2) ? 0 : this.points.length - 1;
				let otherPoint = (j % 2 == 0) ? 0 : lines[i].points.length - 1;

				if (dist(this.points[thisPoint].x, this.points[thisPoint].y, lines[i].points[otherPoint].x, lines[i].points[otherPoint].y) < 0.001) {
					let a1 = [], a2 = [];
					if (j < 2) {
						a1 = lines[i].points;
						a2 = this.points;
					} else {
						a1 = this.points;
						a2 = lines[i].points;
					}

					if (j == 0) {
						a1.reverse();
					}

					if (j == 3) {
						a2.reverse();
					}

					a2.splice(0, 1);

					this.points = a1.concat(a2);
					lines.splice(i, 1);

					return true;
				}
			}
		}

		return false;
	}
}
