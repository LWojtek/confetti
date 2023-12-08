<template>
	<canvas id="confetti"></canvas>
	<div class="mainComponent">
		<button class="button button--start" @click="confetti.startAnimation()">
			Start confetti
		</button>
		<button class="button button--reset" @click="confetti.resetAnimation()">
			Reset confetti
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Confetti from '../lib/confetti';

const confetti = ref();

onMounted(() => {
	const settings = {
		canvasSelector: '#confetti',
		targetSelector: '.mainComponent',
		targetX: 0.5,
		targetY: 0,
	};
	confetti.value = new Confetti(settings);
});
</script>

<style scoped lang="scss">
.mainComponent {
	display: flex;
	justify-content: center;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 600px;
	height: 500px;
	background-color: white;
	border-radius: 16px;
	box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.1);
}

#confetti {
	position: relative;
	z-index: 999;
	pointer-events: none;
	width: 100%;
}

.button {
	display: inline-block;
	margin-top: auto;
	border: none;
	padding: 12px 20px;
	cursor: pointer;
	font-weight: 600;
	letter-spacing: 0.5px;
	text-transform: uppercase;
}

.button--start {
	background-color: lightgreen;
}

.button--reset {
	background-color: tomato;
}
</style>
