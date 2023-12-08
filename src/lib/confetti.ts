type Color = {
	front: string;
	back: string;
};

type Velocity = {
	x: number;
	y: number;
};
type Settings = {
	canvasSelector: string;
	targetSelector?: string;
	targetX?: number;
	targetY?: number;
	horizontalBurstRange?: [number, number];
	verticalBurstRange?: [number, number];
	particleWidth?: NumberOrPair;
	particleHeight?: NumberOrPair;
	confettiCount?: number;
	gravityConfetti?: number;
	dragConfetti?: number;
	terminalVelocity?: number;
	colors?: Color[];
	fps?: number;
};

type NumberOrPair = number | [number, number];

type Dimensions = {
	width: NumberOrPair;
	height: NumberOrPair;
};

type TargetCoordinates = {
	x: number;
	y: number;
};

class Confetto {
	private randomModifier: number;
	private color: Color;
	private dimensions: { width: number; height: number };
	private position: { x: number; y: number };
	private rotation: number;
	private scale: { x: number; y: number };
	private velocity: Velocity;
	private horizontalBurstPosition: number;
	private verticalBurstPosition: number;
	private horizontalBurstRange: [number, number];
	private verticalBurstRange: [number, number];

	constructor(
		private colors: Color[],
		private canvas: HTMLCanvasElement,
		private coordinates: TargetCoordinates,
		dimensions: Dimensions,
		horizontalBurstRange: [number, number],
		verticalBurstRange: [number, number],
	) {
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

	private randomRange(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	private initConfettoVelocity(xRange: [number, number], yRange: [number, number]): Velocity {
		const x: number = this.randomRange(xRange[0], xRange[1]);
		const range: number = yRange[1] - yRange[0] + 1;
		let y: number =
			yRange[1] - Math.abs(this.randomRange(0, range) + this.randomRange(0, range) - range);
		if (y >= yRange[1] - 1) {
			y += Math.random() < 0.25 ? this.randomRange(1, 3) : 0;
		}
		return { x: x, y: -y };
	}

	public update(gravityConfetti: number, dragConfetti: number, terminalVelocity: number) {
		this.velocity.x -= this.velocity.x * dragConfetti;
		this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
		this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
	}

	public draw(ctx: CanvasRenderingContext2D) {
		const width = this.dimensions.width * this.scale.x;
		const height = this.dimensions.height * this.scale.y;

		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);

		ctx.fillStyle = this.scale.y > 0 ? this.color.front : this.color.back;
		ctx.fillRect(-width / 2, -height / 2, width, height);

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	public isOffScreen(canvas: HTMLCanvasElement): boolean {
		return this.position.y >= canvas.height;
	}
}

class Confetti {
	private confetti: Confetto[] = [];
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private colors: Color[];
	private animationFrameId: number | null = null;
	private lastFrameTime = 0;
	private fpsInterval: number;
	private confettiCount: number;
	private gravityConfetti: number;
	private dragConfetti: number;
	private terminalVelocity: number;
	private canvasSelector: string;
	private targetSelector: string | undefined;
	private targetX: number;
	private targetY: number;
	private particleWidth: NumberOrPair;
	private particleHeight: NumberOrPair;
	private verticalBurstRange: [number, number];
	private horizontalBurstRange: [number, number];
	private fps: number;
	private dimensions: Dimensions;
	private coordinates: TargetCoordinates;

	constructor(settings?: Settings) {
		this.canvasSelector = settings?.canvasSelector ?? '#confetti'; // Canvas selector
		this.targetSelector = settings?.targetSelector ?? this?.canvasSelector; // Target container element
		this.targetX = settings?.targetX ?? 0.5; // Target container burst coordination X
		this.targetY = settings?.targetY ?? 0.5; // Target container burst coordination Y
		this.horizontalBurstRange = settings?.horizontalBurstRange ?? [-10, 10]; // Target container burst range X;
		this.verticalBurstRange = settings?.verticalBurstRange ?? [0, 10]; // Target container burst range Y;
		this.confettiCount = settings?.confettiCount ?? 100; // Confetti count
		this.gravityConfetti = settings?.gravityConfetti ?? 0.2; // Confetto gravity factor
		this.dragConfetti = settings?.dragConfetti ?? 0.03; // Confetto drag power
		this.terminalVelocity = settings?.terminalVelocity ?? 4;
		this.particleWidth = settings?.particleWidth ?? [6, 10]; // Particle width - array of two number to generate random or single number for fixed width
		this.particleHeight = settings?.particleHeight ?? [10, 20]; // Particle height - array of two number to generate random or single number for fixed height
		this.colors = settings?.colors ?? [
			{ front: '#88C940', back: '#71ab30' },
			{ front: '#FF818F', back: '#af3644' },
			{ front: '#FF9900', back: '#e08600' },
			{ front: '#8E436A', back: '#8E436A' },
		]; // Array of colors
		this.fps = settings?.fps ?? 60; // FPS to make consistent across all screens with different refresh rates
		this.fpsInterval = 1000 / this.fps;
		this.canvas = document.querySelector(this.canvasSelector) as HTMLCanvasElement;
		this.dimensions = { width: 0, height: 0 };
		this.coordinates = { x: 0, y: 0 };
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.resizeCanvas();
		this.initEventListeners();
	}
	private resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	private initEventListeners() {
		window.addEventListener('resize', () => {
			this.resizeCanvas();
		});
	}

	private initBurst() {
		if (!this.targetSelector) return;

		const el = document.querySelector(this.targetSelector);
		const rect = el?.getBoundingClientRect();

		if (!rect) return;

		const { height, width, left, top } = rect;

		const targetYVal = ((top + height * this.targetY) * 100) / window.innerHeight;
		const targetXVal = ((left + width * this.targetX) * 100) / window.innerWidth;

		this.coordinates = {
			x: Number(targetXVal.toFixed(2)) / 100,
			y: Number(targetYVal.toFixed(2)) / 100,
		};

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

	public resetAnimation() {
		if (this.animationFrameId !== null) {
			window.cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.confetti = [];
	}

	public startAnimation() {
		this.initBurst();
		this.render();
	}

	private render() {
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
