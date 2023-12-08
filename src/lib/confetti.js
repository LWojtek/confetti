class Confetto {
	constructor(colors, canvas, coordinates, dimensions, horizontalBurstRange, verticalBurstRange) {
		this.colors = colors;
		this.canvas = canvas;
		this.coordinates = coordinates;
		this.horizontalBurstPosition = coordinates.x;
		this.verticalBurstPosition = coordinates.y;
		this.horizontalBurstRange = horizontalBurstRange;
		this.verticalBurstRange = verticalBurstRange;

		this.randomModifier = this.randomRange(0, 99);
		this.color = colors[Math.floor(this.randomRange(0, colors.length))];

		this.dimensions = {
			width: Array.isArray(dimensions.width)
				? this.randomRange(dimensions.width[0], dimensions.width[1])
				: dimensions.width,
			height: Array.isArray(dimensions.height)
				? this.randomRange(dimensions.height[0], dimensions.height[1])
				: dimensions.height,
		};

		this.position = {
			x: this.randomRange(
				canvas.width * this.horizontalBurstPosition,
				canvas.width * this.horizontalBurstPosition,
			),
			y: this.randomRange(
				canvas.height * this.verticalBurstPosition,
				canvas.height * this.verticalBurstPosition,
			),
		};
		this.rotation = this.randomRange(0, 2 * Math.PI);
		this.scale = { x: 1, y: 1 };
		this.velocity = this.initConfettoVelocity(
			this.horizontalBurstRange,
			this.verticalBurstRange,
		);
	}

	randomRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	initConfettoVelocity(xRange, yRange) {
		const x = this.randomRange(xRange[0], xRange[1]);
		const range = yRange[1] - yRange[0] + 1;
		let y =
			yRange[1] - Math.abs(this.randomRange(0, range) + this.randomRange(0, range) - range);
		if (y >= yRange[1] - 1) {
			y += Math.random() < 0.25 ? this.randomRange(1, 3) : 0;
		}
		return { x: x, y: -y };
	}

	update(gravityConfetti, dragConfetti, terminalVelocity) {
		this.velocity.x -= this.velocity.x * dragConfetti;
		this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
		this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
	}

	draw(ctx) {
		const width = this.dimensions.width * this.scale.x;
		const height = this.dimensions.height * this.scale.y;

		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);

		ctx.fillStyle = this.scale.y > 0 ? this.color.front : this.color.back;
		ctx.fillRect(-width / 2, -height / 2, width, height);

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	isOffScreen(canvas) {
		return this.position.y >= canvas.height;
	}
}

class Confetti {
	constructor(settings = {}) {
		console.log(settings);
		this.confetti = [];
		this.canvasSelector = settings.canvasSelector ?? '#confetti';
		this.targetSelector = settings.targetSelector ?? this.canvasSelector;
		this.targetX = settings.targetX ?? 0.5;
		this.targetY = settings.targetY ?? 0.5;
		this.horizontalBurstRange = settings.horizontalBurstRange ?? [-10, 10];
		this.verticalBurstRange = settings.verticalBurstRange ?? [0, 10];
		this.confettiCount = settings.confettiCount ?? 100;
		this.gravityConfetti = settings.gravityConfetti ?? 0.2;
		this.dragConfetti = settings.dragConfetti ?? 0.03;
		this.terminalVelocity = settings.terminalVelocity ?? 4;
		this.particleWidth = settings.particleWidth ?? [6, 10];
		this.particleHeight = settings.particleHeight ?? [10, 20];
		this.colors = settings.colors ?? [
			{ front: '#88C940', back: '#71ab30' },
			{ front: '#FF818F', back: '#af3644' },
			{ front: '#FF9900', back: '#e08600' },
			{ front: '#8E436A', back: '#8E436A' },
		];
		this.fps = settings.fps ?? 60;
		this.fpsInterval = 1000 / this.fps;
		this.canvas = document.querySelector(this.canvasSelector);
		this.dimensions = { width: 0, height: 0 };
		this.coordinates = { x: 0, y: 0 };
		this.lastFrameTime = 0;
		this.ctx = this.canvas.getContext('2d');
		this.resizeCanvas();
		this.initEventListeners();
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	initEventListeners() {
		window.addEventListener('resize', () => {
			this.resizeCanvas();
		});
	}

	initBurst() {
		const el = document.querySelector(this.targetSelector);
		const rect = el?.getBoundingClientRect();

		const { height, width, left, top } = rect;

		const targetYVal = ((top + height * this.targetY) * 100) / window.innerHeight;
		const targetXVal = ((left + width * this.targetX) * 100) / window.innerWidth;

		this.coordinates = {
			x: Number(targetXVal.toFixed(2)) / 100,
			y: Number(targetYVal.toFixed(2)) / 100,
		};

		console.log(this.coordinates);

		this.dimensions = {
			width: this.particleWidth,
			height: this.particleHeight,
		};

		for (let i = 0; i < this.confettiCount; i++) {
			this.confetti.push(
				new Confetto(
					this.colors,
					this.canvas,
					this.coordinates,
					this.dimensions,
					this.horizontalBurstRange,
					this.verticalBurstRange,
				),
			);
		}
	}

	resetAnimation() {
		if (this.animationFrameId !== null) {
			window.cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.confetti = [];
	}

	startAnimation() {
		this.initBurst();
		this.render();
	}

	render() {
		const now = performance.now();
		const elapsed = now - this.lastFrameTime;

		if (elapsed > this.fpsInterval) {
			this.lastFrameTime = now - (elapsed % this.fpsInterval);

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.confetti.forEach((confetto, index) => {
				confetto.update(this.gravityConfetti, this.dragConfetti, this.terminalVelocity);
				confetto.draw(this.ctx);

				if (confetto.isOffScreen(this.canvas)) {
					this.confetti.splice(index, 1);
				}
			});
		}

		this.animationFrameId = window.requestAnimationFrame(() => this.render());
	}
}

export default Confetti;
