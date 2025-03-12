<template>
	<img :src="src" class="stuff-image" />
</template>

<script setup lang="ts">
defineProps({
	src: String,
});
</script>

<style scoped>
.stuff-image {
	width: 70px;
	height: 70px;
	margin: 10px;
	padding: 5px;
	object-fit: contain;
	transition: transform 0.3s ease, opacity 0.3s ease;
	border: 2px solid #ddd;
	border-radius: 5px;

	transition: transform 0.5s ease, opacity 0.5s ease;
}

.stuff-image[src]:not([src=""]) {
	animation: lightUp 0.5s ease-out;
}

@keyframes lightUp {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.1);
		opacity: 1.5;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
