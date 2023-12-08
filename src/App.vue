<template>
	<MainComponent />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainComponent from './components/MainComponent.vue';
export default defineComponent({
	name: 'App',
	components: {
		MainComponent,
	},
});
</script>

<style lang="scss">
body {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	margin: 0;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	width: 100%;
	height: 100%;
	background-color: rgb(218, 222, 222);
}
</style>
